# PLAN — Phase 6 : Pré-remplissage et progression

## Contexte
Phase 5 validée. Poursuis sur `main`, push après chaque tâche.

## Tâches

- [ ] **6.1** Ajouter `getDerniersPoids(jour, exerciceId)` dans `lib/firestore.ts`
  Retourne `{ serie1: number|null, serie2: number|null, serie3: number|null, serie4: number|null }`
  Cherche la séance la plus récente du même jour (excluant celle d'aujourd'hui)
  Push : `feat: get previous session weights from Firestore`

- [ ] **6.2** Créer `hooks/useHistorique.ts`
  - `getDerniereSeance(jour)` → séance précédente complète
  - `getProgressionExercice(exerciceId)` → tableau poids max par séance
  Push : `feat: useHistorique hook for progression data`

- [ ] **6.3** Ajouter le pré-remplissage dans `SerieInput`
  Prop `poidsDefaut?: number`
  Afficher "Dernier : 60 kg" en placeholder grisé si aucune valeur saisie
  Push : `feat: auto-fill previous session weights in series inputs`

- [ ] **6.4** Créer `components/ProgressionBadge.tsx`
  `↑ +2.5 kg` vert si progression
  `↓ -2.5 kg` rouge si régression
  `= Stable` gris si identique
  `—` si première séance
  Affiché sous le nom de l'exercice dans `ExerciceCard`
  Push : `feat: ProgressionBadge with vs previous session`

- [ ] **6.5** Créer `__tests__/prefill.test.ts`
  Tester avec historique existant, sans historique, calcul ↑ ↓ =
  Push : `test: pre-fill and progression calculation tests`

## 🔴 STOP — Validation requise
Attends confirmation avant Phase 7.

---

# PLAN — Phase 7 : Notes et fin de séance

## Tâches

- [ ] **7.1** Ajouter notes par exercice dans `ExerciceCard`
  Champ texte optionnel collapsible (affiché sur tap)
  Sauvegarde automatique dans Firestore
  Indicateur visuel si une note existe
  Push : `feat: per-exercise notes with auto-save`

- [ ] **7.2** Créer l'écran de fin de séance
  Déclenché après le dernier exercice
  Formulaire : qualité (1–10), énergie après (1–10), sommeil (heures), poids corporel (kg optionnel), cardio (oui/non + durée), notes générales
  Résumé de tous les exercices et poids utilisés
  Push : `feat: end-of-session summary and feedback form`

- [ ] **7.3** Compléter `lib/firestore.ts` — `completerSeance(seanceId, feedback)`
  Met `completee: true` + sauvegarde le feedback
  Retour à l'accueil avec badge "Complétée ✓"
  Push : `feat: session completion with feedback saved`

- [ ] **7.4** Gérer la reprise de séance
  Si séance du jour existe déjà (non complétée) : proposer "Reprendre" ou "Nouvelle séance"
  Push : `feat: session resume or restart logic`

## Critères de complétion
- `npx tsc --noEmit` propre — `npm test` passe
- Pas de validation requise — passer directement à la Phase 8

---

# PLAN — Phase 8 : Historique

## Tâches

- [ ] **8.1** Compléter `app/historique/page.tsx`
  Liste des séances par jour (Lun→Ven)
  Chaque jour : N dernières séances avec date et note de qualité
  Tap sur une séance → détail
  Push : `feat: historique page with sessions list by day`

- [ ] **8.2** Créer la vue détail séance passée
  Lecture seule — tous les exercices, poids, reps, notes
  Pas de modification possible
  Push : `feat: past session detail view read-only`

- [ ] **8.3** Ajouter un graphique de progression
  Poids maximum par séance pour chaque exercice
  Utiliser recharts (`npm install recharts`)
  Dropdown pour filtrer par exercice
  Push : `feat: progression chart per exercise with recharts`

## Critères de complétion
- `npx tsc --noEmit` propre — `npm test` passe
- Pas de validation requise — passer directement à la Phase 9
