# 📌 Kanban 2SB – Application de gestion de projets collaboratifs

Bienvenue sur le dépôt GitHub du projet **Kanban 2SB**, une solution web et mobile de gestion de tâches en équipe à travers une interface Kanban intuitive. Ce projet a été développé dans le cadre du **Hackathon 2SB**.

---

## 🚀 Objectif du projet

Fournir une plateforme collaborative pour :
- Organiser les projets par colonnes (Backlog, À faire, En cours, Terminé).
- Permettre aux membres d’une équipe de suivre l’évolution des tâches.
- Faciliter la communication et la productivité.

---

## 🧩 Fonctionnalités clés

### ✅ Web (React + TypeScript)
- Authentification sécurisée avec JWT.
- Création et gestion de projets.
- Ajout, déplacement (drag & drop) et suppression de tâches.
- Interface responsive et moderne avec TailwindCSS.

### 📱 Mobile (Flutter)
- Onboarding avec illustrations.
- Connexion utilisateur.
- Tableau Kanban interactif avec `flutter_boardview`.
- Navigation fluide avec GoRouter + Riverpod.

---

## 📁 Structure du projet

```bash
/kanban-2sb
│
├── front/      # Application React
│   ├── src/
│   ├── public/
│   └── ...
│
├── mobile/   # Application Flutter
│   ├── lib/
│   ├── assets/
│   └── ...
│
├── back/           # API (si présent ou prévu)
│
└── README.md          # Ce fichier
