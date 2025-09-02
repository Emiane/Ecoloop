# 🐔 Ecoloop - Plateforme d'Élevage Intelligent

Une plateforme web complète pour optimiser l'élevage de volaille au Cameroun avec formation, suivi personnalisé et surveillance automatisée.

## 🎯 Fonctionnalités

### 🆓 **Module Training (Gratuit)**
- Formation complète sur l'élevage de volaille
- Guides détaillés sur les maladies et traitements
- Calendrier de vaccination interactif
- Quiz d'évaluation avec certification
- Assistant chatbot IA
- Informations sur les équipements et prix

### 💼 **Module Tracking (PRO - 5000 FCFA/mois)**
- Analyse personnalisée des ressources
- Plans de production optimisés
- Suivi quotidien multi-lots
- Notifications intelligentes
- Statistiques avancées
- Gestion des phases d'élevage

### 👑 **Module Monitoring (PREMIUM - 10000 FCFA/mois)**
- Surveillance temps réel (interfaces seulement)
- Capteurs simulés (température, humidité)
- Alertes personnalisables
- Contrôle à distance simulé
- Historique des données
- Tableaux de bord avancés

### 💬 **Module Forum (Gratuit)**
- Discussions communautaires
- Catégories par région
- Système de votes
- Experts certifiés
- Support multilingue

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** + **Vite** - Interface utilisateur moderne
- **Tailwind CSS** - Styling responsive
- **React Router** - Navigation
- **Lucide React** - Icônes
- **Recharts** - Graphiques
- **Axios** - Communication API

### Backend
- **Express.js** - Serveur API REST
- **SQLite** - Base de données légère
- **JWT** - Authentification sécurisée
- **bcryptjs** - Hachage des mots de passe
- **Helmet** - Sécurité HTTP
- **Express Rate Limit** - Protection contre les abus

### Fonctionnalités Spéciales
- **Système bilingue** (Français/Anglais)
- **Mode sombre/clair**
- **Design responsive** mobile-first
- **Palette de couleurs camerounaise**
- **Données contextualisées** pour le Cameroun

## 🚀 Installation et Démarrage Rapide

### Prérequis
- **Node.js** v16 ou supérieur
- **npm** (inclus avec Node.js)

### Option 1: Démarrage Automatique (Recommandé)
```bash
# Double-cliquez sur le fichier
start-ecoloop.bat
```

### Option 2: Démarrage Manuel

#### 1. Démarrer le Backend
```bash
# Terminal 1
cd backend
npm install
npm run init-db
npm run dev
```

#### 2. Démarrer le Frontend
```bash
# Terminal 2 (nouveau terminal)
cd frontend
npm install
npm run dev
```

### 🌐 Accès à l'Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 👤 Comptes de Démonstration

### Utilisateur Standard
- **Email**: `user@demo.com`
- **Mot de passe**: `demo123`
- **Accès**: Formation + Forum

### Administrateur
- **Email**: `admin@demo.com`
- **Mot de passe**: `admin123`
- **Accès**: Toutes les fonctionnalités + Panel Admin

## 📁 Structure du Projet

```
pro/
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/         # Pages principales
│   │   ├── contexts/      # Contextes React (Auth, Theme, Language)
│   │   ├── services/      # Services API
│   │   └── utils/         # Utilitaires
│   ├── public/            # Fichiers statiques
│   └── package.json
│
├── backend/               # Serveur Express.js
│   ├── routes/           # Routes API
│   ├── middleware/       # Middlewares
│   ├── database/         # Configuration SQLite
│   ├── controllers/      # Logique métier
│   ├── models/          # Modèles de données
│   └── services/        # Services externes
│
├── start-ecoloop.bat    # Démarrage complet
├── start-backend.bat    # Démarrage backend seul
├── start-frontend.bat   # Démarrage frontend seul
└── README.md           # Ce fichier
```

## 🎨 Palette de Couleurs

- **Light Blue**: #A8D5E2 - Accents et notifications
- **Orange Web**: #F9A620 - Actions principales
- **Mustard**: #FFD449 - Alertes et warnings
- **Forest Green**: #548C2F - Succès et nature
- **Pakistan Green**: #104911 - Navigation et headers
- **Soft Beige**: #F2EFE5 - Arrière-plans

## 📊 Fonctionnalités par Module

### Training Module
- ✅ Système de catégories complet
- ✅ Contenu détaillé des maladies
- ✅ Symptômes et traitements
- ✅ Calendrier de vaccination
- ✅ Quiz interactifs
- ✅ Chatbot IA intégré
- ✅ Informations équipements
- ✅ Prix contextualisés Cameroun

### Tracking Module
- ✅ Analyse des ressources
- ✅ Génération de plans personnalisés
- ✅ Suivi multi-lots
- ✅ Progression quotidienne
- ✅ Statistiques visuelles
- ✅ Notifications intelligentes
- ✅ Phases d'élevage détaillées

### Monitoring Module
- ✅ Interface de surveillance
- ✅ Simulation de capteurs
- ✅ Alertes configurables
- ✅ Historique des données
- ✅ Contrôles manuels
- ⏳ Intégration capteurs réels (à venir)

### Forum Module
- ✅ Catégories par sujet
- ✅ Système de votes
- ✅ Commentaires imbriqués
- ✅ Modération
- ✅ Profils utilisateurs
- ✅ Recherche avancée

## 🔐 Sécurité

- **JWT** pour l'authentification
- **bcryptjs** pour le hachage des mots de passe
- **Helmet** pour la sécurité HTTP
- **Rate limiting** contre les abus
- **Validation** des données entrantes
- **Sanitisation** des entrées utilisateur

## 🌍 Internationalisation

- **Français** (défaut)
- **Anglais**
- Contexte camerounais
- Villes principales du Cameroun
- Prix en FCFA
- Réglementations locales

## 📱 Responsive Design

- **Mobile-first** approach
- **Tailwind CSS** pour la responsivité
- **Touch-friendly** interface
- **Progressive Web App** ready

## 🔄 État du Développement

### ✅ Complétées
- Architecture complète Frontend/Backend
- Système d'authentification sécurisé
- Interface utilisateur moderne
- Base de données structurée
- Module Training complet
- Module Forum fonctionnel
- Système de permissions par abonnement
- Internationalisation FR/EN

### 🚧 En Cours
- Interface Module Tracking (PRO)
- Interface Module Monitoring (PREMIUM)
- Intégration Chatbot IA
- Panel d'administration
- Système de paiement

### ⏳ Prévues
- Capteurs IoT réels
- Application mobile
- Notifications push
- Export PDF des rapports
- Intégration météo
- Support Fulfulde

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📧 Support

- **Email**: support@ecoloop.cm
- **Forum**: https://ecoloop.cm/forum
- **Documentation**: https://docs.ecoloop.cm

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🎯 Roadmap 2025

- **Q1**: Finalisation modules Tracking/Monitoring
- **Q2**: Intégration capteurs IoT
- **Q3**: Application mobile native
- **Q4**: Expansion régionale Afrique Centrale

---

**Développé avec ❤️ pour la communauté des éleveurs camerounais**

*Ecoloop - Transformons l'élevage avec la technologie*
