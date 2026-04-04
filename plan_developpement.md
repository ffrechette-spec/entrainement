# Plan de développement — Gym Tracker PWA
# Document de référence Windsurf

---

## Instructions générales pour Windsurf

Tu travailles de façon **entièrement autonome** sur ce projet.
- Tout le code va directement sur la branche `main`
- Tu fais un `git push` après chaque étape complétée dans ta phase courante
- Tu n'attends pas de validation entre les étapes d'une même phase
- Tu attends une **validation explicite de l'utilisateur** uniquement aux points marqués `🔴 VALIDATION REQUISE`
- Avant chaque push : `npx tsc --noEmit` doit passer sans erreur
- Chaque push doit avoir un message clair : `feat: [description]`, `fix: [description]`, `test: [description]`, `chore: [description]`
- En cas d'erreur bloquante : documenter dans `ISSUES.md` à la racine et continuer avec la phase suivante si possible
- Lire `agent.md`, `claude.md` et `brief_technique.md` avant de commencer

---

## Vue d'ensemble des phases

| Phase | Nom | Type | Validation |
|---|---|---|---|
| 0 | Fondations et configuration | Infrastructure | 🔴 |
| 1 | Structure et navigation | UI squelette | 🔴 |
| 2 | Données statiques et programme | Données | Auto |
| 3 | Authentification | Sécurité | 🔴 |
| 4 | Fiche séance — affichage | UI critique | Auto |
| 5 | Fiche séance — saisie et sauvegarde | Fonctionnel critique | 🔴 |
| 6 | Pré-remplissage et progression | Logique métier | 🔴 |
| 7 | Notes et fin de séance | Fonctionnel | Auto |
| 8 | Historique | Consultation | Auto |
| 9 | Export JSON | Intégration Claude | 🔴 |
| 10 | Tests Jest | Qualité | 🔴 |
| 11 | PWA et installation Android | Mobile | 🔴 |
| 12 | Polish et déploiement production | Finalisation | 🔴 |

---

## PHASE 0 — Fondations et configuration

**Objectif** : Projet fonctionnel localement, connecté à Firebase et Vercel.

### Étapes autonomes

**0.1 — Init projet**
```bash
npx create-next-app@latest gym-tracker \
  --typescript --tailwind --eslint --app --src-dir=false
cd gym-tracker
```
Push : `chore: init Next.js 14 project with TypeScript and Tailwind`

**0.2 — Dépendances**
```bash
npm install firebase next-pwa zustand react-hook-form
npm install -D jest @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event jest-environment-jsdom ts-jest
```
Push : `chore: install project dependencies`

**0.3 — Structure des dossiers**
Créer l'arborescence complète décrite dans `brief_technique.md`.
Tous les fichiers créés sont vides ou avec export placeholder.
Push : `chore: scaffold project folder structure`

**0.4 — Configuration Firebase**
- Créer `lib/firebase.ts` avec config depuis variables d'environnement
- Créer `.env.local` (non commité) avec les clés Firebase dev
- Créer `.env.example` (commité) avec les noms de variables vides
- Créer `lib/firestore.ts` avec fonctions CRUD vides typées
Push : `chore: configure Firebase and environment variables`

**0.5 — Configuration Jest**
- Créer `jest.config.ts`
- Créer `jest.setup.ts`
- Ajouter scripts dans `package.json` : `test`, `test:watch`, `test:ci`
Push : `test: configure Jest with Testing Library`

**0.6 — Configuration PWA de base**
- Créer `public/manifest.json`
- Configurer `next.config.js` avec next-pwa
- Ajouter icônes placeholder 192×192 et 512×512
Push : `chore: configure PWA manifest and next-pwa`

**0.7 — Configuration Vercel**
- Créer `vercel.json` si nécessaire
- Ajouter les variables d'environnement Firebase dans le dashboard Vercel (documenter les étapes dans `SETUP.md`)
- Premier déploiement : `vercel --prod`
Push : `chore: vercel configuration and initial deployment`

