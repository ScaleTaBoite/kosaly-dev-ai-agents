---
name: architect-discovery
description: >-
  Interne — commande publique kagents architect. Cartographie l'architecture observee
  du projet : modules, flux, couches, dependances. Livrable dans outputs/architecture/.
---

# Architect discovery

## Quand utiliser

- Commande **`kagents architect`** ou demande « explique l'architecture », « comment est organise le projet ».
- Avant une grosse evolution si aucune doc architecture fiable n'existe.

## Prerequis

- Racine repo projet.

## Lecture (ciblee)

1. `INDEX.md` et livrables Architect existants
2. `knowledge/context.md` (sans modifier)
3. `base-docs/` en lecture si deja present
4. Manifestes stack, README, arborescence haute
5. Code : entrees (routes, handlers), modules metier nommes, data layer visible

Interdit : secrets, lecture exhaustive du repo.

## Etapes

1. Decrire structure **observee** (pas ideale).
2. Modules, responsabilites, flux principaux, entrees/sorties.
3. Backend, frontend, APIs, stockage **tels qu'observes**.
4. Conventions reperees ; divergences doc vs code → **ETABLI** (code) + note d'ecart.
5. Qualifier chaque bloc (ETABLI / DEDUIT / INCONNU).
6. Niveau L0 sauf demande implicite de changement.
7. `architect-write-output` → `outputs/architecture/`, type `architecture`.
8. `architect-index`.
9. Chat : `rules/domains/architect-chat.md`.

## Resultat

Livrable architecture + INDEX a jour.
