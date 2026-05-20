// api/create-checkout.js
// Création d'une session Stripe Checkout pour MonDossierJuridique.fr
// Prix : 99€ par dossier juridique complet

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY non configurée');
    return res.status(500).json({ error: 'Configuration Stripe manquante' });
  }

  try {
    const { email } = req.body || {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://mondossierjuridique.fr';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'MonDossierJuridique — Dossier Juridique Complet',
              description: 'Dossier juridique complet généré par IA + assistant chat. Accès immédiat.',
            },
            unit_amount: 9900, // 99,00 €
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Metadata utilisées par le webhook pour notifier l'admin
      metadata: {
        product: 'dossier_juridique_complet',
        plan: 'single',
        dossiers: '1',
        email: email,
        source: 'mondossierjuridique.fr'
      },
      payment_intent_data: {
        metadata: {
          product: 'dossier_juridique_complet',
          email: email
        }
      },
      success_url: `${baseUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}`,
      locale: 'fr',
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });

  } catch (error) {
    console.error('Erreur Stripe create-checkout:', error);
    return res.status(500).json({
      error: 'Erreur lors de la création du paiement',
      details: error.message
    });
  }
};
