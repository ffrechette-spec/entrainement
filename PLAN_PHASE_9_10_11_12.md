# PLAN — Phase 9 : Export JSON

## Contexte
Phase 8 complétée. Poursuis sur `main`, push après chaque tâche.

## Tâches

- [ ] **9.1** Créer `lib/export.ts`
  `genererExport()` → récupère toutes les séances Firestore et formate en JSON
  Format exact défini dans `brief_technique.md`
  Nom de fichier : `gym_export_AAAA-MM-JJ.json`
  Push : `feat: JSON export generation function`

- [ ] **9.2** Compléter `app/export/page.tsx`
  Bouton "Générer l'export"
  Afficher le nombre de séances incluses
  Bouton "Télécharger gym_export_AAAA-MM-JJ.json"
  Message d'instructions : "Glisse ce fichier dans ton projet Claude pour analyse"
  Push : `feat: export page with JSON download`

- [ ] **9.3** Créer `__tests__/export.test.ts`
  Tester le format JSON, le nommage du fichier, le cas sans données
  Push : `test: JSON export format and filename tests`

## 🔴 STOP — Validation requise
L'utilisateur doit :
1. Télécharger le fichier JSON généré
2. Vérifier que le format est lisible
3. Confirmer que la structure correspond au brief
Attends confirmation avant Phase 10.

---

# PLAN — Phase 10 : Tests Jest

## Tâches

- [ ] **10.1** Compléter `__tests__/utils.test.ts`
  Tous les cas limites de `getSemaineActuelle`
  Validation des IDs exercice, formatage de dates
  Push : `test: complete utility functions coverage`

- [ ] **10.2** Créer `__tests__/components/SerieInput.test.tsx`
  Tester saisie, validation, feedback visuel
  Push : `test: SerieInput component tests`

- [ ] **10.3** Créer `__tests__/components/ProgressionBadge.test.tsx`
  Tester tous les états : ↑ ↓ = —
  Push : `test: ProgressionBadge component tests`

- [ ] **10.4** Créer `__tests__/components/ExerciceCard.test.tsx`
  Tester affichage et navigation
  Push : `test: ExerciceCard component tests`

- [ ] **10.5** Compléter `__tests__/hooks/useSeance.test.ts` et `useHistorique.test.ts`
  Push : `test: hooks complete test coverage`

- [ ] **10.6** Générer le rapport de couverture
  ```bash
  npm test -- --coverage
  ```
  Objectif minimum : 70% sur `lib/` et `hooks/`
  Créer `TEST_REPORT.md` avec le résumé
  Push : `test: coverage report documented`

## 🔴 STOP — Validation requise
Affiche :
- Résultat `npm test` : X tests passés, 0 échoués
- Pourcentage de couverture sur lib/ et hooks/
Attends confirmation avant Phase 11.

---

# PLAN — Phase 11 : PWA et installation Android

## Tâches

- [ ] **11.1** Générer les icônes PWA
  `public/icons/icon-192.png` et `icon-512.png`
  Fond : `#1a1a2e`, lettre "G" blanche centrée
  `public/icons/apple-touch-icon.png` (180×180)
  Push : `chore: PWA icons generated`

- [ ] **11.2** Configurer le service worker et le cache offline
  Stratégie : cache des assets statiques + pages visitées
  Message "Hors connexion — données locales affichées" si offline
  Push : `feat: service worker with offline cache strategy`

- [ ] **11.3** Compléter les métadonnées PWA dans `app/layout.tsx`
  `theme-color`, `apple-mobile-web-app-capable`, `viewport` sans zoom
  Push : `feat: complete PWA metadata for iOS and Android`

- [ ] **11.4** Lancer un audit Lighthouse sur l'URL Vercel
  Objectifs : PWA ≥ 90, Performance ≥ 80, Accessibility ≥ 90
  Créer `LIGHTHOUSE.md` avec les résultats
  Push : `chore: Lighthouse audit results documented`

## 🔴 STOP — Validation requise
L'utilisateur doit vérifier sur son téléphone Android :
1. Chrome → URL Vercel → "Ajouter à l'écran d'accueil" disponible
2. L'app s'installe et s'ouvre en plein écran
3. L'icône s'affiche correctement
4. Couper WiFi → l'app s'ouvre quand même
Attends confirmation avant Phase 12.

---

# PLAN — Phase 12 : Polish et déploiement production

## Tâches

- [ ] **12.1** Ajouter les états vides
  Premier accès : guide "Comment démarrer"
  Historique vide, export sans données : messages explicatifs
  Push : `feat: empty states for all views`

- [ ] **12.2** Ajouter la gestion d'erreurs globale
  `app/error.tsx` avec bouton "Réessayer"
  Toast notifications pour erreurs réseau
  Retry automatique sur opérations Firestore échouées
  Push : `feat: global error handling and retry logic`

- [ ] **12.3** Optimisations performance
  Lazy loading des pages secondaires
  Vérifier les requêtes Firestore (index si nécessaire)
  Push : `perf: lazy loading and Firestore optimization`

- [ ] **12.4** Nettoyage final
  Supprimer tous les `console.log` de debug
  Vérifier que `.env.local` n'est pas dans Git (`git status`)
  `npx tsc --noEmit` propre
  `npm run build` sans warning
  Push : `chore: final code cleanup`

- [ ] **12.5** Mettre à jour `README.md`
  Description, installation locale, variables d'environnement, lien production
  Push : `docs: complete README`

- [ ] **12.6** Tag de version
  ```bash
  git tag -a v1.0.0 -m "Gym Tracker v1.0.0 — MVP complet"
  git push origin v1.0.0
  ```
  Push final : `chore: production release v1.0.0`

## 🔴 STOP — Validation finale
L'utilisateur valide en conditions réelles :
1. Séance complète sur Android (saisie de toutes les séries)
2. Formulaire fin de séance rempli
3. Historique vérifié
4. JSON exporté et analysé dans Claude
5. Tout fonctionne de bout en bout

**Si validé → v1.0.0 en production. Projet terminé.**
