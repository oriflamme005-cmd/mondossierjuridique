import React, { useState, useEffect } from 'react';

// ════════════════════════════════════════════════════════════════════════════════════════
// MONDOSSIERJURIDIQUE.FR - APPLICATION COMPLÈTE
// Landing Page + Paiement Stripe + Application Dossiers Juridiques + Mentions Légales + Contact
// ════════════════════════════════════════════════════════════════════════════════════════

// PRIX UNIQUE
const SINGLE_PRICE = { price: 49, name: 'Dossier Juridique', dossiers: 1, description: '1 dossier juridique complet' };

const DOMAINES = {
  travail: {
    nom: "Droit du Travail", icone: "💼", couleur: "#2563eb",
    categories: [
      { id: "licenciement", nom: "Licenciement", desc: "Abusif, économique, inaptitude" },
      { id: "harcelement", nom: "Harcèlement", desc: "Moral, sexuel, discrimination" },
      { id: "salaire", nom: "Rappel de salaire", desc: "Heures sup, primes, congés" },
      { id: "autre_travail", nom: "⊕ Autre litige travail", desc: "Décrivez votre situation", isAutre: true },
    ]
  },
  famille: {
    nom: "Droit de la Famille", icone: "👨‍👩‍👧‍👦", couleur: "#dc2626",
    categories: [
      { id: "divorce", nom: "Divorce", desc: "Contentieux, consentement mutuel" },
      { id: "pension", nom: "Pension alimentaire", desc: "Fixation, révision, impayés" },
      { id: "garde", nom: "Garde d'enfants", desc: "Résidence, droit de visite" },
      { id: "autre_famille", nom: "⊕ Autre litige famille", desc: "Décrivez votre situation", isAutre: true },
    ]
  },
  succession: {
    nom: "Successions", icone: "📜", couleur: "#8b5cf6",
    categories: [
      { id: "testament", nom: "Contestation testament", desc: "Nullité, interprétation" },
      { id: "reserve", nom: "Atteinte à la réserve", desc: "Action en réduction" },
      { id: "partage", nom: "Partage succession", desc: "Blocage, désaccord" },
      { id: "autre_succession", nom: "⊕ Autre litige", desc: "Décrivez votre situation", isAutre: true },
    ]
  },
  immobilier: {
    nom: "Droit Immobilier", icone: "🏠", couleur: "#16a34a",
    categories: [
      { id: "expulsion", nom: "Expulsion", desc: "Procédure, délais, recours" },
      { id: "impayes", nom: "Loyers impayés", desc: "Recouvrement" },
      { id: "travaux", nom: "Travaux / Vices", desc: "Malfaçons, vices cachés" },
      { id: "autre_immo", nom: "⊕ Autre litige", desc: "Décrivez votre situation", isAutre: true },
    ]
  },
  consommation: {
    nom: "Consommation", icone: "🛒", couleur: "#ea580c",
    categories: [
      { id: "vice_cache", nom: "Vice caché", desc: "Véhicule, électroménager" },
      { id: "garantie", nom: "Garantie", desc: "Légale, commerciale" },
      { id: "autre_conso", nom: "⊕ Autre litige", desc: "Décrivez votre situation", isAutre: true },
    ]
  },
  bancaire: { nom: "Droit Bancaire", icone: "🏦", couleur: "#059669", categories: [] },
  penal: { nom: "Droit Pénal", icone: "⚖️", couleur: "#7c3aed", categories: [] },
  administratif: { nom: "Droit Administratif", icone: "🏛️", couleur: "#0891b2", categories: [] },
  autre: {
    nom: "Autre domaine", icone: "📋", couleur: "#6b7280",
    categories: [{ id: "autre_general", nom: "⊕ Autre type de litige", desc: "Décrivez librement", isAutre: true }]
  },
};

const TESTIMONIALS = [
  { name: "Marie L.", role: "Licenciement abusif - Prud'hommes", avatar: "👩‍💼", rating: 5, text: "J'ai contesté mon licenciement abusif sans avocat grâce à ce dossier. 2000€ économisés et j'ai gagné aux prud'hommes !", savings: "2 150€", time: "25 min", location: "Lyon" },
  { name: "Pierre M.", role: "Divorce contentieux", avatar: "👨‍💻", rating: 5, text: "Pour mon divorce, le dossier contenait le calcul de la pension alimentaire et des jurisprudences que même mon avocat ne connaissait pas.", savings: "1 800€", time: "35 min", location: "Paris" },
  { name: "Sophie D.", role: "Succession bloquée", avatar: "👩‍🔬", rating: 5, text: "Ma succession était bloquée depuis 2 ans. Le dossier m'a permis de faire valoir mes droits à la réserve héréditaire.", savings: "3 500€", time: "40 min", location: "Bordeaux" },
  { name: "Thomas R.", role: "Caution non rendue", avatar: "👨‍🎓", rating: 5, text: "Mon propriétaire refusait de rendre ma caution. La mise en demeure générée par l'IA l'a convaincu en 10 jours.", savings: "950€", time: "15 min", location: "Marseille" },
  { name: "Julie B.", role: "Harcèlement moral au travail", avatar: "👩‍⚕️", rating: 5, text: "Victime de harcèlement moral, j'ai pu constituer un dossier solide avec toutes les preuves nécessaires pour les prud'hommes.", savings: "2 800€", time: "30 min", location: "Toulouse" },
  { name: "Marc D.", role: "Heures supplémentaires impayées", avatar: "👨‍🔧", rating: 5, text: "3 ans d'heures supplémentaires non payées. Le dossier a calculé exactement ce que mon employeur me devait : 8 500€ récupérés !", savings: "1 500€", time: "20 min", location: "Nantes" },
];

const FAQ_DATA = [
  {
    question: "Comment contester un licenciement abusif sans avocat ?",
    answer: "MonDossierJuridique génère un dossier complet pour contester votre licenciement abusif. Notre IA analyse votre situation selon le Code du travail, recherche la jurisprudence récente de la Cour de cassation, calcule vos indemnités (indemnité de licenciement, préavis, dommages-intérêts), et génère une mise en demeure personnalisée. Vous pouvez vous présenter aux prud'hommes avec un dossier professionnel pour seulement 49€."
  },
  {
    question: "Combien coûte un avocat en France en 2024 ?",
    answer: "Un avocat facture en moyenne 150€ à 500€ de l'heure. Pour un dossier de licenciement, comptez 1 500€ à 3 000€. Pour un divorce, 2 000€ à 5 000€. MonDossierJuridique propose une alternative à 49€ : vous obtenez un dossier juridique complet avec textes de loi, jurisprudence et stratégie personnalisée."
  },
  {
    question: "Peut-on aller aux prud'hommes sans avocat ?",
    answer: "Oui, vous pouvez vous défendre seul aux prud'hommes. C'est même courant : la procédure est conçue pour être accessible. MonDossierJuridique vous fournit tout ce dont vous avez besoin : analyse juridique, calcul des indemnités, jurisprudences favorables, liste des pièces à fournir, et stratégie de défense."
  },
  {
    question: "Comment calculer ses indemnités de licenciement ?",
    answer: "Les indemnités de licenciement dépendent de votre ancienneté, salaire, et type de licenciement. Notre IA calcule automatiquement : l'indemnité légale ou conventionnelle, l'indemnité compensatrice de préavis, les congés payés, et les dommages-intérêts potentiels en cas de licenciement abusif (jusqu'à 20 mois de salaire)."
  },
  {
    question: "Comment préparer son dossier de divorce ?",
    answer: "MonDossierJuridique vous aide à préparer votre divorce : inventaire des biens à partager, calcul de la pension alimentaire selon les barèmes officiels, analyse de vos droits concernant la garde des enfants, et anticipation des arguments juridiques. Arrivez préparé chez votre avocat et économisez des heures de consultation."
  },
  {
    question: "Qu'est-ce qu'une mise en demeure et comment la rédiger ?",
    answer: "Une mise en demeure est un courrier formel qui demande à votre adversaire d'exécuter ses obligations sous peine de poursuites. Notre IA génère des mises en demeure personnalisées, juridiquement solides, avec les bons articles de loi. Que ce soit pour des loyers impayés, une caution non rendue, ou des travaux non effectués."
  },
  {
    question: "MonDossierJuridique est-il fiable ?",
    answer: "Notre IA analyse 93 000 articles de loi français et 2,4 millions de décisions de justice. Chaque dossier cite les textes exacts du Code civil, Code du travail, etc., ainsi que des jurisprudences vérifiables de la Cour de cassation et des Cours d'appel. Le service ne remplace pas un avocat pour la représentation en justice, mais vous fournit un dossier de qualité professionnelle."
  },
  {
    question: "Quels litiges puis-je traiter avec MonDossierJuridique ?",
    answer: "Tous les domaines du droit français : licenciement abusif, harcèlement au travail, heures supplémentaires impayées, divorce, pension alimentaire, garde d'enfants, succession, testament contesté, expulsion, loyers impayés, vices cachés (immobilier ou véhicule), litiges de consommation, et bien plus encore."
  }
];

