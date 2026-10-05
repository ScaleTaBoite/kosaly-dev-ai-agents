---
description: Architect — etat documentaire et architectural connu (read-only)
agent: architect
mode: État (lecture seule)
triggers: où en est-on, état des décisions et propositions
---
Lis `agents/architect.md` (ou `.kagents/docs/architect-docs/architect.md`).

Commande : **`kagents architect:status`**.

Skill interne : `architect-status`.
Workflow : `workflows/architect-status.md`.

**Read-only** : pas de nouveau livrable obligatoire ; pas d'audit repo complet.

Sortie chat type :

# Architect — Etat du projet

**Etat architectural :** ...
**Derniere activite :** ...
**Travaux ouverts / Decisions en attente / Blocages** (si presents)

Lecture documentaire (pas affichage chat) : travaux en cours, decisions, relais en attente, points d'attention, derniers livrables. Voir `architect-chat.md` pour la sortie utilisateur.

Argument optionnel (filtre domaine) : $ARGUMENTS
