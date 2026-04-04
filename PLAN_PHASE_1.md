# PLAN — Phase 1 : Structure et navigation

## Contexte
Phase 0 validée. Poursuis sur `main`, push après chaque tâche.

## Tâches

- [ ] **1.1** Créer le layout global `app/layout.tsx`
  Métadonnées PWA, police système, couleurs Tailwind configurées
  Ajouter dans `tailwind.config.ts` : `dark: '#1a1a2e'`, `accent: '#0f3460'`, `light: '#f0f4f8'`
  Push : `feat: global layout with PWA metadata and color palette`

- [ ] **1.2** Créer les composants UI de base dans `components/ui/`
  - `Button.tsx` — variantes : primary, secondary, ghost, danger
  - `Card.tsx`
  - `Input.tsx` — champ numérique optimisé mobile (inputMode decimal)
  - `Badge.tsx` — variantes : success, warning, neutral
  - `Spinner.tsx`
  Push : `feat: base UI component library`

- [ ] **1.3** Créer les pages squelettes avec contenu placeholder
  - `app/page.tsx` — Accueil
  - `app/auth/page.tsx` — Connexion
  - `app/seance/[jour]/page.tsx` — Fiche séance
  - `app/historique/page.tsx` — Historique
  - `app/export/page.tsx` — Export JSON
  Push : `feat: skeleton pages with routing`

- [ ] **1.4** Créer `components/NavBar.tsx` — navigation fixe bas d'écran
  Icônes : 🏠 Accueil · 📋 Historique · 📤 Export
  Route active mise en évidence
  Intégrer dans `app/layout.tsx`
  Push : `feat: bottom navigation with active state`

- [ ] **1.5** Créer `app/not-found.tsx` et `app/loading.tsx`
  Push : `feat: 404 and loading states`

## Critères de complétion
- Navigation fonctionnelle entre toutes les pages sans erreur
- `npx tsc --noEmit` propre
- Rendu correct à 390px dans DevTools (mobile-first)

## 🔴 STOP — Validation requise
Affiche une capture ou description du rendu mobile sur localhost:3000
Attends confirmation avant Phase 2.