const QUESTIONNAIRE_DEFAULT = [
  { id: "nature_litige", label: "Nature précise du litige", type: "textarea", placeholder: "Décrivez le type de conflit", required: true },
  { id: "partie_adverse", label: "Partie adverse", type: "textarea", placeholder: "Qui est votre adversaire ?", required: true },
  { id: "date_faits", label: "Date des faits principaux", type: "date", required: true },
  { id: "expose_faits", label: "Exposé détaillé des faits", type: "textarea", placeholder: "Racontez chronologiquement", required: true },
  { id: "documents", label: "Documents en votre possession", type: "textarea", placeholder: "Listez vos preuves", required: true },
  { id: "demarches", label: "Démarches déjà effectuées", type: "textarea", placeholder: "Courriers, mise en demeure..." },
  { id: "prejudice", label: "Préjudice subi", type: "textarea", placeholder: "Chiffrez si possible", required: true },
  { id: "objectif", label: "Objectif recherché", type: "textarea", placeholder: "Indemnisation, annulation...", required: true },
  { id: "urgence", label: "Y a-t-il une urgence ?", type: "select", options: ["Non", "Oui, délai proche", "Oui, urgence"], required: true },
  { id: "infos", label: "Informations complémentaires", type: "textarea", placeholder: "Tout élément utile" },
];

// ════════════════════════════════════════════════════════════════════════════════════════
// COMPOSANT PAGE CONTACT
// ════════════════════════════════════════════════════════════════════════════════════════