**0.8 — Configuration Firestore**
Créer dans Firestore (console Firebase) :
- Collection `seances` (vide)
- Document `meta/config` avec champs :
  ```json
  { "dateDebut": null, "programmeActif": "8-semaines" }
  ```
- Règles Firestore : accès uniquement à l'utilisateur authentifié

Push : `chore: firestore structure and security rules`

### Critères avant validation
- [ ] `npm run dev` démarre sans erreur
- [ ] `npx tsc --noEmit` passe sans erreur
- [ ] `npm test` passe (0 tests = ok à ce stade)
- [ ] URL Vercel accessible et affiche la page Next.js par défaut
- [ ] Firebase connecté (vérifiable dans les logs)

### 🔴 VALIDATION REQUISE — Phase 0
**L'utilisateur vérifie :**
1. Le projet tourne localement sur `localhost:3000`
2. L'URL Vercel de preview est accessible
3. Aucune erreur TypeScript

**Message attendu de l'utilisateur pour continuer :** `Phase 0 validée` ou feedback correctif.

---

## PHASE 1 — Structure et navigation

**Objectif** : Toutes les pages existent, la navigation fonctionne, le layout mobile est en place.

### Étapes autonomes

**1.1 — Layout global**
- `app/layout.tsx` : métadonnées PWA, police, couleurs globales Tailwind
- Palette dans `tailwind.config.ts` :
  ```js
  dark: '#1a1a2e', accent: '#0f3460', light: '#f0f4f8'
  ```
Push : `feat: global layout with PWA metadata and color palette`

