# ⚖️ MonDossierJuridique.fr

> Plateforme de génération de dossiers juridiques personnalisés par IA

![Version](https://img.shields.io/badge/version-3.0.0-blue)
![Domain](https://img.shields.io/badge/domain-mondossierjuridique.fr-green)

## 🌐 Site web

**URL de production** : https://mondossierjuridique.fr

---

## ✨ Nouveautés version 3.0

- 🔧 **Bug critique corrigé** : la génération de dossier fonctionne enfin de bout en bout
  (l'ancien `chat.js` ne transmettait pas le bon format à l'API Anthropic)
- 💰 **Prix : 99€** (au lieu de 49€)
- 📧 **Email automatique de notification** à chaque souscription (admin + client)
- 💾 **Sauvegarde automatique** des saisies dans le navigateur (localStorage)
- 📁 **Liste des dossiers** générés, consultables et téléchargeables à tout moment
- ✏️ **Mode édition** : le client peut modifier le dossier généré directement
- 📥 **Téléchargement PDF** stylé (page de garde, pagination, mise en forme) en plus du TXT
- ⏳ **Indicateur de progression animé** pendant la génération (7 étapes visuelles)
- ⚠️ **Messages d'erreur clairs** si la génération échoue, sans perte des saisies

---

## 🚀 Déploiement sur Vercel

### 1. Push du code sur GitHub

```bash
git add .
git commit -m "v3.0 : fix génération + email + autosave + PDF"
git push origin main
```

Vercel redéploiera automatiquement.

### 2. Variables d'environnement Vercel (Settings → Environment Variables)

| Variable | Obligatoire ? | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ **OUI** | Clé API Anthropic (sk-ant-...) — pour la génération |
| `STRIPE_SECRET_KEY` | ✅ **OUI** | Clé secrète Stripe (sk_live_... ou sk_test_...) |
| `STRIPE_WEBHOOK_SECRET` | ✅ **OUI** | Secret du webhook Stripe (whsec_...) |
| `RESEND_API_KEY` | ⚠️ **Recommandé** | Clé API Resend — sans elle, **aucun email** ne sera envoyé |
| `ADMIN_EMAIL` | ⚠️ Recommandé | Email où recevoir les notifications de paiement (défaut : `contact@mondossierjuridique.fr`) |
| `NEXT_PUBLIC_URL` | Optionnel | URL publique (défaut : `https://mondossierjuridique.fr`) |

**Après modification d'une variable, n'oubliez pas de redéployer.**

### 3. Configuration du webhook Stripe

Dans le Dashboard Stripe → Developers → Webhooks → Add endpoint :

- **URL** : `https://mondossierjuridique.fr/api/webhook-stripe`
- **Events à écouter** :
  - `checkout.session.completed`
  - `payment_intent.payment_failed`
- Récupérez le **Signing secret** (`whsec_...`) → variable `STRIPE_WEBHOOK_SECRET`

### 4. Configuration Resend (pour les emails)

1. Compte sur [resend.com](https://resend.com)
2. **Vérifier le domaine** `mondossierjuridique.fr` (ajout de DNS chez OVH)
3. Récupérer la clé API → variable `RESEND_API_KEY`
4. L'envoi se fait depuis `noreply@mondossierjuridique.fr`

---

## 📁 Structure

```
mondossierjuridique/
├── api/
│   ├── chat.js              # ⭐ Passerelle Anthropic API (sécurise la clé)
│   ├── create-checkout.js   # Création session Stripe Checkout (99€)
│   ├── webhook-stripe.js    # Webhook : reçoit paiement + envoie emails
│   └── contact.js           # Formulaire de contact
├── public/
│   ├── index.html
│   └── product-image.png
├── src/
│   ├── App.jsx              # Application React (landing + paiement + générateur)
│   └── index.js
├── package.json
├── vercel.json
└── README.md
```

---

## 🔧 Tests locaux

```bash
npm install
npm start              # Lance React (port 3000)
# Note : les endpoints /api/* ne fonctionnent qu'une fois déployés sur Vercel
# ou avec `vercel dev` (`npm i -g vercel`)
```

---

## 🆘 Dépannage

### "Rien ne se passe quand le client clique sur Générer mon dossier"
→ **C'était le bug critique de la v2.** Corrigé en v3 dans `api/chat.js`.
   Vérifiez que `ANTHROPIC_API_KEY` est bien configurée dans Vercel.

### "Pas d'email reçu lors d'une souscription"
→ Vérifier `RESEND_API_KEY` et `ADMIN_EMAIL` dans Vercel
→ Vérifier que le webhook Stripe est correctement configuré
→ Consulter les logs Vercel : Functions → webhook-stripe → Logs

### "Le client a perdu ses saisies"
→ Désormais impossible : autosave dans localStorage à chaque frappe.
   Le client peut fermer la page et revenir, ses saisies seront restaurées.

---

## ⚠️ Mention légale

Service d'aide à la constitution de dossiers juridiques.
**Ne remplace pas la consultation d'un avocat inscrit au barreau.**
