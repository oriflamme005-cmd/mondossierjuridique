// api/webhook-stripe.js
// ─────────────────────────────────────────────────────────────────────────────
// Webhook Stripe : reçoit les confirmations de paiement et :
//  1. Envoie un email de NOTIFICATION à l'administrateur (Ori)
//  2. Envoie un email de CONFIRMATION au client
//
// Variables d'environnement requises :
//   - STRIPE_SECRET_KEY        : clé secrète Stripe
//   - STRIPE_WEBHOOK_SECRET    : secret du webhook (généré dans Stripe Dashboard)
//   - RESEND_API_KEY           : clé API Resend (pour envoi d'emails)
//   - ADMIN_EMAIL              : email où recevoir les notifications de paiement
//                                (défaut : contact@mondossierjuridique.fr)
// ─────────────────────────────────────────────────────────────────────────────

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// IMPORTANT : désactiver le body parser par défaut de Vercel
// (Stripe a besoin du corps brut pour vérifier la signature)
export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

/**
 * Envoie un email via Resend.
 * Renvoie true si succès, false sinon.
 */
async function sendEmail({ to, subject, html, replyTo }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY non configurée — email non envoyé');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'MonDossierJuridique <noreply@mondossierjuridique.fr>',
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {})
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur Resend:', response.status, errorText);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception Resend:', err);
    return false;
  }
}

/**
 * Email de notification à l'administrateur (Ori)
 */
function buildAdminEmail({ customerEmail, amount, sessionId, createdAt }) {
  const dateFormatted = new Date(createdAt * 1000).toLocaleString('fr-FR', {
    timeZone: 'Europe/Paris',
    dateStyle: 'full',
    timeStyle: 'short'
  });
  const amountFormatted = (amount / 100).toFixed(2).replace('.', ',') + ' €';

  return {
    subject: `💰 Nouvelle souscription — ${customerEmail}`,
    html: `
      <!DOCTYPE html>
      <html lang="fr">
      <head><meta charset="utf-8"></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f9fa; padding: 24px; color: #2d3748;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 32px; text-align: center;">
            <h1 style="color: #c9a227; margin: 0; font-size: 24px;">💰 Nouvelle souscription</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">MonDossierJuridique.fr</p>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #1a1a2e; font-size: 18px; margin: 0 0 16px;">Détails du paiement</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Client</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; text-align: right;">${customerEmail}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Montant</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; text-align: right; color: #059669;">${amountFormatted}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Date</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; text-align: right;">${dateFormatted}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6b7280;">Session Stripe</td>
                <td style="padding: 12px 0; font-family: monospace; font-size: 12px; text-align: right;">${sessionId}</td>
              </tr>
            </table>
            <div style="margin-top: 24px; padding: 16px; background: #fffbeb; border-left: 4px solid #c9a227; border-radius: 6px;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">
                <strong>Action :</strong> Le client a accès à la plateforme et peut générer son dossier juridique.
              </p>
            </div>
          </div>
          <div style="padding: 16px 32px; background: #f8f9fa; text-align: center; font-size: 12px; color: #6b7280;">
            Email automatique généré par votre plateforme MonDossierJuridique.fr
          </div>
        </div>
      </body>
      </html>
    `
  };
}

/**
 * Email de confirmation au client
 */
