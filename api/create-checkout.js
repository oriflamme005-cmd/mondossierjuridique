const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'MonDossierJuridique - Dossier Juridique Complet',
              description: 'Dossier juridique complet 40-60 pages + assistant chat',
            },
            unit_amount: 4900, // 49€
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'https://mondossierjuridique.fr'}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'https://mondossierjuridique.fr'}`,
    });

    res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Erreur lors de la création du paiement', details: error.message });
  }
};
