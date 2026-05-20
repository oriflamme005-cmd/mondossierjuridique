// api/chat.js
// ─────────────────────────────────────────────────────────────────────────────
// Serverless function : passerelle sécurisée vers l'API Anthropic
//
// IMPORTANT — Cette fonction TRADUIT le format frontend → format Anthropic.
// L'ancienne version transmettait directement `req.body` à Anthropic, ce qui
// produisait des erreurs silencieuses car Anthropic exige model + max_tokens
// + messages, alors que le frontend envoie { message, context }.
// ─────────────────────────────────────────────────────────────────────────────

const ANTHROPIC_MODEL = 'claude-sonnet-4-5';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// Prompt système pour la génération de dossiers juridiques
const SYSTEM_PROMPT_DOSSIER = `Tu es un juriste expert en droit français avec 25 ans d'expérience, ancien avocat au barreau de Paris, spécialiste de la rédaction de dossiers juridiques pour des particuliers.

Ta mission : produire un DOSSIER JURIDIQUE COMPLET, RIGOUREUX et DIGNE DES MEILLEURS AVOCATS.

EXIGENCES IMPÉRATIVES :
1. Citer les articles de loi avec leur numéro EXACT (Code civil, Code du travail, Code de procédure civile, etc.)
2. Citer la jurisprudence avec références complètes : Cour de cassation, chambre, date, numéro de pourvoi (ex : Cass. soc., 12 juin 2024, n° 22-19.853)
3. Calculer les indemnités/préjudices avec une méthodologie chiffrée et détaillée
4. Proposer une stratégie procédurale claire (juridiction compétente, délais de prescription, étapes)
5. Rédiger des modèles de courriers (mise en demeure, saisine) prêts à l'emploi
6. Utiliser un langage juridique précis mais accessible
7. Lister précisément les pièces à réunir
8. Identifier les risques et points faibles du dossier

FORMAT : utilise des titres clairs en MAJUSCULES, numérotation hiérarchique, mise en forme aérée. Pas de markdown brut (pas de #, **, etc.) — utilise plutôt des titres en majuscules et des tirets pour les listes.

LONGUEUR : 4000 à 8000 mots selon la complexité. Sois exhaustif.

Si une information manque, formule des hypothèses raisonnables que le client devra vérifier (signalées par "À CONFIRMER :").`;

// Prompt système pour le chat assistant
const SYSTEM_PROMPT_CHAT = `Tu es un assistant juridique français expert. Tu réponds aux questions des utilisateurs de MonDossierJuridique.fr de manière claire, précise et utile.

Règles :
- Cite les articles de loi pertinents quand utile
- Reste pédagogue et accessible
- Si la question dépasse l'aide juridique générale, recommande de consulter un avocat
- Réponds en français, de manière concise (3-6 phrases sauf si plus est nécessaire)`;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY non configurée');
    return res.status(500).json({
      error: 'Configuration serveur incomplète',
      response: "Le service est temporairement indisponible. Veuillez contacter le support à contact@mondossierjuridique.fr."
    });
  }

  try {
    const { message, context = [], mode = 'chat' } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message manquant',
        response: "Aucun message reçu. Veuillez réessayer."
      });
    }

    // Choix du prompt système selon le mode
    const isDossier = mode === 'dossier' || /GÉNÈRE UN DOSSIER JURIDIQUE COMPLET/i.test(message);
    const systemPrompt = isDossier ? SYSTEM_PROMPT_DOSSIER : SYSTEM_PROMPT_CHAT;
    const maxTokens = isDossier ? 16000 : 1500;

    // Construire l'historique au format Anthropic { role, content }
    const messages = [];
    if (Array.isArray(context)) {
      for (const m of context) {
        if (m && m.role && m.content) {
          messages.push({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: String(m.content)
          });
        }
      }
    }
    messages.push({ role: 'user', content: message });

    // Appel à l'API Anthropic
    const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: messages
      })
    });

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error('Anthropic API error:', anthropicResponse.status, errorText);
      return res.status(anthropicResponse.status).json({
        error: 'Erreur API Anthropic',
        details: errorText,
        response: "Une erreur est survenue lors de la génération. Veuillez réessayer dans quelques instants. Si le problème persiste, contactez contact@mondossierjuridique.fr."
      });
    }

    const data = await anthropicResponse.json();

    // Extraire le texte de la réponse Anthropic
    // Format : { content: [{ type: 'text', text: '...' }, ...] }
    let responseText = '';
    if (Array.isArray(data.content)) {
      responseText = data.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('\n');
    }

    if (!responseText) {
      console.error('Réponse Anthropic vide:', JSON.stringify(data));
      return res.status(500).json({
        error: 'Réponse vide',
        response: "La génération n'a produit aucun résultat. Veuillez réessayer."
      });
    }

    // Retourner au format attendu par le frontend
    return res.status(200).json({
      response: responseText,
      usage: data.usage || null
    });

  } catch (error) {
    console.error('Erreur serveur chat.js:', error);
    return res.status(500).json({
      error: 'Erreur interne',
      message: error.message,
      response: "Une erreur technique est survenue. Vos saisies sont sauvegardées localement. Veuillez réessayer."
    });
  }
};
