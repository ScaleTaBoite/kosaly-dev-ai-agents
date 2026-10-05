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
4. Livrables `outputs/` : uniquement entrees INDEX ou fichiers cites pour travaux ouverts / handoffs / A VALIDER

## Aggregation

- **Travaux ouverts** : section INDEX + lignes statut A VALIDER / travaux en cours
- **Decisions** : par statut (A VALIDER, VALIDEE, REJETEE, REMPLACEE, PROPOSEE)
- **Handoffs** : depuis derniers livrables (sections Handoff / Base) si mentionnes en INDEX ou entete — lecture ciblee max 3 fichiers recents
- **Derniers livrables** : 3–5 entrees les plus recentes dans INDEX (toutes sections)
- **Blocages** : questions BLOQUANT / INCONNU dans decisions ouvertes ou livrables

Statuts decisions : PROPOSEE, A VALIDER, VALIDEE, REJETEE, REMPLACEE.

## Sortie chat

Appliquer `rules/domains/architect-chat.md` section **0 (filtre lecteur)** : langage metier, pas d'IDs DEC/PROP, pas d'historique de remplacement, pas de chemins ni versions de livrables. Les tableaux de `commands/architect-status.md` decrivent la lecture INDEX, pas l'affichage chat.

Ne pas lister tous les fichiers du repo.
