---
name: architect-impact
description: >-
  Interne — commande publique kagents architect:impact. Procedure complete : perimetre,
  zones d'impact adaptees au projet, L0-L3, risques, handoff Base, livrable persistant.
---

# Architect impact

## Quand utiliser

- **`kagents architect:impact "<demande>"`** ou formulations naturelles d'evolution.

## Procedure

Suivre `workflows/architect-impact.md`. Etapes cles (detail dans le workflow) :

1. Objectif, perimetre, `architect-audit` si besoin.
2. Qualifier ETABLI / DEDUIT / PROPOSITION / INCONNU / A VALIDER / BLOQUANT.
3. Niveau L0–L3 via `workflows/architect-impact-levels.yaml` + justification.
4. Zones d'impact : choisir les axes selon le projet et la demande (modules, flux, parcours, donnees, securite, integrations, perf...). Pas de grille fixe ; MVC seulement si l'architecture l'est et si cela clarifie. Ne montrer que les zones touchees, avec le vocabulaire du projet.
5. Proposition, risques, decisions humaines, handoff Base (sans DDL).
6. `architect-write-output` : `features/` si demande fonctionnelle, sinon `impacts/`.
7. `architect-index` puis chat : `rules/domains/architect-chat.md`.

## Questions

Maximum 5 bloquantes ; autres → hypotheses qualifiees.

## BDD

Detecter impact ; preparer handoff ; **ne pas** decider schema, migrations, SQL.
