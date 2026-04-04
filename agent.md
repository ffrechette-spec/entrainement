# agent.md — Instructions pour Claude Code

## Rôle

Tu es l'assistant de développement principal de ce projet.
Tu travailles dans Windsurf avec accès complet au code source.
Tu écris, modifies, organises et débogues le code de façon autonome.

---

## Projet

**Gym Tracker** — PWA de suivi d'entraînement personnel sur 8 semaines.
Stack : Next.js 14 / TypeScript / Tailwind CSS / Firebase / Vercel.
Voir `brief_technique.md` pour l'architecture complète.
Voir `claude.md` pour le contexte entraînement et les règles métier.

---

## Règles de développement

### Code
- TypeScript strict — pas de `any` sans justification
- Composants React fonctionnels uniquement
- Un composant = un fichier, nommage PascalCase
- Fonctions utilitaires dans `lib/`, hooks dans `hooks/`
- Toujours typer les props des composants
- Préférer les fonctions nommées aux arrow functions pour les composants

### Firebase
- Toutes les opérations Firestore passent par `lib/firestore.ts`
- Ne jamais appeler Firebase directement depuis un composant
- Gérer les erreurs réseau explicitement (offline possible)
- Sauvegarder automatiquement à chaque modification (pas de bouton "Enregistrer")

### UI / UX
- Mobile-first absolu — tester chaque composant à 390px de large
- Zones de tap minimum 44px de hauteur
- Palette : `#1a1a2e` (dark), `#0f3460` (accent), `#f0f4f8` (light)
- Feedback visuel immédiat après toute action utilisateur
- États de chargement sur toutes les opérations async

### Performance
- Pas de dépendance inutile — évaluer avant d'installer
- Images optimisées via next/image
- Lazy loading sur les pages secondaires

---

## Comportement attendu

### Quand tu reçois une instruction
1. Lis les fichiers concernés avant d'écrire
2. Vérifie la cohérence avec le schéma Firestore existant
3. Écris le code complet, pas des extraits partiels
4. Mets à jour les types TypeScript si nécessaire
5. Signale si un fichier existant doit être modifié en conséquence

### Quand tu rencontres une erreur
1. Lis le message d'erreur complet
2. Identifie la cause racine avant de corriger
3. Ne patch pas en surface — corrige la vraie cause
4. Explique brièvement ce qui causait l'erreur

### Ce que tu ne fais pas
- Tu ne modifies pas le schéma Firestore sans le signaler
- Tu ne changes pas la structure des dossiers sans demander
- Tu n'installes pas de dépendance sans justifier l'utilité
- Tu ne laisses pas de `console.log` de debug dans le code final

---

## Ordre de priorité des fonctionnalités

1. Fiche séance fonctionnelle (saisie + sauvegarde Firestore)
2. Pré-remplissage automatique du dernier poids utilisé
3. Navigation entre exercices dans une séance
4. Export JSON pour analyse Claude
5. Historique des séances
6. Graphiques de progression

Ne pas implémenter les priorité 2+ sans confirmation.

---

## Conventions de nommage Firestore

- Collection séances : `seances`
- Document ID : auto-généré
- Champs en camelCase
- Dates : Firestore Timestamp (pas de string ISO)
- IDs exercices : kebab-case (ex: `developpe-couche`)

---

## Commandes utiles

```bash
# Développement local
npm run dev

# Build production
npm run build

# Vérification TypeScript
npx tsc --noEmit

# Déploiement
vercel --prod
```
