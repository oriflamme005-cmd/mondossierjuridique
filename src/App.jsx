import React, { useState, useEffect } from 'react';

// ════════════════════════════════════════════════════════════════════════════════════════
// MONDOSSIERJURIDIQUE.FR - APPLICATION COMPLÈTE
// Landing Page + Paiement Stripe + Application Dossiers Juridiques
// ════════════════════════════════════════════════════════════════════════════════════════

const PRICING = {
  essentiel: { price: 29, name: 'Essentiel', dossiers: 1, description: '1 dossier juridique' },
  standard: { price: 49, name: 'Standard', dossiers: 3, popular: true, description: '3 dossiers juridiques' },
  premium: { price: 99, name: 'Premium', dossiers: 10, description: '10 dossiers juridiques' },
};

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
  { name: "Marie L.", role: "Licenciée abusivement", avatar: "👩‍💼", rating: 5, text: "J'ai économisé plus de 2000€ en honoraires d'avocat. Mon dossier était prêt en 25 minutes !", savings: "2 150€", time: "25 min" },
  { name: "Pierre M.", role: "Divorce contentieux", avatar: "👨‍💻", rating: 5, text: "La plateforme m'a guidé étape par étape. Le dossier contenait des jurisprudences que même mon avocat ne connaissait pas.", savings: "1 800€", time: "35 min" },
  { name: "Sophie D.", role: "Succession litigieuse", avatar: "👩‍🔬", rating: 5, text: "Ma succession était bloquée depuis 2 ans. Grâce au dossier complet, j'ai débloqué la situation en 3 semaines.", savings: "3 500€", time: "40 min" },
  { name: "Thomas R.", role: "Litige locataire", avatar: "👨‍🎓", rating: 5, text: "Mon propriétaire refusait ma caution. Après ma mise en demeure basée sur le dossier, remboursé en 10 jours.", savings: "950€", time: "15 min" },
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