function buildClientEmail({ customerEmail }) {
  return {
    subject: 'Confirmation de votre commande — MonDossierJuridique.fr',
    html: `
      <!DOCTYPE html>
      <html lang="fr">
      <head><meta charset="utf-8"></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f9fa; padding: 24px; color: #2d3748;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 32px; text-align: center;">
            <h1 style="color: #c9a227; margin: 0; font-size: 28px;">⚖️ MonDossierJuridique</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Aide juridique en ligne</p>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #1a1a2e; font-size: 22px; margin: 0 0 16px;">Merci pour votre achat !</h2>
            <p style="font-size: 16px; line-height: 1.6;">
              Bonjour,<br><br>
              Votre paiement a bien été reçu. Vous avez désormais <strong>accès complet</strong> à votre dossier juridique.
            </p>
            <div style="margin: 24px 0; padding: 20px; background: #ecfdf5; border-left: 4px solid #059669; border-radius: 6px;">
              <h3 style="margin: 0 0 12px; color: #065f46; font-size: 16px;">📋 Prochaines étapes</h3>
              <ol style="margin: 0; padding-left: 20px; color: #047857; line-height: 1.8;">
                <li>Retournez sur <a href="https://mondossierjuridique.fr" style="color: #059669; font-weight: 600;">mondossierjuridique.fr</a></li>
                <li>Choisissez le domaine de votre litige</li>
                <li>Remplissez le questionnaire détaillé</li>
                <li>Cliquez sur <strong>"Générer mon dossier"</strong></li>
                <li>Téléchargez votre dossier (PDF) en quelques clics</li>
              </ol>
            </div>
            <div style="margin: 24px 0; padding: 16px; background: #eff6ff; border-radius: 6px;">
              <p style="margin: 0; font-size: 14px; color: #1e40af;">
                💡 <strong>Conseil :</strong> Vos saisies sont automatiquement sauvegardées dans votre navigateur.
                Vous pouvez revenir plus tard et reprendre là où vous en étiez.
              </p>
            </div>
            <p style="font-size: 14px; color: #6b7280; margin-top: 32px;">
              Pour toute question, répondez simplement à cet email ou contactez-nous à
              <a href="mailto:contact@mondossierjuridique.fr" style="color: #c9a227;">contact@mondossierjuridique.fr</a>.
            </p>
            <p style="font-size: 14px; color: #6b7280;">
              Cordialement,<br>
              L'équipe MonDossierJuridique
            </p>
          </div>
          <div style="padding: 16px 32px; background: #f8f9fa; text-align: center; font-size: 12px; color: #6b7280;">
            MonDossierJuridique.fr — Service d'aide à la constitution de dossiers juridiques.<br>
            Ce service ne remplace pas la consultation d'un avocat inscrit au barreau.
          </div>
        </div>
      </body>
      </html>
    `
  };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Vérification signature webhook échouée:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gestion des événements
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const customerEmail = session.customer_email || session.customer_details?.email || session.metadata?.email;
      const amount = session.amount_total || 0;
      const sessionId = session.id;
      const createdAt = session.created;

      console.log('✅ Paiement reçu');
      console.log(`   Email   : ${customerEmail}`);
      console.log(`   Montant : ${(amount / 100).toFixed(2)} €`);
      console.log(`   Session : ${sessionId}`);

      // 1. Email de notification à l'administrateur
      const adminEmail = process.env.ADMIN_EMAIL || 'contact@mondossierjuridique.fr';
      const adminTpl = buildAdminEmail({ customerEmail, amount, sessionId, createdAt });
      const adminOk = await sendEmail({
        to: adminEmail,
        subject: adminTpl.subject,
        html: adminTpl.html,
        replyTo: customerEmail
      });
      console.log(`   Email admin (${adminEmail}) : ${adminOk ? 'envoyé ✓' : 'échec ✗'}`);

      // 2. Email de confirmation au client
      if (customerEmail) {
        const clientTpl = buildClientEmail({ customerEmail });
        const clientOk = await sendEmail({
          to: customerEmail,
          subject: clientTpl.subject,
          html: clientTpl.html
        });
        console.log(`   Email client : ${clientOk ? 'envoyé ✓' : 'échec ✗'}`);
      }

      break;
    }

    case 'payment_intent.payment_failed': {
      const failedPayment = event.data.object;
      console.error('❌ Paiement échoué:', failedPayment.last_payment_error?.message);
      break;
    }

    default:
      console.log(`Événement non géré: ${event.type}`);
  }

  res.status(200).json({ received: true });
};
