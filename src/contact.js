// api/contact.js
// Endpoint pour le formulaire de contact
// Envoie les messages à contact@mondossierjuridique.fr

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  try {
    // Option 1: Using Resend (if RESEND_API_KEY is set)
    if (process.env.RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'MonDossierJuridique <noreply@mondossierjuridique.fr>',
          to: 'contact@mondossierjuridique.fr',
          subject: `[Contact] ${subject || 'Nouveau message'} - ${name}`,
          html: `
            <h2>Nouveau message de contact</h2>
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Sujet :</strong> ${subject || 'Non spécifié'}</p>
            <hr>
            <h3>Message :</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
              Ce message a été envoyé depuis le formulaire de contact de MonDossierJuridique.fr
            </p>
          `,
          reply_to: email
        })
      });

      if (response.ok) {
        return res.status(200).json({ success: true, message: 'Message envoyé avec succès' });
      }
    }

    // Option 2: Using Formspree (free, no API key needed)
    // Formspree form ID to be created at formspree.io
    const formspreeEndpoint = 'https://formspree.io/f/myzknwvl'; // Replace with your Formspree ID
    
    const formspreeResponse = await fetch(formspreeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        subject: subject || 'Contact depuis le site',
        message,
        _replyto: email,
        _subject: `[MonDossierJuridique] Message de ${name}`
      })
    });

    if (formspreeResponse.ok) {
      return res.status(200).json({ success: true, message: 'Message envoyé avec succès' });
    }

    // If all else fails, return mailto link
    return res.status(200).json({ 
      success: true, 
      fallback: true,
      mailto: `mailto:contact@mondossierjuridique.fr?subject=${encodeURIComponent(subject || 'Contact')}&body=${encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de l\'envoi du message',
      mailto: `mailto:contact@mondossierjuridique.fr?subject=${encodeURIComponent(subject || 'Contact')}&body=${encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`
    });
  }
}