**1.2 — Composants UI de base**
Créer dans `components/ui/` :
- `Button.tsx` (variantes : primary, secondary, ghost, danger)
- `Card.tsx`
- `Input.tsx` (champ numérique optimisé mobile)
- `Badge.tsx` (variantes : success, warning, neutral)
- `Spinner.tsx`
- `BottomNav.tsx` (navigation fixe bas d'écran mobile)

Push : `feat: base UI component library`

**1.3 — Pages squelettes**
Créer avec contenu placeholder :
- `app/page.tsx` — Accueil (sélection du jour)
- `app/auth/page.tsx` — Connexion
- `app/seance/[jour]/page.tsx` — Fiche séance
- `app/historique/page.tsx` — Historique
- `app/export/page.tsx` — Export JSON

Push : `feat: skeleton pages with routing`

**1.4 — Navigation**
- `BottomNav` intégré dans le layout (icônes : 🏠 Accueil · 📋 Historique · 📤 Export)
- Navigation fonctionnelle entre toutes les pages
- Route active mise en évidence

Push : `feat: bottom navigation with active state`

**1.5 — Page 404 et loading**
- `app/not-found.tsx`
- `app/loading.tsx`

Push : `feat: 404 and loading states`

### Critères de passage automatique
- Navigation entre toutes les pages sans erreur
- `npx tsc --noEmit` propre
- Rendu correct à 390px (iPhone 14) dans DevTools

### 🔴 VALIDATION REQUISE — Phase 1
**L'utilisateur vérifie sur mobile (URL Vercel) :**
1. Navigation fluide entre les 3 onglets
2. Layout correct sur son téléphone Android
3. Couleurs conformes au programme imprimé

---

## PHASE 2 — Données statiques du programme

**Objectif** : Tout le programme 8 semaines est codé en TypeScript, typé, et accessible partout.

### Étapes autonomes

**2.1 — Types TypeScript**
Créer `types/index.ts` avec tous les types du brief :
`Exercice`, `Seance`, `ExerciceSeance`, `Serie`, `JourSemaine`

Push : `feat: complete TypeScript type definitions`

**2.2 — Données du programme**
Créer `lib/programme.ts` avec les 24 exercices complets :
- IDs en kebab-case
- YouTube URLs
- Techniques, groupes musculaires, repos, plages de reps
- Organisés par jour

Push : `feat: complete 8-week programme static data`

**2.3 — Fonctions utilitaires**
Créer `lib/utils.ts` :
- `getExercicesParJour(jour: JourSemaine): Exercice[]`
- `getSemaineActuelle(dateDebut: Date): number`
- `formatDate(date: Date): string`
- `getJourActuel(): JourSemaine | null`

Push : `feat: programme utility functions`

**2.4 — Tests des utilitaires**
Créer `__tests__/utils.test.ts` :
- Test `getSemaineActuelle` avec dates simulées
- Test `getExercicesParJour` pour chaque jour
- Test `getJourActuel`

Push : `test: utility functions unit tests`

---

## PHASE 3 — Authentification

**Objectif** : Connexion Google fonctionnelle, sessions persistantes, protection des routes.

### Étapes autonomes

**3.1 — Firebase Auth setup**
- `lib/auth.ts` : fonctions `signInWithGoogle()`, `signOut()`, `getCurrentUser()`
- Provider Auth configuré dans Firebase Console

Push : `feat: Firebase Auth configuration`

**3.2 — Hook useAuth**
Créer `hooks/useAuth.ts` :
- État utilisateur courant
- État de chargement
- Persistance de session

Push : `feat: useAuth hook with session persistence`

**3.3 — Page de connexion**
`app/auth/page.tsx` :
- Bouton "Se connecter avec Google"
- Redirection vers `/` après connexion réussie
- Style sobre, centré, mobile-friendly

Push : `feat: Google sign-in page`

**3.4 — Protection des routes**
- Middleware Next.js : redirection vers `/auth` si non connecté
- Redirection vers `/` si déjà connecté et on visite `/auth`

Push : `feat: route protection middleware`

**3.5 — Premier accès — date de début**
Si `meta/config.dateDebut` est null lors du premier accès authentifié :
- Modal simple : "Quelle est la date de début de ton programme ?"
- Saisir ou confirmer la date du jour
- Sauvegarder dans Firestore `meta/config`

Push : `feat: first-run programme start date setup`

### 🔴 VALIDATION REQUISE — Phase 3
**L'utilisateur vérifie :**
1. Connexion Google fonctionne sur mobile
2. Session persistante après fermeture du navigateur
3. Redirection correcte si non connecté
4. Date de début correctement sauvegardée dans Firestore

---

## PHASE 4 — Fiche séance — Affichage

**Objectif** : La fiche du jour s'affiche correctement avec tous les exercices, le bon état visuel.

### Étapes autonomes

**4.1 — Page séance**
`app/seance/[jour]/page.tsx` :
- Validation du paramètre `jour` (lundi–vendredi uniquement)
- Affichage du titre et focus musculaire du jour
- Date automatique (non modifiable) en en-tête
- Numéro de semaine calculé dynamiquement

Push : `feat: session page header with date and week number`

**4.2 — Composant ExerciceCard**
`components/ExerciceCard.tsx` :
- Nom de l'exercice
- Séries × reps cibles
- Temps de repos
- Lien YouTube (ouvre dans le navigateur)
- Zone de saisie des séries (vide à ce stade)

Push : `feat: ExerciceCard component with exercise details`

**4.3 — Navigation entre exercices**
- Un exercice visible à la fois (focus mobile)
- Boutons "Précédent" / "Suivant"
- Indicateur de progression : "Exercice 2 / 5"
- Animation de transition légère

Push : `feat: single-exercise navigation with progress indicator`

**4.4 — Page d'accueil — sélection du jour**
`app/page.tsx` complet :
- 5 cartes jour (Lun → Ven) avec focus musculaire
- Mise en évidence du jour actuel
- Badge "Complétée ✓" si séance déjà faite aujourd'hui
- Numéro de semaine en cours affiché

Push : `feat: home page with day selection and week indicator`

---

## PHASE 5 — Fiche séance — Saisie et sauvegarde

**Objectif** : Saisie des poids et reps, sauvegarde automatique Firestore, indicateur de statut.

### Étapes autonomes

**5.1 — Fonctions Firestore**
`lib/firestore.ts` complet :
- `creerSeance(jour, date)` → crée et retourne l'ID
- `sauvegarderSerie(seanceId, exerciceId, serie)` → upsert
- `getSeanceDuJour(jour, date)` → séance existante ou null
- `getSeancesParJour(jour)` → toutes les séances d'un jour

Push : `feat: complete Firestore CRUD functions`

**5.2 — Hook useSeance**
`hooks/useSeance.ts` :
- Charge ou crée la séance à l'ouverture
- Expose les fonctions de mise à jour
- Gère l'état de chargement et les erreurs
- Sauvegarde automatique avec debounce 500ms

Push : `feat: useSeance hook with auto-save`

**5.3 — Composant SerieInput**
`components/SerieInput.tsx` :
- Deux champs côte à côte : poids (kg) et reps
- Clavier numérique sur mobile (`inputMode="decimal"`)
- Zone de tap minimum 48px
- État "complétée" au tap sur la série
- Feedback visuel de sauvegarde (spinner → checkmark)

Push : `feat: SerieInput component with numeric keyboard`

**5.4 — Intégration saisie + sauvegarde**
- `SerieInput` intégré dans `ExerciceCard`
- Chaque modification déclenche `sauvegarderSerie`
- Indicateur global "Sauvegardé" / "Sauvegarde en cours..."
- Gestion offline : file d'attente si pas de connexion

Push : `feat: series input integrated with auto-save to Firestore`

**5.5 — Tests critiques**
`__tests__/firestore.test.ts` (avec mocks Firebase) :
- Test création de séance
- Test sauvegarde d'une série
- Test récupération séance existante

`__tests__/useSeance.test.ts` :
- Test initialisation hook
- Test sauvegarde automatique

Push : `test: Firestore and useSeance critical tests`

### 🔴 VALIDATION REQUISE — Phase 5
**L'utilisateur vérifie sur son téléphone Android :**
1. Ouvrir la fiche du lundi
2. Saisir poids et reps sur la série 1 du développé couché
3. Vérifier dans la console Firebase que les données sont sauvegardées
4. Fermer et rouvrir l'app — les données persistent
5. Passer à l'exercice suivant fonctionne

---

## PHASE 6 — Pré-remplissage et indicateur de progression

**Objectif** : Le dernier poids utilisé s'affiche automatiquement. La progression est visible.

### Étapes autonomes

**6.1 — Fonction poids précédent**
`lib/firestore.ts` — ajouter :
- `getDerniersPoids(jour, exerciceId)` → `{ serie1: number|null, serie2: number|null, ... }`
- Cherche la séance la plus récente du même jour (pas celle d'aujourd'hui)

Push : `feat: get previous session weights from Firestore`

**6.2 — Hook useHistorique**
`hooks/useHistorique.ts` :
- `getDerniereSeance(jour)` → séance précédente complète
- `getProgressionExercice(exerciceId)` → tableau poids max par séance

Push : `feat: useHistorique hook for progression data`

**6.3 — Pré-remplissage dans SerieInput**
- `SerieInput` reçoit `poidsDefaut?: number`
- Affiché en placeholder grisé si aucune valeur saisie
- Texte d'aide discret : "Dernier : 60 kg"

Push : `feat: auto-fill previous session weights in series inputs`

**6.4 — Composant ProgressionBadge**
`components/ProgressionBadge.tsx` :
- `↑ +2.5 kg` en vert si progression
- `↓ -2.5 kg` en rouge si régression
- `= Stable` en gris si identique
- `—` si première séance
- Affiché sous le nom de l'exercice

Push : `feat: ProgressionBadge component with vs previous session`

**6.5 — Tests pré-remplissage**
`__tests__/prefill.test.ts` :
- Test avec historique existant
- Test sans historique (première séance)
- Test calcul progression (↑ ↓ =)

Push : `test: pre-fill and progression calculation tests`

### 🔴 VALIDATION REQUISE — Phase 6
**L'utilisateur vérifie (nécessite au moins 2 séances du même jour) :**
1. Le poids de la séance précédente s'affiche correctement
2. Le badge de progression est juste
3. Si je saisis un poids plus élevé → badge vert ↑
4. Si je saisis un poids moins élevé → badge rouge ↓

---

## PHASE 7 — Notes et fin de séance

**Objectif** : Notes par exercice, résumé de fin de séance, séance marquée comme complétée.

### Étapes autonomes

**7.1 — Notes par exercice**
Dans `ExerciceCard` :
- Champ texte optionnel "Notes" (collapsible, s'affiche sur tap)
- Sauvegarde automatique dans Firestore
- Indicateur visuel si une note existe

Push : `feat: per-exercise notes with auto-save`

**7.2 — Écran de fin de séance**
Après le dernier exercice, afficher un écran récapitulatif :
- Résumé : tous les exercices et poids utilisés
- Formulaire de clôture :
  - Qualité de séance (1–10, sélecteur visuel)
  - Énergie après (1–10)
  - Sommeil la veille (heures, sélecteur)
  - Poids corporel (optionnel, kg)
  - Cardio effectué (oui/non + durée si oui)
  - Notes générales (texte libre)
- Bouton "Terminer la séance"

Push : `feat: end-of-session summary and feedback form`

**7.3 — Marquage séance complétée**
- `completerSeance(seanceId, feedback)` dans `lib/firestore.ts`
- Met `completee: true` et sauvegarde le feedback
- Retour à l'accueil avec badge "Complétée ✓" sur le jour

Push : `feat: session completion with feedback saved to Firestore`

**7.4 — Reprise de séance**
Si une séance du jour existe déjà en Firestore (non complétée) :
- Proposer "Reprendre" ou "Nouvelle séance"
- "Reprendre" charge les données existantes
- "Nouvelle séance" crée une nouvelle entrée (conserve l'ancienne)

Push : `feat: session resume or restart logic`

---

## PHASE 8 — Historique

**Objectif** : Consulter les séances passées par jour et par exercice.

### Étapes autonomes

**8.1 — Page historique**
`app/historique/page.tsx` :
- Liste des séances par jour (Lun → Ven)
- Chaque jour affiche les N dernières séances avec date et qualité
- Tap sur une séance → détail en lecture seule

Push : `feat: historique page with sessions list by day`

**8.2 — Détail séance passée**
- Vue lecture seule d'une séance passée
- Tous les exercices avec poids et reps par série
- Notes affichées
- Pas de modification possible

Push : `feat: past session detail view read-only`

**8.3 — Graphique de progression simple**
Pour chaque exercice, afficher le poids maximum par séance :
- Graphique ligne simple (utiliser recharts)
- Filtrable par exercice (dropdown)
- Accessible depuis la page historique

Push : `feat: progression chart per exercise with recharts`

---

## PHASE 9 — Export JSON

**Objectif** : L'utilisateur peut exporter toutes ses données en JSON pour analyse Claude.

### Étapes autonomes

**9.1 — Fonction d'export**
`lib/export.ts` :
- `genererExport()` → récupère toutes les séances Firestore
- Formate selon le schéma défini dans `brief_technique.md`
- Inclut métadonnées : date export, semaine actuelle, programme

Push : `feat: JSON export generation function`

**9.2 — Page export**
`app/export/page.tsx` :
- Bouton "Générer l'export"
- Aperçu du nombre de séances incluses
- Bouton "Télécharger gym_export_AAAA-MM-JJ.json"
- Instructions courtes : "Glisse ce fichier dans ton projet Claude pour analyse"

Push : `feat: export page with JSON download`

**9.3 — Test export**
`__tests__/export.test.ts` :
- Test format JSON correct
- Test nommage du fichier
- Test avec données vides (première utilisation)

Push : `test: JSON export format and filename tests`

### 🔴 VALIDATION REQUISE — Phase 9
**L'utilisateur vérifie :**
1. Télécharger le fichier JSON
2. L'ouvrir et vérifier que le format est lisible
3. Glisser le fichier dans ce projet Claude et envoyer "Analyse mes séances"
4. Confirmer que Claude répond correctement avec les données

---

## PHASE 10 — Tests Jest complets

**Objectif** : Couverture des fonctions critiques, zéro régression possible.

### Étapes autonomes

**10.1 — Tests utilitaires**
Compléter `__tests__/utils.test.ts` :
- Tous les cas limites de `getSemaineActuelle`
- Validation des IDs exercice
- Tests de formatage de dates

Push : `test: complete utility functions test coverage`

**10.2 — Tests composants critiques**
Créer `__tests__/components/` :
- `SerieInput.test.tsx` : saisie, validation, feedback
- `ProgressionBadge.test.tsx` : tous les états (↑ ↓ = —)
- `ExerciceCard.test.tsx` : affichage et navigation

Push : `test: critical component tests`

**10.3 — Tests hooks**
- `useSeance.test.ts` : cycle complet création → saisie → complétion
- `useHistorique.test.ts` : récupération et calcul progression

Push : `test: hooks test coverage`

**10.4 — Rapport de couverture**
```bash
npm test -- --coverage
```
Objectif minimum : 70% sur `lib/` et `hooks/`
Documenter le rapport dans `TEST_REPORT.md`

Push : `test: coverage report - target 70% on lib and hooks`

### 🔴 VALIDATION REQUISE — Phase 10
**Windsurf présente :**
- Résultat `npm test` : X tests passés, 0 échoués
- Rapport de couverture
- Liste des cas non couverts et justification

---

## PHASE 11 — PWA et installation Android

**Objectif** : L'app s'installe sur Android comme une vraie app.

### Étapes autonomes

**11.1 — Icônes PWA**
Générer des icônes correctes pour le manifest :
- `public/icons/icon-192.png` (192×192)
- `public/icons/icon-512.png` (512×512)
- `public/icons/apple-touch-icon.png` (180×180)
- Couleur de fond : `#1a1a2e`, lettre "G" en blanc

Push : `chore: PWA icons generated`

**11.2 — Service Worker et cache**
Configurer next-pwa :
- Cache des assets statiques
- Cache des pages visitées
- Stratégie offline : afficher les données en cache si pas de connexion
- Message "Hors connexion — données locales affichées" si offline

Push : `feat: service worker with offline cache strategy`

**11.3 — Métadonnées PWA complètes**
Dans `app/layout.tsx` :
- `theme-color`
- `apple-mobile-web-app-capable`
- `apple-mobile-web-app-status-bar-style`
- `viewport` optimisé (pas de zoom)

Push : `feat: complete PWA metadata for iOS and Android`

**11.4 — Test Lighthouse**
Lancer Lighthouse sur l'URL Vercel :
- PWA score ≥ 90
- Performance ≥ 80
- Accessibility ≥ 90
Documenter les résultats dans `LIGHTHOUSE.md`

Push : `chore: Lighthouse audit results documented`

### 🔴 VALIDATION REQUISE — Phase 11
**L'utilisateur vérifie sur son téléphone Android :**
1. Ouvrir l'URL Vercel dans Chrome Android
2. "Ajouter à l'écran d'accueil" disponible dans le menu
3. L'app s'installe et s'ouvre en plein écran sans barre d'adresse
4. L'icône s'affiche correctement sur l'écran d'accueil
5. Couper le WiFi — l'app s'ouvre quand même (données cachées)

---

## PHASE 12 — Polish et déploiement production

**Objectif** : Finitions UX, déploiement stable, documentation à jour.

### Étapes autonomes

**12.1 — États vides**
Ajouter des états vides clairs :
- Première connexion : guide "Comment démarrer"
- Historique vide : "Aucune séance enregistrée"
- Export sans données : message explicatif

Push : `feat: empty states for all views`

**12.2 — Gestion d'erreurs globale**
- `app/error.tsx` : page d'erreur globale avec bouton "Réessayer"
- Toast notifications pour les erreurs réseau
- Retry automatique sur les opérations Firestore échouées

Push : `feat: global error handling and retry logic`

**12.3 — Optimisations performance**
- Lazy loading des pages secondaires
- Optimisation des requêtes Firestore (index si nécessaire)
- Vérifier qu'aucun re-render inutile n'existe (React DevTools)

Push : `perf: lazy loading and Firestore query optimization`

**12.4 — Révision finale du code**
- Supprimer tous les `console.log` de debug
- Vérifier que `.env.local` n'est pas dans Git
- Vérifier `npx tsc --noEmit` propre
- Vérifier `npm run build` sans warning

Push : `chore: final code cleanup before production`

**12.5 — Documentation**
Mettre à jour `README.md` :
- Description du projet
- Instructions d'installation locale
- Variables d'environnement nécessaires
- Lien vers l'app en production

Push : `docs: complete README for project`

**12.6 — Déploiement production final**
```bash
vercel --prod
```
Push : `chore: production deployment v1.0.0`

**12.7 — Tag Git v1.0.0**
```bash
git tag -a v1.0.0 -m "Gym Tracker v1.0.0 — MVP complet"
git push origin v1.0.0
```

### 🔴 VALIDATION REQUISE — Phase 12 (finale)
**L'utilisateur valide en conditions réelles sur 1 séance complète :**
1. Ouvrir l'app installée sur Android
2. Faire une séance complète (saisie de toutes les séries)
3. Remplir le formulaire de fin de séance
4. Vérifier l'historique
5. Exporter le JSON
6. Glisser le JSON dans Claude et obtenir une analyse
7. Confirmer que tout fonctionne de bout en bout

**Si tout est validé → v1.0.0 en production.**

---

## Récapitulatif des validations utilisateur

| # | Phase | Ce que tu valides |
|---|---|---|
| 🔴 1 | Phase 0 | Projet tourne, Vercel accessible |
| 🔴 2 | Phase 1 | Navigation mobile correcte |
| 🔴 3 | Phase 3 | Auth Google + session persistante |
| 🔴 4 | Phase 5 | Saisie + sauvegarde Firestore |
| 🔴 5 | Phase 6 | Pré-remplissage + progression |
| 🔴 6 | Phase 9 | Export JSON → analyse Claude |
| 🔴 7 | Phase 10 | Tests passent, couverture OK |
| 🔴 8 | Phase 11 | Installation Android réussie |
| 🔴 9 | Phase 12 | Séance complète de bout en bout |

---

## En cas de blocage

Si Windsurf rencontre un blocage technique non résolvable :
1. Documenter le problème dans `ISSUES.md` avec le message d'erreur complet
2. Proposer 2 solutions alternatives
3. Continuer avec la phase suivante si le blocage n'est pas bloquant pour la suite
4. Taguer le commit : `fix(blocked): [description du problème]`

---

## Estimation de durée

| Phase | Complexité | Durée estimée |
|---|---|---|
| 0 — Fondations | Faible | 1–2 h |
| 1 — Navigation | Faible | 1 h |
| 2 — Données statiques | Faible | 1 h |
| 3 — Auth | Moyenne | 1–2 h |
| 4 — Affichage séance | Moyenne | 2 h |
| 5 — Saisie + sauvegarde | Élevée | 3–4 h |
| 6 — Pré-remplissage | Élevée | 2–3 h |
| 7 — Notes + fin séance | Moyenne | 1–2 h |
| 8 — Historique | Moyenne | 2 h |
| 9 — Export JSON | Faible | 1 h |
| 10 — Tests | Moyenne | 2–3 h |
| 11 — PWA | Moyenne | 2 h |
| 12 — Polish + prod | Faible | 1–2 h |
| **Total estimé** | | **20–28 h de dev** |

En sessions de travail Windsurf de 2–3 heures : **8 à 12 sessions**.
