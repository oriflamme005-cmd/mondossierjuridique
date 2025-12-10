# ⚖️ MonDossierJuridique.fr

> Aide juridique en ligne - Constituez votre dossier juridique complet avec l'IA

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-Private-red)
![Domain](https://img.shields.io/badge/domain-mondossierjuridique.fr-green)

## 🌐 Site web

**URL de production** : https://mondossierjuridique.fr

## 🚀 Déploiement rapide sur Vercel

### Étape 1 : Fork ou Upload ce repository sur GitHub

### Étape 2 : Connecter à Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez "Add New Project"
3. Importez votre repository GitHub
4. Cliquez "Deploy"

### Étape 3 : Configurer la clé API
1. Dans Vercel : Settings → Environment Variables
2. Ajoutez `ANTHROPIC_API_KEY` = votre clé API
3. Redéployez

### Étape 4 : Ajouter votre domaine
1. Settings → Domains
2. Ajoutez `mondossierjuridique.fr`
3. Configurez les DNS chez votre registrar (OVH)

## 📁 Structure du projet

```
juridossier-deploy/
├── api/
│   └── chat.js          # API serverless (sécurise la clé Anthropic)
├── public/
│   └── index.html       # Page HTML de base
├── src/
│   ├── App.jsx          # Application React principale
│   └── index.js         # Point d'entrée React
├── package.json         # Dépendances
├── vercel.json          # Configuration Vercel
└── .env.example         # Exemple de variables d'environnement
```

## ✨ Fonctionnalités

- ✅ 14 domaines juridiques français
- ✅ 70+ catégories de litiges
- ✅ Option "Autre litige" personnalisé
- ✅ Questionnaires exhaustifs
- ✅ Checklist de documents
- ✅ Chronologie des faits
- ✅ Analyse IA avec recherche web
- ✅ Dossier téléchargeable (.txt)
- ✅ Assistant chat intégré

## 💰 Coûts estimés

| Service | Coût |
|---------|------|
| Vercel | Gratuit (100GB/mois) |
| Domaine .fr | ~8€/an |
| API Anthropic | ~0.003€/requête |

## ⚠️ Mentions légales

Ce service constitue un outil d'aide à la constitution de dossiers juridiques.
Il ne remplace pas le conseil d'un avocat inscrit au barreau.

## 📞 Support

Pour toute question technique, consultez la documentation Vercel.
