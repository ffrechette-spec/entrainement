# Gym Tracker

Application PWA de suivi d'entraînement personnel — programme 8 semaines, 5 jours / semaine.

Style **80s Tracksuit** : couleurs rétro par groupe musculaire, icônes pixel art 16-bit, police Orbitron sur les titres.

## Fonctionnalités

- Suivi des séances par jour (lundi → vendredi)
- Pré-remplissage automatique des poids depuis la dernière séance
- Indicateur de progression (↑ / ↓ / =) par exercice
- Sauvegarde automatique en temps réel (Firestore)
- Historique des séances avec graphique de progression
- Export JSON structuré pour analyse par Claude
- PWA installable (offline-first, service worker manuel)
- Authentification Firebase

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 16.2 (Turbopack, App Router) |
| UI | React 19, Tailwind CSS v4 |
| Base de données | Firebase Firestore |
| Auth | Firebase Authentication |
| Graphiques | Recharts |
| Polices | Geist (corps), Orbitron (titres) |
| Tests | Jest 29, @testing-library/react |
| PWA | Service Worker manuel (sans next-pwa) |
| Déploiement | Vercel / Netlify |

## Installation locale

### Prérequis

- Node.js 20+
- Un projet Firebase (Firestore + Authentication activés)

### Variables d'environnement

Crée un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Démarrage

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

### Tests

```bash
npm test                    # 115 tests
npm test -- --coverage      # rapport de couverture
```

### Build production

```bash
npm run build
```

## Structure du projet

```
app/                  # Pages Next.js (App Router)
  page.tsx            # Accueil — liste des jours
  seance/[jour]/      # Page de séance
  historique/         # Historique + graphique
  export/             # Export JSON
components/           # Composants React
  PixelIcon.tsx       # Icônes SVG pixel art 16-bit
  SerieInput.tsx      # Saisie poids/reps avec animations
  ExerciceCard.tsx    # Carte exercice avec navigation
  ProgressionBadge.tsx
  ProgressionChart.tsx
hooks/                # Hooks React
  useSeance.ts        # Gestion séance (CRUD Firestore)
  useHistorique.ts    # Historique + progression
lib/                  # Utilitaires
  firestore.ts        # Fonctions Firestore
  couleurs.ts         # Système couleurs rétro par groupe musculaire
  export.ts           # Génération export JSON
  utils.ts            # Calcul semaine, formatage dates
public/
  manifest.json       # PWA manifest
  sw.js               # Service Worker (cache-first)
  icons/              # Icônes PWA (192, 512, apple-touch)
```

## Lien production

[project-r25x0.vercel.app](https://project-r25x0.vercel.app)
