# PLAN — Phase 0 : Fondations et configuration

## Contexte
Lis ces fichiers avant de commencer : `agent.md`, `claude.md`, `brief_technique.md`
Repo : `ffrechette-spec/entrainement` | Branche : `main` | Déploiement : Vercel (auto sur push)
`.env.local` est déjà présent avec les clés Firebase DEV. Ne pas le modifier, ne pas le commiter.

## Tâches

- [ ] **0.1** Initialiser Next.js 14 dans le dossier courant
  ```bash
  npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir
  ```
  Push : `chore: init Next.js 14 with TypeScript and Tailwind`

- [ ] **0.2** Installer les dépendances du projet
  ```bash
  npm install firebase next-pwa zustand react-hook-form
  npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom ts-jest
  ```
  Push : `chore: install project dependencies`

- [ ] **0.3** Créer la structure complète des dossiers (vides ou placeholders)
  Créer : `components/ui/`, `hooks/`, `lib/`, `types/`, `__tests__/`, `public/icons/`
  Push : `chore: scaffold project folder structure`

- [ ] **0.4** Configurer Firebase dans `lib/firebase.ts`
  Utiliser uniquement les variables d'environnement `process.env.NEXT_PUBLIC_FIREBASE_*`
  Créer `lib/firestore.ts` avec les fonctions CRUD vides typées
  Push : `chore: configure Firebase with environment variables`

- [ ] **0.5** Configurer Jest
  Créer `jest.config.ts` et `jest.setup.ts`
  Ajouter scripts `test`, `test:watch`, `test:ci` dans `package.json`
  Push : `test: configure Jest with Testing Library`

- [ ] **0.6** Configurer la PWA
  Créer `public/manifest.json` (nom: Gym Tracker, couleurs: #1a1a2e / #0f3460)
  Configurer `next.config.js` avec next-pwa
  Créer icônes placeholder 192×192 et 512×512 dans `public/icons/`
  Push : `chore: configure PWA manifest and next-pwa`

- [ ] **0.7** Créer les fichiers de documentation
  Créer `SETUP.md` avec les étapes de configuration Firebase (pour référence future)
  Créer `.env.example` si absent
  Push : `docs: setup documentation and env example`

## Critères de complétion
- `npm run dev` démarre sans erreur sur localhost:3000
- `npx tsc --noEmit` passe sans erreur
- `npm test` s'exécute (0 tests = ok)
- Vercel déclenche un déploiement automatique après le dernier push

## 🔴 STOP — Validation requise
Quand toutes les tâches sont complétées, affiche :
- Le résultat de `npx tsc --noEmit`
- Le résultat de `npm test`
- L'URL du déploiement Vercel
Attends la confirmation de l'utilisateur avant de passer à la Phase 1.
