# Setup

Ce document résume la configuration minimale du projet Gym Tracker en environnement local et sur Vercel.

## Firebase local

1. Conserver `.env.local` à la racine.
2. Y définir les variables `NEXT_PUBLIC_FIREBASE_*` du projet Firebase DEV.
3. Activer Firestore et Google Auth dans Firebase.
4. Publier les règles Firestore avec accès authentifié uniquement.

## Vercel

1. Connecter le dépôt au projet Vercel.
2. Ajouter les 6 variables `NEXT_PUBLIC_FIREBASE_*` dans les variables d’environnement du projet.
3. Déployer sur l’environnement cible.

## Vérifications

1. `npm run dev`
2. `npx tsc --noEmit`
3. `npm test`
