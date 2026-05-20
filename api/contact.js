// api/contact.js
// Endpoint pour le formulaire de contact
// Envoie les messages à l'administrateur via Brevo

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

  // Construction du contenu HTML
  const htmlContent = `
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
  `;

  // Destinataires : la (ou les) adresse(s) admin
  // Par défaut, on envoie aux deux adresses si ADMIN_EMAIL n'est pas défini
  const adminEmailsRaw = process.env.ADMIN_EMAIL || 'contact@mondossierjuridique.fr,illumitrade.contact@gmail.com';
  const adminEmails = adminEmailsRaw.split(',').map(e => e.trim()).filter(Boolean);
  const recipients = adminEmails.map(em => ({ email: em }));

  try {
    if (process.env.BREVO_API_KEY) {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            email: 'noreply@mondossierjuridique.fr',
            name: 'MonDossierJuridique - Contact'
          },
          to: recipients,
          replyTo: { email },
          subject: `[Contact] ${subject || 'Nouveau message'} - ${name}`,
          htmlContent
        })
      });

      if (response.ok) {
        return res.status(200).json({ success: true, message: 'Message envoyé avec succès' });
      }

      const errorText = await response.text();
      console.error('Erreur Brevo (contact):', response.status, errorText);
    } else {
      console.warn('BREVO_API_KEY non configurée');
    }

    // Fallback : si Brevo n'est pas configuré ou a échoué, on renvoie un mailto
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
