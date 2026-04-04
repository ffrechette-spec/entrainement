# WINDSURF_START.md — Instructions de démarrage

## Lis ceci en premier

Avant toute chose, lis ces fichiers dans cet ordre :
1. `agent.md`
2. `claude.md`
3. `brief_technique.md`
4. `plan_developpement.md`

---

## Contexte du projet

- **Application** : Gym Tracker PWA — suivi d'entraînement personnel 8 semaines
- **Stack** : Next.js 14 / TypeScript / Tailwind CSS / Firebase / Vercel
- **Repo GitHub** : https://github.com/ffrechette-spec/entrainement
- **Branche** : `main` (tout va sur main, pas de branches features)
- **Déploiement** : Vercel — chaque push sur `main` déclenche un déploiement automatique

## Infrastructure en place

- ✅ GitHub repo `ffrechette-spec/entrainement` connecté à Vercel
- ✅ Firebase DEV : `gym-tracker-dev-ee57e` (Firestore + Auth Google activés)
- ✅ Firebase PROD : `gym-tracker-prod` (Firestore + Auth Google activés)
- ✅ Variables d'environnement PROD configurées dans Vercel (6 variables NEXT_PUBLIC_FIREBASE_*)
- ✅ `.env.local` présent à la racine avec les clés Firebase DEV
- ✅ `.gitignore` en place — `.env.local` ne sera jamais commité
- ✅ `.env.example` commité comme référence
- ✅ Règles Firestore publiées (accès authentifié uniquement)

## Fichiers déjà présents dans le repo

- `agent.md` — tes règles de développement
- `claude.md` — contexte entraînement et règles métier
- `brief_technique.md` — architecture complète
- `plan_developpement.md` — plan séquentiel des 12 phases
- `.env.example` — template variables d'environnement
- `.gitignore` — fichiers à exclure de Git
- `SETUP.md` — documentation de la configuration initiale

## Ta mission

Exécute la **Phase 0** du `plan_developpement.md` en autonomie complète.

Règles de travail :
- Tout sur la branche `main`
- Push après chaque étape numérotée (0.1, 0.2, etc.)
- Message de commit clair : `chore:`, `feat:`, `fix:`, `test:`
- `npx tsc --noEmit` doit passer avant chaque push
- Ne pas modifier `.env.local` ni le commiter

Arrête-toi uniquement au point **🔴 VALIDATION REQUISE — Phase 0** et indique que tu es prêt pour validation.

## Configuration Firebase pour `lib/firebase.ts`

Utilise les variables d'environnement — ne jamais hardcoder les clés :

```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
```

## Commande de démarrage

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir
```

Note : le projet est initialisé dans le dossier courant (`.`) car le repo est déjà cloné.