function ContactPage({ onBack }) {
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

    // Validation simple
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'Veuillez remplir tous les champs obligatoires.' });
      setLoading(false);
      return;
    }

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
        window.location.href = data.mailto;
        setStatus({ type: 'info', message: 'Redirection vers votre client email...' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Erreur lors de l\'envoi. Veuillez réessayer.' });
      }
    } catch (error) {
      // Fallback direct vers mailto
      const mailto = `mailto:contact@mondossierjuridique.fr?subject=${encodeURIComponent(formData.subject || 'Contact')}&body=${encodeURIComponent(`Nom: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
      window.location.href = mailto;
      setStatus({ type: 'info', message: 'Redirection vers votre client email...' });
    }

    setLoading(false);
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <button onClick={onBack} className="contact-back-btn">← Retour au site</button>
        <h1>📧 Contactez-nous</h1>
        <p>Notre équipe vous répond sous 24 heures</p>
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
            <div className={`contact-form-status ${status.type}`}>
              {status.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="contact-form-group">
              <label>Votre nom <span>*</span></label>
              <input
                type="text"
                name="name"
                className="contact-form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jean Dupont"
                required
              />
            </div>
            
            <div className="contact-form-group">
              <label>Votre email <span>*</span></label>
              <input
                type="email"
                name="email"
                className="contact-form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="jean.dupont@email.fr"
                required
              />
            </div>
            
            <div className="contact-form-group">
              <label>Sujet</label>
              <select
                name="subject"
                className="contact-form-select"
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
            
            <div className="contact-form-group">
              <label>Votre message <span>*</span></label>
              <textarea
                name="message"
                className="contact-form-textarea"
                value={formData.message}
                onChange={handleChange}
                placeholder="Décrivez votre demande en détail..."
                rows="5"
                required
              />
            </div>
            
            <button type="submit" className="contact-form-submit" disabled={loading}>
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
          <span onClick={onBack} style={{color:'var(--gold)',cursor:'pointer'}}>Retour à l'accueil</span>
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════════════
// COMPOSANT MENTIONS LÉGALES
// ════════════════════════════════════════════════════════════════════════════════════════

function LegalPage({ onBack, scrollToSection }) {
  const [activeSection, setActiveSection] = useState('mentions');
  
  useEffect(() => {
    if (scrollToSection) {
      setActiveSection(scrollToSection);
      setTimeout(() => {
        document.getElementById(scrollToSection)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [scrollToSection]);
  
  return (
    <div className="legal-page">
      <div className="legal-header">
        <button onClick={onBack} className="legal-back-btn">← Retour au site</button>
        <h1>Informations légales</h1>
      </div>
      
      <div className="legal-content">
        <nav className="legal-nav">
          <button 
            className={activeSection === 'mentions' ? 'active' : ''} 
            onClick={() => setActiveSection('mentions')}
          >
            Mentions légales
          </button>
          <button 
            className={activeSection === 'confidentialite' ? 'active' : ''} 
            onClick={() => setActiveSection('confidentialite')}
          >
            Confidentialité
          </button>
          <button 
            className={activeSection === 'cgv' ? 'active' : ''} 
            onClick={() => setActiveSection('cgv')}
          >
            CGV
          </button>
          <button 
            className={activeSection === 'cookies' ? 'active' : ''} 
            onClick={() => setActiveSection('cookies')}
          >
            Cookies
          </button>
        </nav>

        {/* MENTIONS LÉGALES */}
        {activeSection === 'mentions' && (
          <section id="mentions" className="legal-section">
            <h2>📋 Mentions Légales</h2>
            <p className="legal-update">Dernière mise à jour : Décembre 2024</p>
            
            <h3>1. Éditeur du site</h3>
            <p>
              <strong>MonDossierJuridique.fr</strong><br/>
              Entrepreneur individuel : F. Lomme<br/>
              SIRET : 827 751 876 00018<br/>
              Adresse : France<br/>
              Email : <a href="mailto:contact@mondossierjuridique.fr">contact@mondossierjuridique.fr</a>
            </p>

            <h3>2. Hébergement</h3>
            <p>
              Ce site est hébergé par :<br/>
              <strong>Vercel Inc.</strong><br/>
              440 N Barranca Ave #4133<br/>
              Covina, CA 91723, États-Unis<br/>
              Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
            </p>

            <h3>3. Propriété intellectuelle</h3>
            <p>
              L'ensemble du contenu de ce site (textes, images, logos, structure) est protégé par le droit d'auteur. 
              Toute reproduction, même partielle, est interdite sans autorisation préalable.
            </p>

            <h3>4. Responsabilité</h3>
            <p>
              <strong>Important :</strong> MonDossierJuridique.fr est un service d'aide à la constitution de dossiers juridiques assisté par intelligence artificielle.
            </p>
            <p>
              <strong>Ce service ne constitue pas un conseil juridique personnalisé et ne remplace en aucun cas la consultation d'un avocat inscrit au Barreau.</strong>
            </p>
            <p>
              Les informations générées sont fournies à titre indicatif et doivent être vérifiées par un professionnel du droit avant toute action juridique.
            </p>
          </section>
        )}

        {/* POLITIQUE DE CONFIDENTIALITÉ */}
        {activeSection === 'confidentialite' && (
          <section id="confidentialite" className="legal-section">
            <h2>🔒 Politique de Confidentialité (RGPD)</h2>
            <p className="legal-update">Dernière mise à jour : Décembre 2024</p>

            <h3>1. Responsable du traitement</h3>
            <p>
              Le responsable du traitement des données personnelles est :<br/>
              <strong>F. Lomme</strong> - MonDossierJuridique.fr<br/>
              Contact : <a href="mailto:contact@mondossierjuridique.fr">contact@mondossierjuridique.fr</a>
            </p>

            <h3>2. Données collectées</h3>
            <p>Nous collectons les données suivantes :</p>
            <ul>
              <li><strong>Données d'identification :</strong> adresse email</li>
              <li><strong>Données de paiement :</strong> traitées exclusivement par Stripe (nous n'avons pas accès aux numéros de carte)</li>
              <li><strong>Données de votre dossier :</strong> informations que vous saisissez dans le questionnaire juridique</li>
              <li><strong>Données de navigation :</strong> cookies techniques nécessaires au fonctionnement</li>
            </ul>

            <h3>3. Finalités du traitement</h3>
            <ul>
              <li>Génération de votre dossier juridique personnalisé</li>
              <li>Traitement de votre paiement</li>
              <li>Communication relative à votre commande</li>
              <li>Amélioration de nos services</li>
            </ul>

            <h3>4. Base légale</h3>
            <p>
              Le traitement de vos données est fondé sur l'exécution du contrat (article 6.1.b du RGPD) lorsque vous utilisez notre service.
            </p>

            <h3>5. Destinataires des données</h3>
            <ul>
              <li><strong>Stripe :</strong> pour le traitement des paiements</li>
              <li><strong>Anthropic (Claude) :</strong> pour la génération des dossiers par IA</li>
              <li><strong>Vercel :</strong> pour l'hébergement du site</li>
            </ul>
            <p>Ces prestataires sont conformes au RGPD et/ou certifiés Privacy Shield ou utilisent des Clauses Contractuelles Types.</p>

            <h3>6. Durée de conservation</h3>
            <ul>
              <li><strong>Données de compte :</strong> 3 ans après la dernière utilisation</li>
              <li><strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
              <li><strong>Données de navigation :</strong> 13 mois maximum</li>
              <li><strong>Contenu des dossiers générés :</strong> supprimé immédiatement après téléchargement</li>
            </ul>

            <h3>7. Vos droits</h3>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
              <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
              <li><strong>Droit de rectification :</strong> corriger vos données</li>
              <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
              <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format standard</li>
              <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@mondossierjuridique.fr">contact@mondossierjuridique.fr</a>
            </p>
            <p>
              Vous pouvez également introduire une réclamation auprès de la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
            </p>

            <h3>8. Sécurité</h3>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
              connexion HTTPS/SSL, chiffrement des données sensibles, accès restreint aux données.
            </p>

            <h3>9. Transferts hors UE</h3>
            <p>
              Certains de nos prestataires (Vercel, Anthropic) sont situés aux États-Unis. 
              Ces transferts sont encadrés par des Clauses Contractuelles Types (CCT) ou le Data Privacy Framework.
            </p>
          </section>
        )}

        {/* CONDITIONS GÉNÉRALES DE VENTE */}
        {activeSection === 'cgv' && (
          <section id="cgv" className="legal-section">
            <h2>📜 Conditions Générales de Vente</h2>
            <p className="legal-update">Dernière mise à jour : Décembre 2024</p>

            <h3>Article 1 – Objet</h3>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre 
              MonDossierJuridique.fr (ci-après "le Prestataire") et toute personne effectuant un achat sur le site 
              (ci-après "le Client").
            </p>

            <h3>Article 2 – Description du service</h3>
            <p>
              MonDossierJuridique.fr propose un service de génération de dossiers juridiques assisté par intelligence artificielle.
            </p>
            <p>
              <strong>Important :</strong> Ce service constitue une aide à la préparation de dossiers juridiques et 
              <strong> ne remplace en aucun cas les conseils d'un avocat</strong>. Les documents générés doivent être 
              vérifiés par un professionnel du droit avant toute utilisation dans une procédure juridique.
            </p>

            <h3>Article 3 – Prix</h3>
            <p>
              Le prix du service est de <strong>49€ TTC</strong> par dossier juridique, clairement affiché avant tout achat.
              Les prix sont en euros et toutes taxes comprises (TVA française applicable).
            </p>

            <h3>Article 4 – Commande et paiement</h3>
            <p>
              Le paiement s'effectue en ligne par carte bancaire via la plateforme sécurisée Stripe.
              La commande est confirmée après validation du paiement.
            </p>

            <h3>Article 5 – Livraison</h3>
            <p>
              Le service est délivré immédiatement après le paiement. L'accès à la plateforme de génération 
              de dossiers est instantané. Le dossier généré est téléchargeable au format numérique.
            </p>

            <h3>Article 6 – Droit de rétractation</h3>
            <p>
              Conformément à l'article L221-28 du Code de la consommation, <strong>le droit de rétractation ne peut être exercé</strong> pour 
              les contrats de fourniture de contenu numérique non fourni sur un support matériel dont l'exécution a commencé 
              après accord préalable exprès du consommateur et renoncement exprès à son droit de rétractation.
            </p>
            <p>
              En validant votre commande, vous reconnaissez avoir été informé de cette disposition et y consentez expressément.
            </p>
            <p>
              <strong>Exception :</strong> En cas de dysfonctionnement technique avéré empêchant l'utilisation du service, 
              un remboursement pourra être effectué sur demande à contact@mondossierjuridique.fr.
            </p>

            <h3>Article 7 – Responsabilité</h3>
            <p>
              Le Prestataire s'engage à fournir un service de qualité mais ne peut garantir l'adéquation des documents 
              générés à la situation spécifique du Client, celle-ci nécessitant l'avis d'un professionnel du droit.
            </p>
            <p>
              La responsabilité du Prestataire est limitée au montant de la commande en cas de préjudice direct prouvé.
            </p>

            <h3>Article 8 – Propriété intellectuelle</h3>
            <p>
              Les dossiers générés par le service sont la propriété du Client qui peut les utiliser librement dans le cadre de ses démarches personnelles.
            </p>
            <p>
              Le Client s'interdit de revendre ou de diffuser commercialement les documents générés.
            </p>

            <h3>Article 9 – Protection des données</h3>
            <p>
              Le traitement des données personnelles est détaillé dans notre Politique de Confidentialité accessible sur ce site.
            </p>

            <h3>Article 10 – Réclamations et médiation</h3>
            <p>
              Pour toute réclamation, le Client peut contacter le Prestataire à l'adresse : <strong>contact@mondossierjuridique.fr</strong>
            </p>
            <p>
              En cas de litige non résolu, le Client peut recourir gratuitement à un médiateur de la consommation. Conformément à l'article L612-1 du Code de la consommation, le Client peut saisir :
            </p>
            <p>
              <strong>CNPM - Médiation de la consommation</strong><br/>
              27 avenue de la Libération – 42400 Saint-Chamond<br/>
              Site web : <a href="https://cnpm-mediation-consommation.eu" target="_blank" rel="noopener noreferrer">cnpm-mediation-consommation.eu</a>
            </p>
            <p>
              Plateforme européenne de règlement en ligne des litiges : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>
            </p>

            <h3>Article 11 – Droit applicable</h3>
            <p>
              Les présentes CGV sont soumises au droit français. Tout litige relatif à leur interprétation ou exécution relève de la compétence des tribunaux français.
            </p>
          </section>
        )}

        {/* POLITIQUE DE COOKIES */}
        {activeSection === 'cookies' && (
          <section id="cookies" className="legal-section">
            <h2>🍪 Politique de Cookies</h2>
            <p className="legal-update">Dernière mise à jour : Décembre 2024</p>

            <h3>1. Qu'est-ce qu'un cookie ?</h3>
            <p>
              Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de votre visite sur notre site. Il permet de stocker des informations relatives à votre navigation.
            </p>

            <h3>2. Cookies utilisés sur ce site</h3>
            
            <p><strong>Cookies strictement nécessaires :</strong></p>
            <ul>
              <li>Gestion de la session utilisateur</li>
              <li>Mémorisation du panier et du paiement</li>
              <li>Sécurité du site</li>
            </ul>
            <p>Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas être désactivés.</p>

            <p><strong>Cookies tiers :</strong></p>
            <ul>
              <li><strong>Stripe :</strong> pour le traitement sécurisé des paiements</li>
              <li><strong>Crisp :</strong> pour le chat en direct</li>
            </ul>

            <h3>3. Durée de conservation</h3>
            <p>
              Les cookies sont conservés pour une durée maximale de 13 mois conformément aux recommandations de la CNIL.
            </p>

            <h3>4. Gestion des cookies</h3>
            <p>
              Vous pouvez à tout moment configurer votre navigateur pour accepter ou refuser les cookies :
            </p>
            <ul>
              <li><strong>Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies</li>
              <li><strong>Firefox :</strong> Options → Vie privée et sécurité → Cookies</li>
              <li><strong>Safari :</strong> Préférences → Confidentialité → Cookies</li>
              <li><strong>Edge :</strong> Paramètres → Cookies et autorisations de site</li>
            </ul>
            <p>
              <strong>Attention :</strong> Le refus de certains cookies peut limiter l'accès à certaines fonctionnalités du site.
            </p>

            <h3>5. Plus d'informations</h3>
            <p>
              Pour en savoir plus sur les cookies, vous pouvez consulter le site de la CNIL : <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs" target="_blank" rel="noopener noreferrer">www.cnil.fr/fr/cookies-et-autres-traceurs</a>
            </p>
          </section>
        )}

        <div className="legal-footer-info">
          <p>© 2024 MonDossierJuridique.fr – Tous droits réservés</p>
          <p>Ce service ne remplace pas la consultation d'un avocat.</p>
        </div>
      </div>
    </div>
  );
}

export default function MonDossierJuridique() {
  const [currentView, setCurrentView] = useState('landing');
  const [userEmail, setUserEmail] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [legalSection, setLegalSection] = useState(null);
  
  const [selectedDomaine, setSelectedDomaine] = useState(null);
  const [selectedCategorie, setSelectedCategorie] = useState(null);
  const [formData, setFormData] = useState({});
  const [dossierGenere, setDossierGenere] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  const [counters, setCounters] = useState({ savings: 0, time: 0, dossiers: 0, satisfaction: 0 });
  
  useEffect(() => {
    if (currentView === 'landing') {
      setTimeout(() => setCounters({ savings: 1847, time: 28, dossiers: 12453, satisfaction: 97 }), 500);
    }
  }, [currentView]);

  // Check for Stripe success redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true' || params.get('session_id')) {
      setCurrentView('app');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handlePayment = async () => {
    if (!userEmail || !userEmail.includes('@')) {
      setPaymentError('Veuillez entrer une adresse email valide');
      return;
    }
    
    setPaymentLoading(true);
    setPaymentError('');
    
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'single', email: userEmail })
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPaymentError(data.error || 'Erreur lors de la création du paiement');
        setPaymentLoading(false);
      }
    } catch (err) {
      setPaymentError('Erreur de connexion. Réessayez.');
      setPaymentLoading(false);
    }
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitDossier = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `GÉNÈRE UN DOSSIER JURIDIQUE COMPLET pour ce cas :
          
Domaine : ${DOMAINES[selectedDomaine]?.nom || selectedDomaine}
Catégorie : ${selectedCategorie}
${Object.entries(formData).map(([k,v]) => `${k}: ${v}`).join('\n')}

STRUCTURE OBLIGATOIRE DU DOSSIER (40-60 pages) :

1. PAGE DE GARDE
2. SOMMAIRE
3. RÉSUMÉ EXÉCUTIF (2 pages)
4. EXPOSÉ DES FAITS (5 pages)
5. ANALYSE JURIDIQUE COMPLÈTE (15 pages)
   - Textes de loi applicables (citations exactes)
   - Jurisprudence pertinente (10 décisions minimum avec références)
6. ARGUMENTATION (10 pages)
7. CALCUL DES PRÉJUDICES/INDEMNITÉS (si applicable)
8. STRATÉGIE PROCÉDURALE
9. MODÈLES DE DOCUMENTS (mise en demeure, etc.)
10. ANNEXES ET PIÈCES À RÉUNIR
11. CONCLUSION ET RECOMMANDATIONS`,
          context: []
        })
      });
      
      const data = await response.json();
      setDossierGenere(data.response);
    } catch (err) {
      setDossierGenere("Erreur lors de la génération. Veuillez réessayer.");
    }
    setLoading(false);
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: chatMessages.slice(-6)
        })
      });
      
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: "Erreur de connexion." }]);
    }
    setChatLoading(false);
  };

  const downloadPDF = () => {
    const element = document.createElement('a');
    const file = new Blob([dossierGenere], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'MonDossierJuridique.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // CONTACT PAGE VIEW
  if (currentView === 'contact') {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
          :root { --primary:#1a1a2e; --gold:#c9a227; --gold-light:#d4af37; --bg:#f8f9fa; --text:#2d3748; --muted:#6b7280; --border:#e5e7eb; --success:#059669; --error:#dc2626; }
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family:'Inter',system-ui,sans-serif; background:var(--bg); color:var(--text); line-height:1.6; }
          
          .contact-page { min-height:100vh; background:linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%); }
          .contact-header { background:linear-gradient(135deg,var(--primary) 0%,#16213e 100%); color:white; padding:4rem 2rem 3rem; text-align:center; position:relative; }
          .contact-header h1 { font-family:'Playfair Display',Georgia,serif; font-size:2.5rem; margin-bottom:0.5rem; }
          .contact-header p { color:rgba(255,255,255,0.8); font-size:1.1rem; }
          .contact-back-btn { position:absolute; top:1.5rem; left:2rem; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.3); color:white; padding:0.5rem 1rem; border-radius:8px; cursor:pointer; font-size:0.9rem; transition:all 0.3s; }
          .contact-back-btn:hover { background:rgba(255,255,255,0.2); }
          
          .contact-container { max-width:1100px; margin:-2rem auto 3rem; padding:0 1.5rem; display:grid; grid-template-columns:1fr 1fr; gap:2rem; }
          @media (max-width:768px) { .contact-container { grid-template-columns:1fr; } }
          
          .contact-info { background:white; border-radius:16px; padding:2.5rem; box-shadow:0 10px 40px rgba(0,0,0,0.08); }
          .contact-info h2 { font-family:'Playfair Display',Georgia,serif; color:var(--primary); font-size:1.5rem; margin-bottom:1.5rem; }
          .contact-info-item { display:flex; align-items:flex-start; gap:1rem; margin-bottom:1.5rem; padding:1rem; background:#f8f9fa; border-radius:12px; transition:all 0.3s; }
          .contact-info-item:hover { background:#f0f0f0; transform:translateX(5px); }
          .contact-info-icon { font-size:1.5rem; width:40px; height:40px; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,var(--gold),var(--gold-light)); border-radius:10px; }
          .contact-info-content h3 { font-size:1rem; color:var(--primary); margin-bottom:0.25rem; }
          .contact-info-content p { color:var(--muted); font-size:0.95rem; }
          .contact-info-content a { color:var(--gold); text-decoration:none; font-weight:500; }
          .contact-info-content a:hover { text-decoration:underline; }
          .contact-hours { margin-top:2rem; padding-top:1.5rem; border-top:1px solid var(--border); }
          .contact-hours h3 { font-size:1.1rem; color:var(--primary); margin-bottom:1rem; }
          .contact-hours p { color:var(--muted); font-size:0.95rem; line-height:1.8; }
          
          .contact-form-card { background:white; border-radius:16px; padding:2.5rem; box-shadow:0 10px 40px rgba(0,0,0,0.08); }
          .contact-form-card h2 { font-family:'Playfair Display',Georgia,serif; color:var(--primary); font-size:1.5rem; margin-bottom:1.5rem; }
          .contact-form-group { margin-bottom:1.25rem; }
          .contact-form-group label { display:block; font-weight:500; color:#374151; margin-bottom:0.5rem; font-size:0.95rem; }
          .contact-form-group label span { color:var(--error); }
          .contact-form-input, .contact-form-textarea, .contact-form-select { width:100%; padding:0.875rem 1rem; border:2px solid var(--border); border-radius:10px; font-size:1rem; font-family:inherit; transition:all 0.3s; background:#fafafa; }
          .contact-form-input:focus, .contact-form-textarea:focus, .contact-form-select:focus { outline:none; border-color:var(--gold); background:white; box-shadow:0 0 0 3px rgba(201,162,39,0.1); }
          .contact-form-textarea { resize:vertical; min-height:120px; }
          .contact-form-submit { width:100%; padding:1rem 2rem; background:linear-gradient(135deg,var(--gold) 0%,var(--gold-light) 100%); color:white; border:none; border-radius:10px; font-size:1.1rem; font-weight:600; cursor:pointer; transition:all 0.3s; display:flex; align-items:center; justify-content:center; gap:0.5rem; }
          .contact-form-submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 30px rgba(201,162,39,0.4); }
          .contact-form-submit:disabled { opacity:0.7; cursor:not-allowed; }
          .contact-form-status { padding:1rem; border-radius:10px; margin-bottom:1rem; font-weight:500; }
          .contact-form-status.success { background:#ecfdf5; color:var(--success); border:1px solid #a7f3d0; }
          .contact-form-status.error { background:#fef2f2; color:var(--error); border:1px solid #fecaca; }
          .contact-form-status.info { background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe; }
          
          .contact-footer { text-align:center; padding:2rem; color:var(--muted); font-size:0.9rem; }
          
          .loading-spinner { display:inline-block; width:20px; height:20px; border:3px solid rgba(255,255,255,0.3); border-radius:50%; border-top-color:white; animation:spin 1s linear infinite; }
          @keyframes spin { to { transform:rotate(360deg); } }
        `}</style>
        <ContactPage onBack={() => setCurrentView('landing')} />
      </>
    );
  }

  // LEGAL PAGE VIEW
  if (currentView === 'legal') {
    return (
      <>
        <style>{`
          :root { --primary:#1a1a2e; --gold:#c9a227; --gold-light:#d4af37; --bg:#f8f9fa; --text:#2d3748; --muted:#6b7280; --border:#e5e7eb; --success:#059669; --error:#dc2626; }
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family:'Inter',system-ui,sans-serif; background:var(--bg); color:var(--text); line-height:1.6; }
          .legal-page { min-height:100vh; background:var(--bg); }
          .legal-header { background:linear-gradient(135deg,var(--primary),#16213e); color:white; padding:2rem; text-align:center; }
          .legal-header h1 { font-family:'Playfair Display',serif; font-size:2rem; margin-top:1rem; }
          .legal-back-btn { background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.3); color:white; padding:0.5rem 1rem; border-radius:8px; cursor:pointer; transition:all 0.3s; }
          .legal-back-btn:hover { background:rgba(255,255,255,0.2); }
          .legal-content { max-width:900px; margin:0 auto; padding:2rem; }
          .legal-nav { display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:2rem; padding:1rem; background:white; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,0.05); }
          .legal-nav button { padding:0.75rem 1.25rem; border:2px solid var(--border); background:white; border-radius:8px; cursor:pointer; font-weight:500; transition:all 0.3s; }
          .legal-nav button:hover { border-color:var(--gold); }
          .legal-nav button.active { background:var(--gold); color:white; border-color:var(--gold); }
          .legal-section { background:white; border-radius:16px; padding:2.5rem; box-shadow:0 4px 15px rgba(0,0,0,0.05); }
          .legal-section h2 { font-family:'Playfair Display',serif; font-size:1.75rem; color:var(--primary); margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:2px solid var(--gold); }
          .legal-section h3 { font-size:1.1rem; color:var(--primary); margin:1.5rem 0 0.75rem; }
          .legal-section p { margin-bottom:1rem; }
          .legal-section ul { margin:1rem 0; padding-left:1.5rem; }
          .legal-section li { margin-bottom:0.5rem; }
          .legal-section a { color:var(--gold); }
          .legal-update { color:var(--muted); font-size:0.9rem; font-style:italic; margin-bottom:1.5rem; }
          .legal-footer-info { text-align:center; margin-top:2rem; padding:1.5rem; color:var(--muted); font-size:0.9rem; }
        `}</style>
        <LegalPage onBack={() => setCurrentView('landing')} scrollToSection={legalSection} />
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        :root { --primary:#1a1a2e; --gold:#c9a227; --gold-light:#d4af37; --bg:#f8f9fa; --text:#2d3748; --muted:#6b7280; --border:#e5e7eb; --success:#059669; --error:#dc2626; }
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Inter',system-ui,sans-serif; background:var(--bg); color:var(--text); line-height:1.6; }
        
        .nav { position:fixed; top:0; left:0; right:0; z-index:1000; background:rgba(26,26,46,0.95); backdrop-filter:blur(10px); padding:1rem 2rem; display:flex; justify-content:space-between; align-items:center; }
        .nav-logo { display:flex; align-items:center; gap:0.5rem; font-weight:700; font-size:1.2rem; color:white; }
        .nav-logo span { color:var(--gold); }
        .nav-links { display:flex; gap:2rem; align-items:center; }
        .nav-link { color:rgba(255,255,255,0.8); text-decoration:none; font-size:0.95rem; cursor:pointer; transition:color 0.3s; }
        .nav-link:hover { color:var(--gold); }
        .nav-cta { background:linear-gradient(135deg,var(--gold),var(--gold-light)); color:white; padding:0.6rem 1.25rem; border-radius:25px; font-weight:600; font-size:0.9rem; border:none; cursor:pointer; }
        
        .hero { min-height:100vh; background:linear-gradient(135deg,var(--primary) 0%,#16213e 50%,var(--primary) 100%); display:flex; align-items:center; justify-content:center; text-align:center; padding:6rem 2rem 4rem; }
        .hero-inner { max-width:800px; }
        .hero-badge { display:inline-flex; align-items:center; gap:0.5rem; background:rgba(201,162,39,0.15); border:1px solid rgba(201,162,39,0.3); padding:0.5rem 1.25rem; border-radius:30px; font-size:0.9rem; color:var(--gold); margin-bottom:1.5rem; }
        .hero h1 { font-family:'Playfair Display',serif; font-size:3rem; color:white; line-height:1.2; margin-bottom:1.5rem; }
        .hero h1 span { color:var(--gold); }
        .hero-subtitle { font-size:1.2rem; color:rgba(255,255,255,0.8); max-width:600px; margin:0 auto 2rem; }
        .hero-stats { display:flex; justify-content:center; gap:3rem; margin-bottom:2.5rem; }
        .hero-stat-value { font-size:2rem; font-weight:700; color:var(--gold); }
        .hero-stat-label { font-size:0.85rem; color:rgba(255,255,255,0.6); }
        .hero-buttons { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; }
        .btn { padding:1rem 2rem; border-radius:30px; font-size:1rem; font-weight:600; cursor:pointer; border:none; transition:all 0.3s; }
        .btn-primary { background:linear-gradient(135deg,var(--gold),var(--gold-light)); color:white; }
        .btn-primary:hover { transform:translateY(-3px); box-shadow:0 8px 25px rgba(201,162,39,0.4); }
        .btn-secondary { background:rgba(255,255,255,0.1); color:white; border:2px solid rgba(255,255,255,0.3); }
        
        .section { padding:5rem 2rem; }
        .section-white { background:white; }
        .section-header { text-align:center; max-width:700px; margin:0 auto 3rem; }
        .section-badge { display:inline-block; background:rgba(201,162,39,0.1); color:var(--gold); padding:0.4rem 1rem; border-radius:20px; font-size:0.85rem; font-weight:600; margin-bottom:1rem; }
        .section-title { font-family:'Playfair Display',serif; font-size:2.25rem; color:var(--primary); margin-bottom:1rem; }
        .section-subtitle { color:var(--muted); font-size:1.1rem; }
        
        .legal-stats-grid { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:1.5rem; }
        .legal-stat-card { background:linear-gradient(135deg,var(--primary),#16213e); border-radius:16px; padding:1.75rem; text-align:center; color:white; }
        .legal-stat-icon { font-size:2.5rem; margin-bottom:0.75rem; }
        .legal-stat-value { font-family:'Playfair Display',serif; font-size:2.5rem; font-weight:700; background:linear-gradient(135deg,var(--gold),var(--gold-light)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:0.25rem; }
        .legal-stat-label { font-size:1rem; font-weight:600; margin-bottom:0.5rem; }
        .legal-stat-desc { font-size:0.8rem; color:rgba(255,255,255,0.6); line-height:1.4; }
        .legal-sources { text-align:center; margin-top:2rem; padding:1rem; background:rgba(201,162,39,0.1); border-radius:10px; max-width:800px; margin-left:auto; margin-right:auto; }
        .legal-sources p { color:var(--muted); font-size:0.85rem; margin:0; }
        
        .hero-trust { margin-top:2rem; }
        .hero-trust p { color:rgba(255,255,255,0.7); font-size:0.9rem; }
        
        .usecases-grid { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:repeat(2,1fr); gap:1.5rem; }
        .usecase-card { background:white; border-radius:16px; padding:2rem; box-shadow:0 4px 15px rgba(0,0,0,0.05); border:2px solid var(--border); transition:all 0.3s; }
        .usecase-card:hover { border-color:var(--gold); transform:translateY(-3px); box-shadow:0 8px 25px rgba(0,0,0,0.1); }
        .usecase-icon { font-size:2.5rem; margin-bottom:1rem; }
        .usecase-card h3 { font-family:'Playfair Display',serif; font-size:1.25rem; color:var(--primary); margin-bottom:0.75rem; }
        .usecase-card p { color:var(--text); font-size:0.95rem; margin-bottom:1rem; line-height:1.6; }
        .usecase-card ul { list-style:none; }
        .usecase-card ul li { color:var(--muted); font-size:0.85rem; padding:0.25rem 0; }
        
        .faq-container { max-width:800px; margin:0 auto; }
        .faq-item { background:white; border:2px solid var(--border); border-radius:12px; margin-bottom:1rem; overflow:hidden; }
        .faq-item[open] { border-color:var(--gold); }
        .faq-question { padding:1.25rem 1.5rem; cursor:pointer; font-weight:600; color:var(--primary); font-size:1rem; list-style:none; display:flex; justify-content:space-between; align-items:center; }
        .faq-question::-webkit-details-marker { display:none; }
        .faq-question::after { content:'▼'; font-size:0.75rem; color:var(--gold); transition:transform 0.3s; }
        .faq-item[open] .faq-question::after { transform:rotate(180deg); }
        .faq-answer { padding:0 1.5rem 1.25rem; color:var(--text); line-height:1.7; font-size:0.95rem; }
        
        .cta-section { background:linear-gradient(135deg,var(--primary),#16213e); padding:4rem 2rem; }
        .cta-container { max-width:700px; margin:0 auto; text-align:center; }
        .cta-container h2 { font-family:'Playfair Display',serif; font-size:2.25rem; color:white; margin-bottom:1rem; }
        .cta-container p { color:rgba(255,255,255,0.8); font-size:1.1rem; margin-bottom:2rem; }
        .btn-large { padding:1.25rem 2.5rem; font-size:1.1rem; }
        .cta-guarantees { display:flex; justify-content:center; gap:2rem; margin-top:1.5rem; flex-wrap:wrap; }
        .cta-guarantees span { color:rgba(255,255,255,0.7); font-size:0.9rem; }
        
        .comparison-grid { max-width:900px; margin:0 auto; display:grid; grid-template-columns:1fr auto 1fr; gap:2rem; }
        .comparison-card { background:white; border-radius:20px; padding:2rem; border:2px solid var(--border); }
        .comparison-card.modern { border-color:var(--gold); box-shadow:0 10px 40px rgba(201,162,39,0.15); }
        .comparison-header { text-align:center; margin-bottom:1.5rem; }
        .comparison-icon { font-size:2.5rem; margin-bottom:0.5rem; }
        .comparison-title { font-size:1.25rem; color:var(--primary); }
        .comparison-price { font-size:1.75rem; font-weight:700; }
        .comparison-card:not(.modern) .comparison-price { color:var(--error); }
        .comparison-card.modern .comparison-price { color:var(--success); }
        .comparison-list { list-style:none; }
        .comparison-list li { padding:0.6rem 0; border-bottom:1px solid var(--border); font-size:0.95rem; }
        .vs-badge { background:var(--primary); color:white; width:50px; height:50px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; align-self:center; }
        
        .steps-grid { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:1.5rem; }
        .step-card { text-align:center; padding:1.5rem; }
        .step-number { width:50px; height:50px; margin:0 auto 1rem; background:linear-gradient(135deg,var(--gold),var(--gold-light)); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.25rem; font-weight:700; color:white; }
        .step-icon { font-size:2rem; margin-bottom:0.75rem; }
        .step-title { font-size:1.1rem; color:var(--primary); margin-bottom:0.5rem; }
        .step-desc { color:var(--muted); font-size:0.9rem; }
        
        .testimonials-grid { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:repeat(2,1fr); gap:1.5rem; }
        .testimonial-card { background:white; border-radius:16px; padding:1.5rem; box-shadow:0 4px 15px rgba(0,0,0,0.05); }
        .testimonial-header { display:flex; align-items:center; gap:1rem; margin-bottom:1rem; }
        .testimonial-avatar { width:50px; height:50px; background:linear-gradient(135deg,var(--gold),var(--gold-light)); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.5rem; }
        .testimonial-info h4 { color:var(--primary); font-size:1rem; }
        .testimonial-info span { color:var(--muted); font-size:0.85rem; }
        .testimonial-stars { color:var(--gold); font-size:0.9rem; }
        .testimonial-text { color:var(--text); font-style:italic; margin-bottom:1rem; font-size:0.95rem; }
        .testimonial-results { display:flex; gap:2rem; padding-top:1rem; border-top:1px solid var(--border); }
        .testimonial-result { display:flex; align-items:center; gap:0.5rem; }
        .testimonial-result-value { font-weight:700; color:var(--primary); }
        .testimonial-result-label { font-size:0.75rem; color:var(--muted); }
        
        /* SINGLE PRICING CARD */
        .single-pricing-container { max-width:500px; margin:0 auto; }
        .single-pricing-card { background:white; border:3px solid var(--gold); border-radius:24px; padding:3rem; position:relative; box-shadow:0 20px 60px rgba(201,162,39,0.2); text-align:center; }
        .single-pricing-badge { position:absolute; top:-15px; left:50%; transform:translateX(-50%); background:linear-gradient(135deg,var(--gold),var(--gold-light)); color:white; padding:0.5rem 1.5rem; border-radius:25px; font-size:0.9rem; font-weight:700; }
        .single-pricing-icon { font-size:4rem; margin-bottom:1rem; }
        .single-pricing-title { font-family:'Playfair Display',serif; font-size:1.75rem; color:var(--primary); margin-bottom:0.5rem; }
        .single-pricing-desc { color:var(--muted); margin-bottom:1.5rem; }
        .single-pricing-price { font-size:4rem; font-weight:800; color:var(--primary); margin-bottom:0.5rem; }
        .single-pricing-price span { font-size:1.5rem; color:var(--muted); }
        .single-pricing-old { color:var(--error); text-decoration:line-through; font-size:1.25rem; margin-bottom:1.5rem; }
        .single-pricing-features { list-style:none; text-align:left; margin-bottom:2rem; }
        .single-pricing-features li { display:flex; align-items:center; gap:0.75rem; padding:0.75rem 0; font-size:1rem; border-bottom:1px solid var(--border); }
        .single-pricing-features li:last-child { border-bottom:none; }
        .single-pricing-features li::before { content:'✓'; color:var(--success); font-weight:bold; font-size:1.2rem; }
        .single-pricing-cta { width:100%; padding:1.25rem; background:linear-gradient(135deg,var(--gold),var(--gold-light)); color:white; border:none; border-radius:14px; font-size:1.15rem; font-weight:700; cursor:pointer; transition:all 0.3s; }
        .single-pricing-cta:hover { transform:translateY(-3px); box-shadow:0 10px 30px rgba(201,162,39,0.4); }
        
        .payment-page { min-height:100vh; background:var(--bg); padding:6rem 2rem 4rem; }
        .payment-container { max-width:450px; margin:0 auto; }
        .payment-card { background:white; border-radius:20px; padding:2rem; box-shadow:0 4px 20px rgba(0,0,0,0.05); }
        .payment-title { font-family:'Playfair Display',serif; font-size:1.5rem; color:var(--primary); text-align:center; margin-bottom:0.5rem; }
        .payment-subtitle { color:var(--muted); text-align:center; margin-bottom:1.5rem; }
        .payment-plan { background:var(--bg); border-radius:12px; padding:1.25rem; margin-bottom:1.5rem; text-align:center; }
        .payment-plan-name { font-weight:600; color:var(--primary); font-size:1.1rem; }
        .payment-plan-price { font-size:2rem; font-weight:700; color:var(--gold); }
        .form-group { margin-bottom:1.25rem; }
        .form-label { display:block; font-weight:600; color:var(--primary); margin-bottom:0.4rem; font-size:0.95rem; }
        .form-input { width:100%; padding:0.9rem; border:2px solid var(--border); border-radius:10px; font-size:1rem; }
        .form-input:focus { outline:none; border-color:var(--gold); }
        .payment-btn { width:100%; padding:1.1rem; background:linear-gradient(135deg,var(--gold),var(--gold-light)); color:white; border:none; border-radius:12px; font-size:1.05rem; font-weight:600; cursor:pointer; }
        .payment-btn:disabled { opacity:0.7; cursor:not-allowed; }
        .payment-error { background:rgba(220,38,38,0.1); color:var(--error); padding:0.75rem; border-radius:8px; margin-bottom:1rem; text-align:center; font-size:0.9rem; }
        .payment-secure { display:flex; align-items:center; justify-content:center; gap:0.5rem; margin-top:1.25rem; color:var(--muted); font-size:0.85rem; }
        
        .app-container { max-width:1100px; margin:0 auto; padding:6rem 2rem 2rem; }
        .app-header { text-align:center; margin-bottom:2rem; }
        .app-header h1 { font-family:'Playfair Display',serif; font-size:2rem; color:var(--primary); margin-bottom:0.5rem; }
        .app-subtitle { color:var(--muted); }
        
        .domaines-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:1rem; margin-bottom:2rem; }
        .domaine-card { background:white; border:2px solid var(--border); border-radius:12px; padding:1.25rem; cursor:pointer; transition:all 0.3s; text-align:center; }
        .domaine-card:hover { border-color:var(--gold); transform:translateY(-2px); }
        .domaine-card.selected { border-color:var(--gold); background:rgba(201,162,39,0.05); }
        .domaine-icon { font-size:2rem; margin-bottom:0.5rem; }
        .domaine-nom { font-weight:600; color:var(--primary); }
        
        .categories-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:0.75rem; margin-bottom:2rem; }
        .categorie-card { background:white; border:2px solid var(--border); border-radius:10px; padding:1rem; cursor:pointer; transition:all 0.3s; }
        .categorie-card:hover { border-color:var(--gold); }
        .categorie-card.selected { border-color:var(--gold); background:rgba(201,162,39,0.05); }
        .categorie-nom { font-weight:600; font-size:0.95rem; color:var(--primary); }
        .categorie-desc { font-size:0.8rem; color:var(--muted); }
        
        .questionnaire { background:white; border-radius:16px; padding:2rem; box-shadow:0 4px 15px rgba(0,0,0,0.05); }
        .questionnaire h3 { font-family:'Playfair Display',serif; color:var(--primary); margin-bottom:1.5rem; }
        .question-group { margin-bottom:1.25rem; }
        .question-label { display:block; font-weight:600; color:var(--primary); margin-bottom:0.4rem; }
        .question-label span { color:var(--error); }
        .question-input { width:100%; padding:0.8rem; border:2px solid var(--border); border-radius:8px; font-size:1rem; resize:vertical; }
        .question-input:focus { outline:none; border-color:var(--gold); }
        .question-select { width:100%; padding:0.8rem; border:2px solid var(--border); border-radius:8px; font-size:1rem; background:white; }
        .submit-btn { width:100%; padding:1rem; background:linear-gradient(135deg,var(--gold),var(--gold-light)); color:white; border:none; border-radius:10px; font-size:1.05rem; font-weight:600; cursor:pointer; margin-top:1rem; }
        .submit-btn:disabled { opacity:0.7; cursor:not-allowed; }
        
        .dossier-container { background:white; border-radius:16px; box-shadow:0 4px 20px rgba(0,0,0,0.08); overflow:hidden; }
        .dossier-header { background:linear-gradient(135deg,var(--primary),#16213e); color:white; padding:1.5rem 2rem; display:flex; justify-content:space-between; align-items:center; }
        .dossier-header h2 { font-family:'Playfair Display',serif; }
        .dossier-actions { display:flex; gap:0.75rem; }
        .action-btn { padding:0.6rem 1.25rem; border-radius:8px; font-weight:600; cursor:pointer; border:none; transition:all 0.3s; }
        .action-btn.primary { background:var(--gold); color:white; }
        .action-btn.secondary { background:rgba(255,255,255,0.1); color:white; border:1px solid rgba(255,255,255,0.3); }
        .dossier-content { padding:2rem; max-height:70vh; overflow-y:auto; white-space:pre-wrap; line-height:1.8; }
        
        .chat-toggle { position:fixed; bottom:2rem; right:2rem; width:60px; height:60px; background:linear-gradient(135deg,var(--gold),var(--gold-light)); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.5rem; cursor:pointer; box-shadow:0 4px 20px rgba(201,162,39,0.4); border:none; z-index:1000; }
        .chat-panel { position:fixed; bottom:6rem; right:2rem; width:380px; max-height:500px; background:white; border-radius:16px; box-shadow:0 10px 40px rgba(0,0,0,0.15); display:flex; flex-direction:column; z-index:1000; overflow:hidden; }
        .chat-header { background:linear-gradient(135deg,var(--primary),#16213e); color:white; padding:1rem 1.5rem; display:flex; justify-content:space-between; align-items:center; }
        .chat-header h4 { font-family:'Playfair Display',serif; }
        .chat-close { background:none; border:none; color:white; font-size:1.25rem; cursor:pointer; }
        .chat-messages { flex:1; overflow-y:auto; padding:1rem; max-height:300px; }
        .chat-message { margin-bottom:1rem; }
        .chat-message.user { text-align:right; }
        .chat-message.user .chat-bubble { background:var(--gold); color:white; }
        .chat-message.assistant .chat-bubble { background:var(--bg); }
        .chat-bubble { display:inline-block; padding:0.75rem 1rem; border-radius:12px; max-width:85%; text-align:left; font-size:0.95rem; }
        .chat-input-container { padding:1rem; border-top:1px solid var(--border); display:flex; gap:0.5rem; }
        .chat-input { flex:1; padding:0.75rem; border:2px solid var(--border); border-radius:10px; font-size:0.95rem; }
        .chat-input:focus { outline:none; border-color:var(--gold); }
        .chat-send { padding:0.75rem 1.25rem; background:var(--gold); color:white; border:none; border-radius:10px; cursor:pointer; font-weight:600; }
        
        .footer { background:var(--primary); color:white; padding:3rem 2rem; text-align:center; }
        .footer-links { display:flex; justify-content:center; gap:2rem; margin-bottom:1.5rem; flex-wrap:wrap; }
        .footer-link { color:rgba(255,255,255,0.7); text-decoration:none; font-size:0.9rem; cursor:pointer; transition:color 0.3s; }
        .footer-link:hover { color:var(--gold); }
        .footer-copy { color:rgba(255,255,255,0.5); font-size:0.85rem; }
        
        .loading-spinner { display:inline-block; width:20px; height:20px; border:3px solid rgba(255,255,255,0.3); border-radius:50%; border-top-color:white; animation:spin 1s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        
        @media (max-width:1024px) {
          .comparison-grid { grid-template-columns:1fr; }
          .vs-badge { display:none; }
          .steps-grid { grid-template-columns:repeat(2,1fr); }
          .testimonials-grid { grid-template-columns:1fr; }
          .legal-stats-grid { grid-template-columns:repeat(2,1fr); }
          .usecases-grid { grid-template-columns:1fr; }
        }
        @media (max-width:768px) {
          .nav-links { display:none; }
          .hero h1 { font-size:2rem; }
          .hero-stats { gap:1.5rem; }
          .section-title { font-size:1.75rem; }
          .steps-grid { grid-template-columns:1fr; }
          .chat-panel { width:calc(100% - 2rem); right:1rem; }
          .legal-stats-grid { grid-template-columns:1fr; max-width:300px; margin:0 auto; }
          .legal-stat-card { padding:1.25rem; }
          .legal-stat-value { font-size:2rem; }
          .cta-container h2 { font-size:1.75rem; }
          .cta-guarantees { gap:1rem; }
          .cta-guarantees span { font-size:0.8rem; }
          .faq-question { font-size:0.9rem; padding:1rem; }
          .faq-answer { padding:0 1rem 1rem; font-size:0.9rem; }
          .single-pricing-card { padding:2rem; }
          .single-pricing-price { font-size:3rem; }
        }
      `}</style>

      {/* NAVIGATION */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => setCurrentView('landing')} style={{cursor:'pointer'}}>
          <span>⚖️</span> Mon<span>Dossier</span>Juridique
        </div>
        {currentView === 'landing' && (
          <div className="nav-links">
            <span className="nav-link" onClick={() => scrollTo('how')}>Comment ça marche</span>
            <span className="nav-link" onClick={() => scrollTo('usecases')}>Cas d'usage</span>
            <span className="nav-link" onClick={() => scrollTo('faq')}>FAQ</span>
            <span className="nav-link" onClick={() => scrollTo('pricing')}>Tarif</span>
            <span className="nav-link" onClick={() => setCurrentView('contact')}>Contact</span>
            <button className="nav-cta" onClick={() => scrollTo('pricing')}>Commencer</button>
          </div>
        )}
        {currentView === 'app' && (
          <div className="nav-links">
            <span className="nav-link" onClick={() => setCurrentView('landing')}>Accueil</span>
          </div>
        )}
      </nav>

      {/* LANDING PAGE */}
      {currentView === 'landing' && (
        <>
          <section className="hero">
            <div className="hero-inner">
              <div className="hero-badge">
                <span style={{width:8,height:8,background:'#10b981',borderRadius:'50%'}}></span>
                +12 000 dossiers générés en France
              </div>
              <h1>Votre <span>dossier juridique complet</span> en 30 minutes</h1>
              <p className="hero-subtitle">
                <strong>Alternative économique à l'avocat</strong> pour licenciement abusif, divorce, succession, prud'hommes. 
                Notre IA analyse 93 000 articles de loi et 2,4 millions de jurisprudences françaises. 
                <strong> Économisez jusqu'à 2 000€</strong> en honoraires.
              </p>
              <div className="hero-stats">
                <div><div className="hero-stat-value">{counters.savings}€</div><div className="hero-stat-label">Économie moyenne vs avocat</div></div>
                <div><div className="hero-stat-value">{counters.time} min</div><div className="hero-stat-label">Temps de génération</div></div>
                <div><div className="hero-stat-value">{counters.satisfaction}%</div><div className="hero-stat-label">Clients satisfaits</div></div>
              </div>
              <div className="hero-buttons">
                <button className="btn btn-primary" onClick={() => scrollTo('pricing')}>Créer mon dossier — 49€ →</button>
                <button className="btn btn-secondary" onClick={() => scrollTo('how')}>Comment ça marche ?</button>
              </div>
              <div className="hero-trust">
                <p>✓ Licenciement abusif · ✓ Divorce · ✓ Prud'hommes · ✓ Succession · ✓ Loyers impayés</p>
              </div>
            </div>
          </section>

          <section className="section section-white">
            <div className="section-header">
              <span className="section-badge">⚜️ Droit Français</span>
              <h2 className="section-title">Une base juridique exhaustive</h2>
              <p className="section-subtitle">Notre IA analyse en temps réel l'ensemble du droit français pour construire votre dossier</p>
            </div>
            <div className="legal-stats-grid">
              <div className="legal-stat-card">
                <div className="legal-stat-icon">📚</div>
                <div className="legal-stat-value">93 000+</div>
                <div className="legal-stat-label">Articles de loi</div>
                <div className="legal-stat-desc">Code civil, Code du travail, Code pénal, Code de commerce...</div>
              </div>
              <div className="legal-stat-card">
                <div className="legal-stat-icon">⚖️</div>
                <div className="legal-stat-value">2,4 M+</div>
                <div className="legal-stat-label">Décisions de justice</div>
                <div className="legal-stat-desc">Cour de cassation, Cours d'appel, Conseil d'État, tribunaux</div>
              </div>
              <div className="legal-stat-card">
                <div className="legal-stat-icon">📖</div>
                <div className="legal-stat-value">77</div>
                <div className="legal-stat-label">Codes juridiques</div>
                <div className="legal-stat-desc">L'intégralité des codes officiels français à jour</div>
              </div>
              <div className="legal-stat-card">
                <div className="legal-stat-icon">🔄</div>
                <div className="legal-stat-value">24h</div>
                <div className="legal-stat-label">Mise à jour</div>
                <div className="legal-stat-desc">Jurisprudence et textes actualisés quotidiennement</div>
              </div>
            </div>
            <div className="legal-sources">
              <p>Sources officielles : Légifrance • Cour de cassation • Conseil d'État • DALLOZ • LexisNexis</p>
            </div>
          </section>

          <section className="section">
            <div className="section-header">
              <span className="section-badge">💸 Économies</span>
              <h2 className="section-title">Pourquoi payer plus ?</h2>
            </div>
            <div className="comparison-grid">
              <div className="comparison-card">
                <div className="comparison-header">
                  <div className="comparison-icon">🏛️</div>
                  <h3 className="comparison-title">Cabinet d'avocat</h3>
                  <div className="comparison-price">1 500€ - 3 000€</div>
                </div>
                <ul className="comparison-list">
                  <li>✗ RDV sous 2-3 semaines</li>
                  <li>✗ 3-5 consultations</li>
                  <li>✗ Délai: 1-2 mois</li>
                </ul>
              </div>
              <div className="vs-badge">VS</div>
              <div className="comparison-card modern">
                <div className="comparison-header">
                  <div className="comparison-icon">⚡</div>
                  <h3 className="comparison-title">MonDossierJuridique</h3>
                  <div className="comparison-price">49€</div>
                </div>
                <ul className="comparison-list">
                  <li>✓ Disponible 24h/24</li>
                  <li>✓ Dossier en 30 min</li>
                  <li>✓ Qualité pro garantie</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="section section-white" id="how">
            <div className="section-header">
              <span className="section-badge">📋 Simple</span>
              <h2 className="section-title">Comment ça fonctionne ?</h2>
            </div>
            <div className="steps-grid">
              {[
                {n:1,i:'📝',t:'Décrivez',d:'Questionnaire guidé'},
                {n:2,i:'🤖',t:'IA analyse',d:'Recherche juridique'},
                {n:3,i:'📊',t:'Dossier',d:'40-60 pages pro'},
                {n:4,i:'✅',t:'Téléchargez',d:'Prêt pour l\'avocat'},
              ].map(s => (
                <div key={s.n} className="step-card">
                  <div className="step-number">{s.n}</div>
                  <div className="step-icon">{s.i}</div>
                  <h3 className="step-title">{s.t}</h3>
                  <p className="step-desc">{s.d}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="section" id="testimonials">
            <div className="section-header">
              <span className="section-badge">💬 Témoignages</span>
              <h2 className="section-title">Ils ont gagné sans avocat</h2>
              <p className="section-subtitle">Découvrez comment nos clients ont résolu leurs litiges juridiques</p>
            </div>
            <div className="testimonials-grid">
              {TESTIMONIALS.slice(0, 4).map((t,i) => (
                <div key={i} className="testimonial-card">
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">{t.avatar}</div>
                    <div className="testimonial-info">
                      <h4>{t.name}</h4>
                      <span>{t.role}</span>
                      <div className="testimonial-stars">{'★'.repeat(t.rating)}</div>
                    </div>
                  </div>
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="testimonial-results">
                    <div className="testimonial-result"><span>💰</span><div><div className="testimonial-result-value">{t.savings}</div><div className="testimonial-result-label">Économisé</div></div></div>
                    <div className="testimonial-result"><span>⏱️</span><div><div className="testimonial-result-value">{t.time}</div><div className="testimonial-result-label">Temps</div></div></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SINGLE PRICING SECTION */}
          <section className="section section-white" id="pricing">
            <div className="section-header">
              <span className="section-badge">💎 Tarif unique</span>
              <h2 className="section-title">Un prix simple, tout inclus</h2>
              <p className="section-subtitle">Pas d'abonnement, pas de frais cachés</p>
            </div>
            <div className="single-pricing-container">
              <div className="single-pricing-card">
                <div className="single-pricing-badge">⭐ OFFRE UNIQUE</div>
                <div className="single-pricing-icon">⚖️</div>
                <h3 className="single-pricing-title">Dossier Juridique Complet</h3>
                <p className="single-pricing-desc">Tout ce dont vous avez besoin pour défendre vos droits</p>
                <div className="single-pricing-old">Valeur avocat : 1 500€ - 3 000€</div>
                <div className="single-pricing-price">49€ <span>TTC</span></div>
                <ul className="single-pricing-features">
                  <li>Dossier complet de 40-60 pages</li>
                  <li>Analyse juridique personnalisée</li>
                  <li>Textes de loi applicables</li>
                  <li>Jurisprudence récente (10+ décisions)</li>
                  <li>Calcul de vos indemnités</li>
                  <li>Modèles de documents (mise en demeure...)</li>
                  <li>Stratégie procédurale</li>
                  <li>Chat assistant illimité</li>
                </ul>
                <button className="single-pricing-cta" onClick={() => setCurrentView('payment')}>
                  Créer mon dossier — 49€ →
                </button>
              </div>
            </div>
            <div style={{maxWidth:'500px',margin:'2rem auto 0',textAlign:'center',padding:'1.5rem',background:'rgba(5,150,105,0.05)',border:'2px solid rgba(5,150,105,0.2)',borderRadius:'12px'}}>
              <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>🛡️</div>
              <h4 style={{color:'#059669'}}>Satisfait ou remboursé 30 jours</h4>
            </div>
          </section>

          {/* USE CASES SECTION - SEO */}
          <section className="section" id="usecases">
            <div className="section-header">
              <span className="section-badge">🎯 Cas d'usage</span>
              <h2 className="section-title">Votre situation juridique, notre solution</h2>
              <p className="section-subtitle">Des milliers de Français ont déjà résolu leur litige grâce à nos dossiers</p>
            </div>
            <div className="usecases-grid">
              <div className="usecase-card">
                <div className="usecase-icon">💼</div>
                <h3>Licenciement abusif</h3>
                <p>Vous avez été licencié injustement ? Notre IA génère votre dossier pour les <strong>prud'hommes</strong> : calcul des indemnités, jurisprudences favorables, mise en demeure.</p>
                <ul>
                  <li>✓ Analyse selon le Code du travail</li>
                  <li>✓ Calcul automatique des indemnités</li>
                  <li>✓ Jurisprudence Cour de cassation</li>
                </ul>
              </div>
              <div className="usecase-card">
                <div className="usecase-icon">💔</div>
                <h3>Divorce & Séparation</h3>
                <p>Préparez votre <strong>divorce</strong> efficacement : calcul de la pension alimentaire, partage des biens, droits de garde des enfants.</p>
                <ul>
                  <li>✓ Barème pension alimentaire</li>
                  <li>✓ Inventaire des biens à partager</li>
                  <li>✓ Droits parentaux détaillés</li>
                </ul>
              </div>
              <div className="usecase-card">
                <div className="usecase-icon">🏠</div>
                <h3>Litiges immobiliers</h3>
                <p><strong>Loyers impayés</strong>, caution non rendue, vices cachés ? Obtenez une mise en demeure juridiquement solide et un dossier complet.</p>
                <ul>
                  <li>✓ Mise en demeure personnalisée</li>
                  <li>✓ Procédure d'expulsion</li>
                  <li>✓ Recours vices cachés</li>
                </ul>
              </div>
              <div className="usecase-card">
                <div className="usecase-icon">📜</div>
                <h3>Succession & Héritage</h3>
                <p><strong>Succession bloquée</strong> ? Testament contesté ? Faites valoir vos droits à la réserve héréditaire avec un dossier juridique complet.</p>
                <ul>
                  <li>✓ Calcul de la réserve héréditaire</li>
                  <li>✓ Contestation de testament</li>
                  <li>✓ Partage équitable</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ SECTION - SEO */}
          <section className="section section-white" id="faq">
            <div className="section-header">
              <span className="section-badge">❓ Questions fréquentes</span>
              <h2 className="section-title">Tout savoir sur MonDossierJuridique</h2>
              <p className="section-subtitle">Les réponses à vos questions sur nos dossiers juridiques IA</p>
            </div>
            <div className="faq-container">
              {FAQ_DATA.map((faq, index) => (
                <details key={index} className="faq-item">
                  <summary className="faq-question">{faq.question}</summary>
                  <div className="faq-answer">{faq.answer}</div>
                </details>
              ))}
            </div>
          </section>

          {/* CTA FINAL */}
          <section className="section cta-section">
            <div className="cta-container">
              <h2>Prêt à défendre vos droits ?</h2>
              <p>Rejoignez les 12 000+ Français qui ont économisé en moyenne 1 847€ grâce à MonDossierJuridique</p>
              <button className="btn btn-primary btn-large" onClick={() => scrollTo('pricing')}>
                Générer mon dossier juridique — 49€ →
              </button>
              <div className="cta-guarantees">
                <span>🔒 Paiement sécurisé</span>
                <span>⚡ Dossier en 30 min</span>
                <span>🛡️ Satisfait ou remboursé</span>
              </div>
            </div>
          </section>

          <footer className="footer">
            <div className="footer-links">
              <span className="footer-link" onClick={() => {setLegalSection('mentions');setCurrentView('legal');}}>Mentions légales</span>
              <span className="footer-link" onClick={() => {setLegalSection('confidentialite');setCurrentView('legal');}}>Politique de confidentialité</span>
              <span className="footer-link" onClick={() => {setLegalSection('cgv');setCurrentView('legal');}}>CGV</span>
              <span className="footer-link" onClick={() => {setLegalSection('cookies');setCurrentView('legal');}}>Cookies</span>
              <span className="footer-link" onClick={() => setCurrentView('contact')}>Contact</span>
            </div>
            <p className="footer-copy">© 2024 MonDossierJuridique.fr</p>
          </footer>
        </>
      )}

      {/* PAGE DE PAIEMENT */}
      {currentView === 'payment' && (
        <div className="payment-page">
          <div className="payment-container">
            <button onClick={() => setCurrentView('landing')} style={{background:'none',border:'none',color:'var(--gold)',cursor:'pointer',marginBottom:'1rem',fontSize:'0.95rem'}}>← Retour</button>
            <div className="payment-card">
              <h1 className="payment-title">Finaliser ma commande</h1>
              <p className="payment-subtitle">Accès immédiat après paiement</p>
              
              <div className="payment-plan">
                <div className="payment-plan-name">Dossier Juridique Complet</div>
                <div className="payment-plan-price">49€</div>
              </div>
              
              {paymentError && <div className="payment-error">{paymentError}</div>}
              
              <div className="form-group">
                <label className="form-label">Votre email</label>
                <input 
                  type="email" 
                  className="form-input"
                  placeholder="exemple@email.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>
              
              <button className="payment-btn" onClick={handlePayment} disabled={paymentLoading}>
                {paymentLoading ? <span className="loading-spinner"></span> : 'Payer 49€ par carte'}
              </button>
              
              <div className="payment-secure">
                🔒 Paiement sécurisé par Stripe
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APPLICATION */}
      {currentView === 'app' && (
        <div className="app-container">
          <div className="app-header">
            <h1>Créez votre dossier juridique</h1>
            <p className="app-subtitle">Sélectionnez le domaine de votre litige</p>
          </div>
          
          {!selectedDomaine && (
            <div className="domaines-grid">
              {Object.entries(DOMAINES).map(([k,d]) => (
                <div key={k} className="domaine-card" onClick={() => setSelectedDomaine(k)}>
                  <div className="domaine-icon">{d.icone}</div>
                  <div className="domaine-nom">{d.nom}</div>
                </div>
              ))}
            </div>
          )}
          
          {selectedDomaine && !selectedCategorie && DOMAINES[selectedDomaine]?.categories?.length > 0 && (
            <>
              <button onClick={() => setSelectedDomaine(null)} style={{background:'none',border:'none',color:'var(--gold)',cursor:'pointer',marginBottom:'1rem'}}>← Retour</button>
              <h2 style={{marginBottom:'1rem',color:'var(--primary)'}}>{DOMAINES[selectedDomaine].nom}</h2>
              <div className="categories-grid">
                {DOMAINES[selectedDomaine].categories.map(c => (
                  <div key={c.id} className="categorie-card" onClick={() => setSelectedCategorie(c.id)}>
                    <div className="categorie-nom">{c.nom}</div>
                    <div className="categorie-desc">{c.desc}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {selectedDomaine && (selectedCategorie || DOMAINES[selectedDomaine]?.categories?.length === 0) && !dossierGenere && (
            <>
              <button onClick={() => {setSelectedCategorie(null);if(!DOMAINES[selectedDomaine]?.categories?.length)setSelectedDomaine(null);}} style={{background:'none',border:'none',color:'var(--gold)',cursor:'pointer',marginBottom:'1rem'}}>← Retour</button>
              <div className="questionnaire">
                <h3>📝 Décrivez votre situation</h3>
                {QUESTIONNAIRE_DEFAULT.map(q => (
                  <div key={q.id} className="question-group">
                    <label className="question-label">{q.label} {q.required && <span>*</span>}</label>
                    {q.type === 'textarea' && (
                      <textarea className="question-input" rows="3" placeholder={q.placeholder} value={formData[q.id]||''} onChange={e => setFormData({...formData,[q.id]:e.target.value})} />
                    )}
                    {q.type === 'date' && (
                      <input type="date" className="question-input" value={formData[q.id]||''} onChange={e => setFormData({...formData,[q.id]:e.target.value})} />
                    )}
                    {q.type === 'select' && (
                      <select className="question-select" value={formData[q.id]||''} onChange={e => setFormData({...formData,[q.id]:e.target.value})}>
                        <option value="">Sélectionnez</option>
                        {q.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    )}
                  </div>
                ))}
                <button className="submit-btn" onClick={handleSubmitDossier} disabled={loading}>
                  {loading ? <><span className="loading-spinner"></span> Génération en cours...</> : '🚀 Générer mon dossier'}
                </button>
              </div>
            </>
          )}
          
          {dossierGenere && (
            <>
              <button onClick={() => {setDossierGenere(null);setFormData({});}} style={{background:'none',border:'none',color:'var(--gold)',cursor:'pointer',marginBottom:'1rem'}}>← Nouveau dossier</button>
              <div className="dossier-container">
                <div className="dossier-header">
                  <h2>📋 Votre Dossier Juridique</h2>
                  <div className="dossier-actions">
                    <button className="action-btn primary" onClick={downloadPDF}>📥 Télécharger</button>
                    <button className="action-btn secondary" onClick={() => navigator.clipboard.writeText(dossierGenere)}>📋 Copier</button>
                  </div>
                </div>
                <div className="dossier-content">{dossierGenere}</div>
              </div>
            </>
          )}
          
          <button className="chat-toggle" onClick={() => setShowChat(!showChat)}>💬</button>
          
          {showChat && (
            <div className="chat-panel">
              <div className="chat-header">
                <h4>Assistant juridique</h4>
                <button className="chat-close" onClick={() => setShowChat(false)}>×</button>
              </div>
              <div className="chat-messages">
                {chatMessages.length === 0 && (
                  <div className="chat-message assistant">
                    <div className="chat-bubble">Bonjour ! Je suis votre assistant juridique. Posez-moi vos questions.</div>
                  </div>
                )}
                {chatMessages.map((m,i) => (
                  <div key={i} className={`chat-message ${m.role}`}>
                    <div className="chat-bubble">{m.content}</div>
                  </div>
                ))}
                {chatLoading && <div className="chat-message assistant"><div className="chat-bubble">...</div></div>}
              </div>
              <div className="chat-input-container">
                <input className="chat-input" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleChat()} placeholder="Votre question..." />
                <button className="chat-send" onClick={handleChat}>→</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