export default function MonDossierJuridique() {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  
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
        body: JSON.stringify({ plan: selectedPlan, email: userEmail })
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Erreur');
      }
    } catch (error) {
      setPaymentError('Erreur de paiement. Veuillez réessayer.');
      setPaymentLoading(false);
    }
  };

  const generateDossier = async () => {
    setLoading(true);
    const domaine = DOMAINES[selectedDomaine];
    
    const prompt = `Tu es un avocat expert en ${domaine.nom}. Génère un DOSSIER JURIDIQUE COMPLET:

INFORMATIONS:
${Object.entries(formData).map(([k,v]) => `- ${k}: ${v}`).join('\n')}

Structure obligatoire:
╔══════════════════════════════════════════════════════════════════════════════╗
║                         DOSSIER JURIDIQUE COMPLET                            ║
╚══════════════════════════════════════════════════════════════════════════════╝

I. SYNTHÈSE EXÉCUTIVE
II. QUALIFICATION JURIDIQUE
III. ANALYSE (Points forts, Vigilances, Risques)
IV. TEXTES APPLICABLES (Articles de loi EXACTS)
V. JURISPRUDENCE (Décisions récentes avec références)
VI. STRATÉGIE PROCÉDURALE
VII. DEMANDES CHIFFRÉES
VIII. CHANCES DE SUCCÈS (%)
IX. ESTIMATION FRAIS
X. PIÈCES À RASSEMBLER
XI. MODÈLE MISE EN DEMEURE
XII. CONSEILS PRATIQUES

Utilise web_search pour la jurisprudence récente. Sois EXHAUSTIF et PROFESSIONNEL.`;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          system: "Tu es un avocat expert français. Utilise web_search pour les jurisprudences récentes.",
          max_tokens: 12000,
        })
      });

      const data = await response.json();
      if (data.content) {
        const text = data.content.find(c => c.type === 'text');
        if (text) {
          setDossierGenere(text.text);
          setChatMessages([{ role: 'assistant', content: '✅ Dossier généré ! Je suis votre assistant. Posez vos questions.' }]);
        }
      }
    } catch (error) {
      setDossierGenere("Erreur lors de la génération. Veuillez réessayer.");
    }
    setLoading(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: msg }]);
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, { role: 'user', content: msg }],
          system: `Assistant juridique. Contexte: ${dossierGenere?.substring(0, 2000)}...`,
          max_tokens: 4000,
        })
      });
      const data = await response.json();
      if (data.content) {
        const text = data.content.find(c => c.type === 'text');
        if (text) setChatMessages(prev => [...prev, { role: 'assistant', content: text.text }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: "Erreur. Réessayez." }]);
    }
    setChatLoading(false);
  };

  const downloadDossier = () => {
    if (!dossierGenere) return;
    const blob = new Blob([dossierGenere], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Dossier-Juridique-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Source+Sans+Pro:wght@400;600;700&display=swap');
    :root { --primary:#1a1a2e; --gold:#c9a227; --gold-light:#e3c565; --text:#2d3748; --muted:#718096; --border:#e2e8f0; --bg:#f8f9fa; --success:#059669; --error:#dc2626; }
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Source Sans Pro',sans-serif; background:var(--bg); color:var(--text); line-height:1.6; }
    
    .navbar { position:fixed; top:0; left:0; right:0; background:rgba(26,26,46,0.95); backdrop-filter:blur(10px); z-index:1000; padding:1rem 2rem; }
    .navbar-inner { max-width:1400px; margin:0 auto; display:flex; justify-content:space-between; align-items:center; }
    .nav-logo { display:flex; align-items:center; gap:0.75rem; cursor:pointer; }
    .nav-logo h1 { font-family:'Playfair Display',serif; font-size:1.4rem; background:linear-gradient(135deg,var(--gold),var(--gold-light)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .nav-links { display:flex; gap:2rem; align-items:center; }
    .nav-link { color:rgba(255,255,255,0.8); text-decoration:none; cursor:pointer; }
    .nav-link:hover { color:var(--gold); }
    .nav-cta { background:linear-gradient(135deg,var(--gold),var(--gold-light)); color:white; padding:0.6rem 1.5rem; border-radius:25px; font-weight:600; border:none; cursor:pointer; }
    
    .hero { min-height:100vh; background:linear-gradient(135deg,var(--primary),#16213e,#1e3a5f); display:flex; align-items:center; padding:8rem 2rem 4rem; }
    .hero-inner { max-width:1200px; margin:0 auto; text-align:center; }
    .hero-badge { display:inline-flex; align-items:center; gap:0.5rem; background:rgba(201,162,39,0.15); border:1px solid rgba(201,162,39,0.3); padding:0.5rem 1rem; border-radius:25px; color:var(--gold-light); margin-bottom:1.5rem; }
    .hero h1 { font-family:'Playfair Display',serif; font-size:3rem; color:white; margin-bottom:1.5rem; }
    .hero h1 span { background:linear-gradient(135deg,var(--gold),var(--gold-light)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .hero-subtitle { font-size:1.2rem; color:rgba(255,255,255,0.8); margin-bottom:2rem; max-width:700px; margin-left:auto; margin-right:auto; }
    .hero-stats { display:flex; justify-content:center; gap:3rem; margin-bottom:2.5rem; flex-wrap:wrap; }
    .hero-stat-value { font-size:2.5rem; font-weight:700; color:var(--gold); font-family:'Playfair Display',serif; }
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
    
    .pricing-grid { max-width:1000px; margin:0 auto; display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
    .pricing-card { background:white; border:2px solid var(--border); border-radius:20px; padding:2rem; position:relative; transition:all 0.3s; }
    .pricing-card:hover { transform:translateY(-5px); box-shadow:0 15px 40px rgba(0,0,0,0.1); }
    .pricing-card.popular { border-color:var(--gold); transform:scale(1.03); box-shadow:0 15px 40px rgba(201,162,39,0.2); }
    .pricing-popular-badge { position:absolute; top:-12px; left:50%; transform:translateX(-50%); background:linear-gradient(135deg,var(--gold),var(--gold-light)); color:white; padding:0.4rem 1.25rem; border-radius:20px; font-size:0.8rem; font-weight:600; }
    .pricing-header { text-align:center; margin-bottom:1.5rem; }
    .pricing-name { font-size:1.25rem; color:var(--primary); margin-bottom:0.25rem; }
    .pricing-desc { color:var(--muted); font-size:0.9rem; margin-bottom:1rem; }
    .pricing-amount { font-size:3rem; font-weight:700; color:var(--primary); }
    .pricing-features { list-style:none; margin-bottom:1.5rem; }
    .pricing-features li { display:flex; align-items:center; gap:0.5rem; padding:0.5rem 0; font-size:0.95rem; }
    .pricing-features li::before { content:'✓'; color:var(--success); font-weight:bold; }
    .pricing-cta { display:block; width:100%; padding:0.9rem; border-radius:10px; font-size:1rem; font-weight:600; cursor:pointer; border:none; transition:all 0.3s; }
    .pricing-card:not(.popular) .pricing-cta { background:var(--bg); color:var(--primary); }
    .pricing-card:not(.popular) .pricing-cta:hover { background:var(--gold); color:white; }
    .pricing-card.popular .pricing-cta { background:linear-gradient(135deg,var(--gold),var(--gold-light)); color:white; }
    
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
    .app-header h1 { font-family:'Playfair Display',serif; font-size:2rem; color:var(--primary); }
    .domains-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:1.25rem; }
    .domain-card { background:white; border:2px solid var(--border); border-radius:14px; padding:1.25rem; cursor:pointer; transition:all 0.3s; text-align:center; }
    .domain-card:hover { border-color:var(--gold); transform:translateY(-3px); }
    .domain-icon { font-size:2.25rem; margin-bottom:0.75rem; }
    .domain-name { font-size:1.1rem; font-weight:600; color:var(--primary); }
    .categories-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:1rem; margin-top:1.5rem; }
    .category-card { background:white; border:2px solid var(--border); border-radius:10px; padding:1rem; cursor:pointer; transition:all 0.2s; }
    .category-card:hover { border-color:var(--gold); }
    .category-card.autre { border-style:dashed; }
    .category-name { font-weight:600; color:var(--primary); font-size:0.95rem; }
    .category-desc { color:var(--muted); font-size:0.8rem; }
    
    .questionnaire { background:white; border-radius:16px; padding:1.5rem; margin-top:1.5rem; }
    .questionnaire h2 { font-family:'Playfair Display',serif; color:var(--primary); margin-bottom:1.5rem; font-size:1.25rem; }
    .form-textarea { width:100%; min-height:100px; padding:0.9rem; border:2px solid var(--border); border-radius:10px; font-size:1rem; font-family:inherit; resize:vertical; }
    .form-textarea:focus { outline:none; border-color:var(--gold); }
    .form-select { width:100%; padding:0.9rem; border:2px solid var(--border); border-radius:10px; font-size:1rem; background:white; }
    .submit-btn { width:100%; padding:1.1rem; background:linear-gradient(135deg,var(--gold),var(--gold-light)); color:white; border:none; border-radius:10px; font-size:1rem; font-weight:600; cursor:pointer; margin-top:1.5rem; }
    .submit-btn:disabled { opacity:0.7; cursor:not-allowed; }
    
    .dossier-container { background:white; border-radius:16px; padding:1.5rem; margin-top:1.5rem; }
    .dossier-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem; }
    .dossier-content { background:var(--primary); border-radius:10px; padding:1.5rem; color:#10b981; font-family:monospace; font-size:0.8rem; white-space:pre-wrap; max-height:500px; overflow-y:auto; }
    .download-btn { padding:0.6rem 1.25rem; background:var(--success); color:white; border:none; border-radius:8px; font-weight:600; cursor:pointer; }
    
    .chat-button { position:fixed; bottom:1.5rem; right:1.5rem; width:55px; height:55px; background:linear-gradient(135deg,var(--gold),var(--gold-light)); border:none; border-radius:50%; font-size:1.4rem; cursor:pointer; box-shadow:0 4px 15px rgba(201,162,39,0.4); z-index:100; }
    .chat-panel { position:fixed; bottom:5.5rem; right:1.5rem; width:350px; max-height:450px; background:white; border-radius:16px; box-shadow:0 10px 40px rgba(0,0,0,0.2); z-index:100; display:flex; flex-direction:column; }
    .chat-header { background:var(--primary); color:white; padding:0.9rem 1.25rem; border-radius:16px 16px 0 0; display:flex; justify-content:space-between; align-items:center; }
    .chat-messages { flex:1; overflow-y:auto; padding:1rem; max-height:300px; }
    .chat-message { margin-bottom:0.75rem; padding:0.75rem; border-radius:10px; font-size:0.9rem; }
    .chat-message.user { background:var(--bg); margin-left:1.5rem; }
    .chat-message.assistant { background:rgba(201,162,39,0.1); margin-right:1.5rem; }
    .chat-input-container { padding:0.75rem; border-top:1px solid var(--border); display:flex; gap:0.5rem; }
    .chat-input { flex:1; padding:0.6rem; border:2px solid var(--border); border-radius:8px; font-size:0.9rem; }
    .chat-send { padding:0.6rem 0.9rem; background:var(--gold); color:white; border:none; border-radius:8px; cursor:pointer; }
    
    .footer { background:var(--primary); color:white; padding:2.5rem 2rem 1.5rem; margin-top:3rem; }
    .footer-inner { max-width:1100px; margin:0 auto; text-align:center; }
    .footer h3 { font-family:'Playfair Display',serif; background:linear-gradient(135deg,var(--gold),var(--gold-light)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:0.75rem; }
    .footer p { color:rgba(255,255,255,0.6); font-size:0.85rem; }
    
    .loading-spinner { width:40px; height:40px; border:3px solid var(--border); border-top-color:var(--gold); border-radius:50%; animation:spin 1s linear infinite; margin:1.5rem auto; }
    @keyframes spin { to { transform:rotate(360deg); } }
    
    .back-btn { background:none; border:none; color:var(--gold); cursor:pointer; margin-bottom:1rem; font-size:0.95rem; }
    
    @media (max-width:1024px) {
      .comparison-grid { grid-template-columns:1fr; }
      .vs-badge { display:none; }
      .steps-grid { grid-template-columns:repeat(2,1fr); }
      .testimonials-grid { grid-template-columns:1fr; }
      .pricing-grid { grid-template-columns:1fr; max-width:350px; }
      .pricing-card.popular { transform:none; }
    }
    @media (max-width:768px) {
      .nav-links { display:none; }
      .hero h1 { font-size:2rem; }
      .hero-stats { gap:1.5rem; }
      .section-title { font-size:1.75rem; }
      .steps-grid { grid-template-columns:1fr; }
      .chat-panel { width:calc(100% - 2rem); right:1rem; }
    }
  `;

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const reset = () => { setCurrentView('landing'); setSelectedDomaine(null); setSelectedCategorie(null); setDossierGenere(null); setFormData({}); };

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════════

  return (
    <>
      <style>{styles}</style>
      
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="nav-logo" onClick={reset}>
            <span>⚖️</span>
            <h1>MonDossierJuridique</h1>
          </div>
          {currentView === 'landing' && (
            <div className="nav-links">
              <span className="nav-link" onClick={() => scrollTo('how')}>Comment ça marche</span>
              <span className="nav-link" onClick={() => scrollTo('testimonials')}>Témoignages</span>
              <span className="nav-link" onClick={() => scrollTo('pricing')}>Tarifs</span>
              <button className="nav-cta" onClick={() => scrollTo('pricing')}>Commencer</button>
            </div>
          )}
        </div>
      </nav>

      {/* LANDING PAGE */}
      {currentView === 'landing' && (
        <>
          <section className="hero">
            <div className="hero-inner">
              <div className="hero-badge">
                <span style={{width:8,height:8,background:'#10b981',borderRadius:'50%'}}></span>
                +12 000 dossiers générés
              </div>
              <h1>Votre dossier juridique complet en <span>30 minutes</span></h1>
              <p className="hero-subtitle">Économisez jusqu'à 2 000€ en honoraires. Notre IA génère un dossier professionnel avec textes de loi et jurisprudence.</p>
              <div className="hero-stats">
                <div><div className="hero-stat-value">{counters.savings}€</div><div className="hero-stat-label">Économie moyenne</div></div>
                <div><div className="hero-stat-value">{counters.time} min</div><div className="hero-stat-label">Temps moyen</div></div>
                <div><div className="hero-stat-value">{counters.satisfaction}%</div><div className="hero-stat-label">Satisfaction</div></div>
              </div>
              <div className="hero-buttons">
                <button className="btn btn-primary" onClick={() => scrollTo('pricing')}>Créer mon dossier →</button>
              </div>
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
                  <div className="comparison-price">29€ - 99€</div>
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
              <h2 className="section-title">Ils ont économisé</h2>
            </div>
            <div className="testimonials-grid">
              {TESTIMONIALS.map((t,i) => (
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

          <section className="section section-white" id="pricing">
            <div className="section-header">
              <span className="section-badge">💎 Tarifs</span>
              <h2 className="section-title">Choisissez votre formule</h2>
            </div>
            <div className="pricing-grid">
              {Object.entries(PRICING).map(([k,p]) => (
                <div key={k} className={`pricing-card ${p.popular?'popular':''}`}>
                  {p.popular && <div className="pricing-popular-badge">⭐ Populaire</div>}
                  <div className="pricing-header">
                    <h3 className="pricing-name">{p.name}</h3>
                    <p className="pricing-desc">{p.description}</p>
                    <div className="pricing-amount">{p.price}€</div>
                  </div>
                  <ul className="pricing-features">
                    <li>{p.dossiers} dossier{p.dossiers>1?'s':''}</li>
                    <li>Analyse IA</li>
                    <li>Jurisprudence</li>
                    <li>Chat assistant</li>
                  </ul>
                  <button className="pricing-cta" onClick={() => {setSelectedPlan(k);setCurrentView('payment');}}>
                    Choisir
                  </button>
                </div>
              ))}
            </div>
            <div style={{maxWidth:'500px',margin:'2rem auto 0',textAlign:'center',padding:'1.5rem',background:'rgba(5,150,105,0.05)',border:'2px solid rgba(5,150,105,0.2)',borderRadius:'12px'}}>
              <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>🛡️</div>
              <h4 style={{color:'#059669'}}>Satisfait ou remboursé 30 jours</h4>
            </div>
          </section>

          <footer className="footer">
            <div className="footer-inner">
              <h3>⚖️ MonDossierJuridique.fr</h3>
              <p>Votre aide juridique en ligne</p>
              <p style={{marginTop:'0.75rem',fontSize:'0.75rem'}}>Ce service ne remplace pas un avocat.</p>
            </div>
          </footer>
        </>
      )}

      {/* PAYMENT PAGE */}
      {currentView === 'payment' && (
        <div className="payment-page">
          <div className="payment-container">
            <div className="payment-card">
              <h2 className="payment-title">Finalisez votre commande</h2>
              <p className="payment-subtitle">Paiement sécurisé par Stripe</p>
              
              <div className="payment-plan">
                <div className="payment-plan-name">Formule {PRICING[selectedPlan]?.name}</div>
                <div className="payment-plan-price">{PRICING[selectedPlan]?.price}€</div>
              </div>
              
              {paymentError && <div className="payment-error">{paymentError}</div>}
              
              <div className="form-group">
                <label className="form-label">Votre email</label>
                <input type="email" className="form-input" placeholder="votre@email.com" value={userEmail} onChange={e=>setUserEmail(e.target.value)} />
              </div>
              
              <button className="payment-btn" onClick={handlePayment} disabled={paymentLoading}>
                {paymentLoading ? '⏳ Redirection...' : `🔒 Payer ${PRICING[selectedPlan]?.price}€`}
              </button>
              
              <div className="payment-secure">🔒 Paiement sécurisé Stripe</div>
              
              <button onClick={()=>setCurrentView('landing')} style={{marginTop:'1rem',background:'none',border:'none',color:'#718096',cursor:'pointer',width:'100%'}}>
                ← Retour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APP */}
      {currentView === 'app' && (
        <>
          <div className="app-container">
            <div className="app-header">
              <h1>⚖️ Créez votre dossier</h1>
            </div>
            
            {!selectedDomaine ? (
              <div className="domains-grid">
                {Object.entries(DOMAINES).map(([k,d]) => (
                  <div key={k} className="domain-card" onClick={()=>setSelectedDomaine(k)}>
                    <div className="domain-icon">{d.icone}</div>
                    <div className="domain-name">{d.nom}</div>
                  </div>
                ))}
              </div>
            ) : !selectedCategorie ? (
              <>
                <button className="back-btn" onClick={()=>setSelectedDomaine(null)}>← Retour</button>
                <h2 style={{marginBottom:'1rem'}}>{DOMAINES[selectedDomaine].icone} {DOMAINES[selectedDomaine].nom}</h2>
                <div className="categories-grid">
                  {(DOMAINES[selectedDomaine].categories.length > 0 ? DOMAINES[selectedDomaine].categories : [{id:'autre_general',nom:'⊕ Décrire mon litige',desc:'Expliquez votre situation',isAutre:true}]).map(c => (
                    <div key={c.id} className={`category-card ${c.isAutre?'autre':''}`} onClick={()=>setSelectedCategorie(c.id)}>
                      <div className="category-name">{c.nom}</div>
                      <div className="category-desc">{c.desc}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : !dossierGenere ? (
              <>
                <button className="back-btn" onClick={()=>setSelectedCategorie(null)}>← Retour</button>
                <div className="questionnaire">
                  <h2>📝 Questionnaire</h2>
                  {QUESTIONNAIRE_DEFAULT.map(q => (
                    <div key={q.id} className="form-group">
                      <label className="form-label">{q.label} {q.required && <span style={{color:'#dc2626'}}>*</span>}</label>
                      {q.type === 'textarea' ? (
                        <textarea className="form-textarea" placeholder={q.placeholder} value={formData[q.id]||''} onChange={e=>setFormData({...formData,[q.id]:e.target.value})} />
                      ) : q.type === 'select' ? (
                        <select className="form-select" value={formData[q.id]||''} onChange={e=>setFormData({...formData,[q.id]:e.target.value})}>
                          <option value="">Sélectionnez...</option>
                          {q.options.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type={q.type} className="form-input" placeholder={q.placeholder} value={formData[q.id]||''} onChange={e=>setFormData({...formData,[q.id]:e.target.value})} />
                      )}
                    </div>
                  ))}
                  <button className="submit-btn" onClick={generateDossier} disabled={loading}>
                    {loading ? '⏳ Génération... (2-3 min)' : '🚀 Générer mon dossier'}
                  </button>
                  {loading && <div className="loading-spinner"></div>}
                </div>
              </>
            ) : (
              <>
                <div className="dossier-container">
                  <div className="dossier-header">
                    <h2>✅ Dossier prêt !</h2>
                    <button className="download-btn" onClick={downloadDossier}>📥 Télécharger</button>
                  </div>
                  <div className="dossier-content">{dossierGenere}</div>
                </div>
                <button onClick={()=>{setSelectedDomaine(null);setSelectedCategorie(null);setDossierGenere(null);setFormData({});}} style={{marginTop:'1.5rem',padding:'0.9rem 1.5rem',background:'var(--gold)',color:'white',border:'none',borderRadius:'8px',cursor:'pointer'}}>
                  ➕ Nouveau dossier
                </button>
              </>
            )}

            {dossierGenere && (
              <>
                <button className="chat-button" onClick={()=>setShowChat(!showChat)}>{showChat?'✕':'💬'}</button>
                {showChat && (
                  <div className="chat-panel">
                    <div className="chat-header">
                      <span>🤖 Assistant</span>
                      <button onClick={()=>setShowChat(false)} style={{background:'none',border:'none',color:'white',cursor:'pointer'}}>✕</button>
                    </div>
                    <div className="chat-messages">
                      {chatMessages.map((m,i) => <div key={i} className={`chat-message ${m.role}`}>{m.content}</div>)}
                      {chatLoading && <div style={{textAlign:'center',color:'#718096'}}>⏳</div>}
                    </div>
                    <div className="chat-input-container">
                      <input className="chat-input" placeholder="Votre question..." value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyPress={e=>e.key==='Enter'&&sendChat()} />
                      <button className="chat-send" onClick={sendChat}>→</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <footer className="footer">
            <div className="footer-inner">
              <h3>⚖️ MonDossierJuridique.fr</h3>
              <p>Ce service ne remplace pas un avocat.</p>
            </div>
          </footer>
        </>
      )}
    </>
  );
}
