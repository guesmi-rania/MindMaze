# 🧩 MindMaze — Jeu de Puzzles Cognitifs Mobile

> Application mobile de jeux de réflexion développée avec **React Native (Expo)**, **Node.js** et **MongoDB**.

## 🎮 Fonctionnalités

- **4 modes de jeu** : Mémoire, Séquence, Calcul Rapide, Vitesse
- **Système de progression** : Niveaux, XP, streaks
- **Achievements** : 8 succès à débloquer
- **Leaderboard** : Classement mondial et hebdomadaire
- **Profil** : Stats détaillées par mode de jeu
- **Authentification** JWT complète
- **Retour haptique** sur les actions

## 🛠 Stack Technique

| Couche     | Technologie                      |
|------------|----------------------------------|
| Mobile     | React Native + Expo              |
| Navigation | React Navigation v6              |
| State      | Zustand                          |
| Backend    | Node.js + Express                |
| Base de données | MongoDB Atlas + Mongoose    |
| Auth       | JWT + bcryptjs                   |

## 🚀 Installation

### Prérequis
- Node.js 18+
- Expo CLI : `npm install -g expo-cli`
- Compte MongoDB Atlas (gratuit)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Remplis MONGODB_URI et JWT_SECRET dans .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# Dans src/services/api.js, remplace YOUR_BACKEND_URL par l'IP de ton PC
# Ex: http://192.168.1.x:5000/api
npx expo start
```

Scanne le QR code avec **Expo Go** sur ton téléphone.

## 📁 Structure du projet

```
mindmaze/
├── backend/
│   ├── models/
│   │   ├── User.js          # Modèle utilisateur + stats + achievements
│   │   └── GameSession.js   # Sessions de jeu
│   ├── routes/
│   │   ├── auth.js          # Register, Login, Me
│   │   ├── game.js          # Save session, History, Stats
│   │   └── leaderboard.js   # Global, Weekly
│   ├── middleware/
│   │   └── auth.js          # JWT middleware
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── screens/
    │   │   ├── LoginScreen.js      # Auth (Login + Register + Avatar)
    │   │   ├── HomeScreen.js       # Accueil + sélection de mode
    │   │   ├── GameScreen.js       # Les 4 modes de jeu
    │   │   ├── LeaderboardScreen.js
    │   │   └── ProfileScreen.js    # Stats + Achievements
    │   ├── services/api.js         # Axios + interceptors JWT
    │   ├── store/authStore.js      # Zustand store
    │   └── utils/theme.js          # Couleurs, fonts, constantes
    └── App.js                      # Navigation (Stack + Bottom Tabs)
```

## 🎯 API Endpoints

| Method | Route                        | Description              |
|--------|------------------------------|--------------------------|
| POST   | /api/auth/register           | Inscription              |
| POST   | /api/auth/login              | Connexion                |
| GET    | /api/auth/me                 | Profil utilisateur       |
| POST   | /api/game/session            | Sauvegarder une partie   |
| GET    | /api/game/history            | Historique des parties   |
| GET    | /api/game/stats              | Stats + par mode         |
| GET    | /api/leaderboard/global      | Classement mondial       |
| GET    | /api/leaderboard/weekly      | Classement hebdomadaire  |

## 🏆 Système d'Achievements

| Succès        | Condition                    |
|---------------|------------------------------|
| Premier pas   | Jouer sa 1ère partie         |
| Centurion     | Score ≥ 100                  |
| Expert        | Score ≥ 500                  |
| Maître        | Score ≥ 1000                 |
| En feu        | Streak ≥ 5                   |
| Inarrêtable   | Streak ≥ 10                  |
| Accro         | 10 parties jouées            |
| Vétéran       | 50 parties jouées            |

## 📱 Déploiement

- **Backend** : Railway, Render, ou Heroku
- **Mobile** : Expo EAS Build → Google Play / App Store