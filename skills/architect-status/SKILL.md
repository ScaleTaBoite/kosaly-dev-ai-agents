---
name: architect-status
description: >-
  Interne — kagents architect:status. Lecture INDEX, decisions/, proposals/,
  synthese read-only. Pas d'audit repository complet.
---

# Architect status

## Quand utiliser

- Commande **`kagents architect:status`**.

## Interdictions

- Pas de modification de fichiers (read-only).
- Pas d'audit repo complet ; pas de code metier modifie.
- Pas de lecture secrets.

## Lecture

1. `.kagents/docs/architect-docs/INDEX.md`
2. `.kagents/docs/architect-docs/decisions/DEC-*.md` (metadonnees + statut)
3. `.kagents/docs/architect-docs/proposals/` si existe
4. Livrables `outputs/` : uniquement entrees INDEX ou fichiers cites pour travaux ouverts / relais en attente / A VALIDER

## Aggregation

- **Travaux ouverts** : section INDEX + lignes statut A VALIDER / travaux en cours
- **Decisions** : par statut (A VALIDER, VALIDEE, REJETEE, REMPLACEE, PROPOSEE)
- **Relais en attente** : depuis derniers livrables (sections `## Relais` ou ancien titre `Handoff`, et impact Base) si mentionnes en INDEX — lecture ciblee max 3 fichiers recents. En chat : dire **qui** doit faire **quoi** (ex. « l'analyse donnees n'a pas encore ete lancee »), pas le mot « relais » sauf si l'utilisateur parle de la doc.
- **Derniers livrables** : 3–5 entrees les plus recentes dans INDEX (toutes sections)
- **Blocages** : questions BLOQUANT / INCONNU dans decisions ouvertes ou livrables

Statuts decisions : PROPOSEE, A VALIDER, VALIDEE, REJETEE, REMPLACEE.

## Sortie chat

Appliquer integralement `rules/domains/architect-chat.md` pour le texte affiche. Les tableaux de `commands/architect-status.md` decrivent la lecture INDEX, pas l'affichage chat.

Ne pas lister tous les fichiers du repo.
