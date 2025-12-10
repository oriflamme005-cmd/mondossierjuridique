// api/webhook-stripe.js
// Webhook pour recevoir les confirmations de paiement Stripe

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Désactiver le body parser par défaut pour les webhooks
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
    console.error(`Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gérer les différents événements
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Extraire les informations
      const customerEmail = session.customer_email || session.metadata.email;
      const plan = session.metadata.plan;
      const dossiers = session.metadata.dossiers;
      
      console.log('✅ Paiement réussi !');
      console.log(`   Email: ${customerEmail}`);
      console.log(`   Plan: ${plan}`);
      console.log(`   Dossiers: ${dossiers}`);
      
      // ICI : Ajouter votre logique pour :
      // 1. Créer le compte utilisateur dans votre base de données
      // 2. Envoyer un email de confirmation
      // 3. Activer l'accès aux dossiers
      
      // Exemple avec une base de données (à adapter) :
      /*
      await db.users.create({
        email: customerEmail,
        plan: plan,
        dossiers_remaining: parseInt(dossiers),
        stripe_session_id: session.id,
        created_at: new Date(),
      });
      
      // Envoyer email de bienvenue
      await sendWelcomeEmail(customerEmail, plan);
      */
      
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.error('❌ Paiement échoué:', failedPayment.last_payment_error?.message);
      break;
      
    default:
      console.log(`Événement non géré: ${event.type}`);
  }

  res.status(200).json({ received: true });
};
