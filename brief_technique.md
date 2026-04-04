# Brief technique — Application Gym Tracker PWA

## Vue d'ensemble

Application web progressive (PWA) de suivi d'entraînement sur 8 semaines.
Déployée sur Vercel, données stockées dans Firebase Firestore.
Interface 100% mobile-first, installable sur Android via "Ajouter à l'écran d'accueil".
Utilisateur unique, authentification Google via Firebase Auth.
Langue : français uniquement.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 14 (App Router) |
| Langage | TypeScript |
| Style | Tailwind CSS |
| Base de données | Firebase Firestore |
| Authentification | Firebase Auth (Google) |
| Déploiement | Vercel |
| PWA | next-pwa |
| Gestion d'état | Zustand (léger, suffisant) |
| Formulaires | React Hook Form |

---

## Structure du projet

```
gym-tracker/
├── app/
│   ├── layout.tsx              # Layout global + PWA meta
│   ├── page.tsx                # Page d'accueil — sélection du jour
│   ├── auth/
│   │   └── page.tsx            # Page de connexion Google
│   ├── seance/
│   │   └── [jour]/
│   │       └── page.tsx        # Fiche séance du jour
│   ├── historique/
│   │   └── page.tsx            # Historique des séances
│   └── export/
│       └── page.tsx            # Export JSON pour analyse Claude
├── components/
│   ├── ui/                     # Composants de base (boutons, inputs, cards)
│   ├── ExerciceCard.tsx        # Carte d'un exercice avec séries
│   ├── SerieInput.tsx          # Saisie kg + reps pour une série
│   ├── ProgressionBadge.tsx    # Indicateur ↑ ↓ = vs séance précédente
│   └── NavBar.tsx              # Navigation mobile bas d'écran
├── lib/
│   ├── firebase.ts             # Config Firebase
│   ├── firestore.ts            # Fonctions CRUD séances
│   ├── programme.ts            # Données statiques du programme 8 semaines
│   └── export.ts               # Génération du fichier JSON d'export
├── hooks/
│   ├── useSeance.ts            # Hook chargement/sauvegarde séance
│   └── useHistorique.ts        # Hook historique par exercice
├── types/
│   └── index.ts                # Types TypeScript globaux
├── public/
│   ├── manifest.json           # PWA manifest
│   └── icons/                  # Icônes app (192x192, 512x512)
└── next.config.js              # Config Next.js + PWA
```

---

## Schéma de données Firestore

### Collection : `seances`

```typescript
// Document ID : généré automatiquement
interface Seance {
  id: string;
  jour: "lundi" | "mardi" | "mercredi" | "jeudi" | "vendredi";
  date: Timestamp;                  // Date automatique à l'ouverture
  semaine: number;                  // 1 à 8
  qualite: number | null;           // 1 à 10, saisie fin de séance
  energieAvant: number | null;      // 1 à 10
  energieApres: number | null;      // 1 à 10
  sommeil: number | null;           // heures
  poidsCorps: number | null;        // kg
  cardioFait: boolean;
  cardioDuree: number | null;       // minutes
  notes: string;
  exercices: ExerciceSeance[];
  completee: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface ExerciceSeance {
  exerciceId: string;               // ex: "developpe-couche"
  nom: string;
  series: Serie[];
  notes: string;
}

interface Serie {
  numero: number;                   // 1, 2, 3, 4
  poids: number | null;             // kg
  reps: number | null;
  completee: boolean;
}
```

### Données statiques : `lib/programme.ts`

```typescript
interface Exercice {
  id: string;
  nom: string;
  jour: string;
  seriesCibles: string;             // ex: "4 × 6–10"
  repsCibles: string;               // ex: "6–10"
  seriesCount: number;              // 4
  repos: string;                    // "60–90 s"
  technique: string;                // Description courte
  youtubeUrl: string;
  groupeMusculaire: string;
}
```

---

## Fonctionnalités — priorité 1 (MVP)

