# PLAN — Phase 2 : Données statiques du programme

## Contexte
Phase 1 validée. Poursuis sur `main`, push après chaque tâche.

## Tâches

- [ ] **2.1** Créer `types/index.ts`
  Définir tous les types : `Exercice`, `Seance`, `ExerciceSeance`, `Serie`, `JourSemaine`
  Push : `feat: complete TypeScript type definitions`

- [ ] **2.2** Créer `lib/programme.ts`
  Les 24 exercices complets (5 jours × ~5 exercices)
  Chaque exercice : id kebab-case, nom, jour, seriesCibles, repsCibles, seriesCount, repos, technique, youtubeUrl, groupeMusculaire
  Référence : fichier `claude.md` pour la liste complète
  Push : `feat: complete 8-week programme static data`

- [ ] **2.3** Créer `lib/utils.ts`
  - `getExercicesParJour(jour)` → `Exercice[]`
  - `getSemaineActuelle(dateDebut)` → `number`
  - `formatDate(date)` → `string`
  - `getJourActuel()` → `JourSemaine | null`
  Push : `feat: programme utility functions`

- [ ] **2.4** Créer `__tests__/utils.test.ts`
  Tester `getSemaineActuelle` avec dates simulées
  Tester `getExercicesParJour` pour chaque jour
  Tester `getJourActuel`
  Push : `test: utility functions unit tests`

## Critères de complétion
- `npm test` passe sans erreur
- `npx tsc --noEmit` propre
- Pas de validation utilisateur requise — passer directement à la Phase 3

---

# PLAN — Phase 3 : Authentification

## Tâches

- [ ] **3.1** Créer `lib/auth.ts`
  Fonctions : `signInWithGoogle()`, `signOut()`, `getCurrentUser()`
  Push : `feat: Firebase Auth configuration`

- [ ] **3.2** Créer `hooks/useAuth.ts`
  État utilisateur courant, état de chargement, persistance de session
  Push : `feat: useAuth hook with session persistence`

- [ ] **3.3** Compléter `app/auth/page.tsx`
  Bouton "Se connecter avec Google"
  Redirection vers `/` après connexion réussie
  Style centré, mobile-friendly
  Push : `feat: Google sign-in page`

- [ ] **3.4** Créer middleware Next.js `middleware.ts`
  Redirection vers `/auth` si non connecté
  Redirection vers `/` si déjà connecté et visite `/auth`
  Push : `feat: route protection middleware`

- [ ] **3.5** Modal premier accès
  Si `meta/config.dateDebut` est null : afficher modal "Date de début du programme ?"
  Sauvegarder dans Firestore `meta/config`
  Push : `feat: first-run programme start date setup`

## Critères de complétion
- Connexion Google fonctionne sur localhost
- Session persistante après refresh
- Redirection correcte selon l'état d'authentification

## 🔴 STOP — Validation requise
Affiche confirmation que :
1. La connexion Google fonctionne
2. La session persiste après refresh du navigateur
3. La date de début se sauvegarde dans Firestore
Attends confirmation avant Phase 4.
