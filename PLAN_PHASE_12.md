# PLAN — Phase 12 : Polish visuel 80s Tracksuit + Déploiement production

## Contexte
Style : **Option C — 80s Tracksuit**
- Couleurs par groupe musculaire (pecs=rose, dos=bleu, jambes=violet, épaules=cyan)
- Pixel art moderne 16-bit pour les icônes
- Police **Orbitron** (Google Fonts) sur les titres uniquement
- Micro-animations légères
- Fonctionnalité UX intacte — aucune régression

---

## Tâches

### 12.1 — Système de couleurs par groupe musculaire
Dans `tailwind.config.ts`, ajouter :
```js
retro: {
  rose:   '#FF6B9D',  // Pectoraux · Triceps
  bleu:   '#4ECDC4',  // Dos · Biceps
  violet: '#C77DFF',  // Jambes
  cyan:   '#00F5FF',  // Épaules · Bras
  gold:   '#FFD93D',  // Cardio · Abdominaux
}
```
Créer `lib/couleurs.ts` — fonction `getCouleurJour(jour: JourSemaine)` qui retourne la couleur et le gradient associés.
Push : `feat: retro color system by muscle group`

### 12.2 — Police Orbitron (titres uniquement)
Dans `app/layout.tsx` :
- Importer `Orbitron` depuis `next/font/google` (weights: 400, 700, 900)
- Appliquer uniquement sur les titres principaux (h1, `.font-retro`)
- Garder la police système pour tout le texte courant (lisibilité)
Push : `feat: Orbitron font for titles only`

### 12.3 — Icônes pixel art 16-bit par groupe musculaire
Créer `components/PixelIcon.tsx` — composant SVG pixel art :
- `pecs` : haltère horizontal 16×16 (rose)
- `dos` : flèche vers le haut stylisée (bleu)
- `jambes` : silhouette squat (violet)
- `epaules` : épaules larges schématiques (cyan)
- `cardio` : cœur pixélisé (gold)
- `bras` : biceps stylisé (rose/cyan)

Style pixel art 16-bit : formes géométriques simples, pas de courbes, couleurs douces, fond transparent.
Push : `feat: 16-bit pixel art icons by muscle group`

### 12.4 — Page d'accueil — cartes 80s
Mettre à jour `app/page.tsx` :
- Chaque carte jour avec **bordure gauche 4px** dans la couleur du groupe musculaire
- `PixelIcon` correspondant affiché à droite du nom du jour
- Header semaine avec style Orbitron + dégradé subtil bleu→violet sur le badge semaine
- Badge "✓ Complétée" avec couleur du groupe musculaire du jour
- Fond de carte légèrement teinté (3-5% opacity de la couleur du groupe)
Push : `feat: home page with 80s tracksuit style cards`

### 12.5 — Page séance — header coloré
Mettre à jour `app/seance/[jour]/page.tsx` :
- Header avec dégradé subtil de la couleur du jour (ex: lundi = dégradé rose→transparent)
- Titre en Orbitron
- Badge semaine avec pulse animation légère (CSS keyframes)
- `PixelIcon` du groupe musculaire affiché dans le header
Push : `feat: session page header with retro gradient and pixel icon`

### 12.6 — Micro-animations
Ajouter dans `app/globals.css` :

**Animation 1 — Badge semaine pulse :**
```css
@keyframes retro-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 107, 157, 0.4); }
  50% { box-shadow: 0 0 0 6px rgba(255, 107, 157, 0); }
}
.animate-retro-pulse { animation: retro-pulse 2s infinite; }
```

**Animation 2 — Série complétée (scale bounce) :**
```css
@keyframes serie-complete {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}
.animate-serie-complete { animation: serie-complete 0.3s ease-out; }
```

**Animation 3 — Barre de progression séance :**
Ajouter une barre de progression en haut de la page séance (exercice X/Y) avec transition CSS fluide et couleur du groupe musculaire.

Appliquer les animations dans `SerieInput.tsx` (bouton complétée) et `app/seance/[jour]/page.tsx` (barre + badge).
Push : `feat: micro-animations for session progress and completion`

### 12.7 — États vides stylisés
Mettre à jour les états vides avec le style rétro :
- Accueil premier accès : message avec `PixelIcon` et texte Orbitron
- Historique vide : pixel art motivationnel + message
- Export sans données : instructions claires avec icône
Push : `feat: styled empty states with retro pixel art`

### 12.8 — Gestion d'erreurs globale
Créer `app/error.tsx` complet :
- Message d'erreur clair en français
- Bouton "Réessayer" avec style rétro
- `app/global-error.tsx` pour les erreurs critiques
Push : `feat: global error handling with retro style`

### 12.9 — Nettoyage final
- Supprimer tous les `console.log` de debug restants
- Vérifier `.env.local` absent de Git (`git status`)
- `npm run build` sans warning
- `npx tsc --noEmit` propre
- `npm test` → 115/115 verts (les tests ne doivent pas être affectés par le style)
Push : `chore: final cleanup before production`

### 12.10 — README + documentation
Mettre à jour `README.md` :
- Description du projet
- Stack technique
- Installation locale (variables d'environnement)
- Lien production : `project-r25x0.vercel.app`
- Screenshots si possible
Push : `docs: complete README for v1.0.0`

### 12.11 — Tag v1.0.0
```bash
git tag -a v1.0.0 -m "Gym Tracker v1.0.0 — MVP complet + style 80s Tracksuit"
git push origin v1.0.0
```
Push final : `chore: release v1.0.0`

---

## Critères de complétion
- `npx tsc --noEmit` → 0 erreur
- `npm test` → 115/115 verts
- `npm run build` → propre
- Rendu mobile 390px : couleurs par jour visibles, Orbitron sur les titres, icônes pixel art présentes, animations fluides

## Contraintes importantes
- **Ne pas casser le UX existant** — les fonctionnalités (saisie, sauvegarde, export) sont intactes
- **Orbitron uniquement sur les titres** — tout le texte courant reste en police système
- **Animations légères** — pas de JS lourd, CSS keyframes uniquement
- **Accessibilité** — contrastes suffisants avec les nouvelles couleurs (AA minimum)
- **Ne pas modifier les tests existants** sauf si une interface TypeScript change

## 🔴 STOP final — Validation Phase 12
Présente :
- `npx tsc --noEmit`
- `npm test`
- `git log --oneline -8`
- Description détaillée du rendu à 390px (page accueil + page séance lundi)
- Confirmation que `project-r25x0.vercel.app` est accessible et fonctionnel

**Si validé → tag v1.0.0 → projet terminé.**