### 1. Authentification
- Connexion unique via Google
- Redirection automatique si non connecté
- Session persistante (Firebase)

### 2. Page d'accueil
- Affiche les 5 jours de la semaine
- Indicateur visuel : séance du jour complétée ou non
- Accès rapide à la séance du jour courant
- Semaine en cours calculée automatiquement depuis la date de début

### 3. Fiche séance
- Date automatique à l'ouverture (non modifiable)
- Un exercice affiché à la fois (focus mobile)
- Pour chaque série : champ poids + champ reps
- **Poids pré-rempli** avec le dernier poids utilisé pour cet exercice
- Indicateur de progression vs séance précédente (↑ ↓ =)
- Bouton "Série suivante" / "Exercice suivant"
- Champ notes libre par exercice et global
- Sauvegarde automatique à chaque saisie (Firestore)
- Résumé en fin de séance avec saisie qualité / énergie / sommeil / poids

### 4. Historique
- Liste des séances passées par jour
- Graphique simple de progression par exercice (poids max par séance)
- Filtre par exercice

### 5. Export JSON
- Bouton "Exporter pour Claude"
- Génère un fichier `entrainement_export_AAAA-MM-JJ.json`
- Contient toutes les séances avec exercices, poids, reps, notes, qualité
- Format structuré et lisible par Claude pour analyse

---

## Fonctionnalités — priorité 2 (post-MVP)

- Graphiques de progression visuels (recharts ou chart.js)
- Notification push rappel séance
- Mode sombre
- Personnalisation du programme (remplacement d'exercices)
- Comparaison semaine vs semaine

---

## Format export JSON pour Claude

```json
{
  "export_date": "2026-04-10",
  "programme": "8 semaines — Définition musculaire",
  "semaine_actuelle": 2,
  "seances": [
    {
      "jour": "lundi",
      "date": "2026-04-07",
      "semaine": 2,
      "qualite": 8,
      "energie_avant": 7,
      "energie_apres": 6,
      "sommeil_h": 7.5,
      "poids_corps_kg": 82,
      "cardio_fait": false,
      "notes_globales": "Bonne séance, épaules un peu raides",
      "exercices": [
        {
          "nom": "Développé couché",
          "series": [
            { "serie": 1, "poids_kg": 60, "reps": 10 },
            { "serie": 2, "poids_kg": 60, "reps": 9 },
            { "serie": 3, "poids_kg": 57.5, "reps": 10 },
            { "serie": 4, "poids_kg": 57.5, "reps": 8 }
          ],
          "notes": ""
        }
      ]
    }
  ]
}
```

---

## PWA — configuration minimale

### `public/manifest.json`
```json
{
  "name": "Gym Tracker",
  "short_name": "Gym",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a2e",
  "theme_color": "#0f3460",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## UI / UX — principes directeurs

- **Mobile-first absolu** : tout pensé pour le pouce, grande zone de tap
- **Minimaliste** : une action principale visible à la fois
- **Palette** : reprendre les couleurs du programme imprimé (`#1a1a2e`, `#0f3460`, `#f0f4f8`)
- **Navigation** : barre fixe en bas sur mobile (accueil, historique, export)
- **Feedback immédiat** : confirmation visuelle après chaque saisie sauvegardée
- **Zéro friction** : ouvrir l'app → séance du jour → premier exercice en 2 taps

---

## Ordre de développement recommandé

1. Init projet Next.js + Tailwind + Firebase
2. PWA manifest + icônes
3. Auth Google
4. Données statiques du programme (`programme.ts`)
5. Page d'accueil (sélection du jour)
6. Fiche séance — affichage exercices
7. Saisie séries avec pré-remplissage poids
8. Sauvegarde Firestore en temps réel
9. Notes par exercice + notes globales
10. Résumé fin de séance
11. Historique simple
12. Export JSON
13. Tests mobile (PWA installée)
14. Déploiement Vercel production
