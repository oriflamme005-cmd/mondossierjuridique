// ContactPage.jsx
// Page de contact avec formulaire
// Email: contact@mondossierjuridique.fr

import React, { useState } from 'react';

const ContactPage = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: 'success', message: 'Votre message a été envoyé ! Nous vous répondrons sous 24h.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else if (data.fallback && data.mailto) {
        // Fallback to mailto
        window.location.href = data.mailto;
        setStatus({ type: 'info', message: 'Redirection vers votre client email...' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Erreur lors de l\'envoi. Veuillez réessayer.' });
      }
    } catch (error) {
      // Direct mailto fallback
      const mailto = `mailto:contact@mondossierjuridique.fr?subject=${encodeURIComponent(formData.subject || 'Contact')}&body=${encodeURIComponent(`Nom: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
      window.location.href = mailto;
      setStatus({ type: 'info', message: 'Redirection vers votre client email...' });
    }

    setLoading(false);
  };

  return (
    <div className="contact-page">
      <style>{`
        .contact-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        
        .contact-header {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: white;
          padding: 4rem 2rem 3rem;
          text-align: center;
        }
        
        .contact-header h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        
        .contact-header p {
          color: rgba(255,255,255,0.8);
          font-size: 1.1rem;
        }
        
        .contact-back-btn {
          position: absolute;
          top: 1.5rem;
          left: 2rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s;
        }
        
        .contact-back-btn:hover {
          background: rgba(255,255,255,0.2);
        }
        
        .contact-container {
          max-width: 1100px;
          margin: -2rem auto 3rem;
          padding: 0 1.5rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        @media (max-width: 768px) {
          .contact-container {
            grid-template-columns: 1fr;
          }
        }
        
        .contact-info {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
        }
        
        .contact-info h2 {
          font-family: 'Playfair Display', Georgia, serif;
          color: #1a1a2e;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .contact-info-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 12px;
          transition: all 0.3s;
        }
        
        .contact-info-item:hover {
          background: #f0f0f0;
          transform: translateX(5px);
        }
        
        .contact-info-icon {
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #c9a227, #d4af37);
          border-radius: 10px;
        }
        
        .contact-info-content h3 {
          font-size: 1rem;
          color: #1a1a2e;
          margin-bottom: 0.25rem;
        }
        
        .contact-info-content p {
          color: #6b7280;
          font-size: 0.95rem;
        }
        
        .contact-info-content a {
          color: #c9a227;
          text-decoration: none;
          font-weight: 500;
        }
        
        .contact-info-content a:hover {
          text-decoration: underline;
        }
        
        .contact-hours {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }
        
        .contact-hours h3 {
          font-size: 1.1rem;
          color: #1a1a2e;
          margin-bottom: 1rem;
        }
        
        .contact-hours p {
          color: #6b7280;
          font-size: 0.95rem;
          line-height: 1.8;
        }
        
        .contact-form-card {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
        }
        
        .contact-form-card h2 {
          font-family: 'Playfair Display', Georgia, serif;
          color: #1a1a2e;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1.25rem;
        }
        
        .form-group label {
          display: block;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }
        
        .form-group label span {
          color: #dc2626;
        }
        
        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.3s;
          background: #fafafa;
        }
        
        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #c9a227;
          background: white;
          box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.1);
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 150px;
        }
        
        .form-submit {
          width: 100%;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #c9a227 0%, #d4af37 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .form-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(201, 162, 39, 0.4);
        }
        
        .form-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .form-status {
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 1rem;
          font-weight: 500;
        }
        
        .form-status.success {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }
        
        .form-status.error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }
        
        .form-status.info {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }
        
        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .contact-footer {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
          font-size: 0.9rem;
        }
        
        .contact-footer a {
          color: #c9a227;
          text-decoration: none;
        }
      `}</style>

      <div className="contact-header" style={{ position: 'relative' }}>
        <button className="contact-back-btn" onClick={onBack}>← Retour au site</button>
        <h1>📧 Contactez-nous</h1>
        <p>Notre équipe JuriFrance vous répond sous 24 heures</p>
      </div>

      <div className="contact-container">
        {/* Informations de contact */}
        <div className="contact-info">
          <h2>Nos coordonnées</h2>
          
          <div className="contact-info-item">
            <div className="contact-info-icon">📧</div>
            <div className="contact-info-content">
              <h3>Email</h3>
              <p><a href="mailto:contact@mondossierjuridique.fr">contact@mondossierjuridique.fr</a></p>
            </div>
          </div>
          
          <div className="contact-info-item">
            <div className="contact-info-icon">💬</div>
            <div className="contact-info-content">
              <h3>Chat en direct</h3>
              <p>Disponible en bas à droite de votre écran</p>
            </div>
          </div>
          
          <div className="contact-info-item">
            <div className="contact-info-icon">📍</div>
            <div className="contact-info-content">
              <h3>Localisation</h3>
              <p>France métropolitaine</p>
            </div>
          </div>
          
          <div className="contact-info-item">
            <div className="contact-info-icon">⚡</div>
            <div className="contact-info-content">
              <h3>Temps de réponse</h3>
              <p>Sous 24 heures (jours ouvrés)</p>
            </div>
          </div>
          
          <div className="contact-hours">
            <h3>🕐 Horaires de réponse</h3>
            <p>
              Lundi - Vendredi : 9h - 18h<br/>
              Samedi : 9h - 13h<br/>
              Dimanche : Fermé
            </p>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div className="contact-form-card">
          <h2>Envoyez-nous un message</h2>
          
          {status.message && (
            <div className={`form-status ${status.type}`}>
              {status.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Votre nom <span>*</span></label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jean Dupont"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Votre email <span>*</span></label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="jean.dupont@email.fr"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Sujet</label>
              <select
                name="subject"
                className="form-select"
                value={formData.subject}
                onChange={handleChange}
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="Question sur le service">Question sur le service</option>
                <option value="Problème technique">Problème technique</option>
                <option value="Demande de remboursement">Demande de remboursement</option>
                <option value="Partenariat">Partenariat</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Votre message <span>*</span></label>
              <textarea
                name="message"
                className="form-textarea"
                value={formData.message}
                onChange={handleChange}
                placeholder="Décrivez votre demande en détail..."
                required
              />
            </div>
            
            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Envoi en cours...
                </>
              ) : (
                <>
                  📤 Envoyer le message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="contact-footer">
        <p>
          MonDossierJuridique.fr - Service d'aide juridique par IA<br/>
          <a href="/" onClick={(e) => { e.preventDefault(); onBack(); }}>Retour à l'accueil</a>
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
