// api/create-checkout.js
// Endpoint pour créer une session de paiement Stripe

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { plan, email } = req.body;

    // Configuration des plans
    const PLANS = {
      essentiel: {
        name: 'Essentiel - 1 dossier',
        price: 2900, // en centimes (29€)
        dossiers: 1,
      },
      standard: {
        name: 'Standard - 3 dossiers',
        price: 4900, // en centimes (49€)
        dossiers: 3,
      },
      premium: {
        name: 'Premium - 10 dossiers',
        price: 9900, // en centimes (99€)
        dossiers: 10,
      },
    };

    const selectedPlan = PLANS[plan];

    if (!selectedPlan) {
      return res.status(400).json({ error: 'Plan invalide' });
    }

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `MonDossierJuridique - ${selectedPlan.name}`,
              description: `${selectedPlan.dossiers} dossier(s) juridique(s) complet(s)`,
              images: ['https://mondossierjuridique.fr/logo.png'], // Optionnel
            },
            unit_amount: selectedPlan.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      locale: 'fr',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'https://mondossierjuridique.fr'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'https://mondossierjuridique.fr'}/pricing`,
      metadata: {
        plan: plan,
        dossiers: selectedPlan.dossiers.toString(),
        email: email,
      },
    });

    res.status(200).json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création du paiement',
      details: error.message 
    });
  }
};
