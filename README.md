# Threadify Pro (MVP)

Ce projet est un prototype permettant de générer des threads Twitter/X à partir de vidéos YouTube en utilisant l'API d'OpenAI et la transcription des vidéos.

## Prérequis

- Node.js (v14 ou supérieur)
- Une clé API OpenAI

## Installation

1. Clonez ce dépôt.
2. Installez les dépendances du backend :
   ```bash
   npm install
   ```
3. Copiez le fichier `.env.example` vers `.env` et ajoutez votre clé API OpenAI :
   ```bash
   cp .env.example .env
   # Éditez .env et ajoutez votre OPENAI_API_KEY
   ```

## Utilisation

1. Démarrez le serveur backend :
   ```bash
   node server.js
   ```
   Le serveur démarrera sur `http://localhost:3000`.
2. Ouvrez le fichier `index.html` dans votre navigateur.
3. Collez l'URL d'une vidéo YouTube dans le champ de texte et cliquez sur "Generate Thread".
