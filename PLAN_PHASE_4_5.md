# PLAN — Phase 4 : Fiche séance — Affichage

## Contexte
Phase 3 validée. Poursuis sur `main`, push après chaque tâche.

## Tâches

- [ ] **4.1** Compléter `app/seance/[jour]/page.tsx` — en-tête
  Valider le paramètre `jour` (lundi–vendredi uniquement, sinon redirect)
  Afficher : titre du jour, focus musculaire, date automatique, numéro de semaine calculé
  Push : `feat: session page header with date and week number`

- [ ] **4.2** Créer `components/ExerciceCard.tsx`
  Afficher : nom, séries × reps cibles, temps de repos, lien YouTube (ouvre navigateur)
  Zone de saisie des séries : vide pour l'instant
  Push : `feat: ExerciceCard component with exercise details`

- [ ] **4.3** Ajouter la navigation entre exercices dans la fiche séance
  Un exercice visible à la fois
  Boutons Précédent / Suivant
  Indicateur : "Exercice 2 / 5"
  Animation de transition légère
  Push : `feat: single-exercise navigation with progress indicator`

- [ ] **4.4** Compléter `app/page.tsx` — page d'accueil
  5 cartes (Lun→Ven) avec focus musculaire
  Mise en évidence du jour actuel
  Badge "Complétée ✓" si séance déjà faite aujourd'hui
  Semaine en cours affichée
  Push : `feat: home page with day selection and week indicator`

## Critères de complétion
- Navigation entre les 5 exercices d'un jour fonctionne
- `npx tsc --noEmit` propre
- Pas de validation requise — passer directement à la Phase 5

---

# PLAN — Phase 5 : Fiche séance — Saisie et sauvegarde

## Tâches

- [ ] **5.1** Compléter `lib/firestore.ts` avec les fonctions CRUD
  - `creerSeance(jour, date)` → ID de la nouvelle séance
  - `sauvegarderSerie(seanceId, exerciceId, serie)` → upsert
  - `getSeanceDuJour(jour, date)` → séance existante ou null
  - `getSeancesParJour(jour)` → toutes les séances d'un jour
  Push : `feat: complete Firestore CRUD functions`

- [ ] **5.2** Créer `hooks/useSeance.ts`
  Charge ou crée la séance à l'ouverture
  Sauvegarde automatique avec debounce 500ms
  Gère chargement et erreurs réseau
  Push : `feat: useSeance hook with auto-save`

- [ ] **5.3** Créer `components/SerieInput.tsx`
  Deux champs côte à côte : poids (kg) et reps
  `inputMode="decimal"` pour clavier numérique mobile
  Zone de tap minimum 48px
  État "complétée" au tap sur la série
  Feedback visuel sauvegarde (spinner → checkmark)
  Push : `feat: SerieInput component with numeric keyboard`

- [ ] **5.4** Intégrer la saisie dans la fiche séance
  `SerieInput` intégré dans `ExerciceCard`
  Chaque modification déclenche `sauvegarderSerie`
  Indicateur global "Sauvegardé ✓" / "Sauvegarde..."
  Push : `feat: series input integrated with auto-save to Firestore`

- [ ] **5.5** Créer les tests critiques
  `__tests__/firestore.test.ts` — avec mocks Firebase
  `__tests__/useSeance.test.ts`
  Push : `test: Firestore and useSeance critical tests`

## Critères de complétion
- Saisie poids + reps fonctionne sur mobile
- Données sauvegardées dans Firestore visibles dans la console Firebase
- Données persistent après fermeture et réouverture
- `npm test` passe

## 🔴 STOP — Validation requise
Affiche confirmation que :
1. Saisie fonctionne sur mobile (ou DevTools 390px)
2. Les données apparaissent dans Firestore console
3. Les données persistent après refresh
Attends confirmation avant Phase 6.
