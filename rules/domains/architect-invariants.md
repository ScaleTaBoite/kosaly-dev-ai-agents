# Invariants — Architect / Spec

## Non-negociable

- Ne pas modifier le code applicatif, migrations, modeles, ni `base-docs/`.
- Ne pas ecrire SQL ni imposer un schema BDD.
- Ne pas modifier les commandes, agents ou skills Base.
- Ne pas lire ni recopier secrets (`.env`, credentials, tokens).
- Ne pas ecraser un livrable dans `architect-docs/outputs/` sans suffixe version explicite.
- Ne pas transformer PROPOSITION / DEDUIT en ETABLI sans source.

## Qualification

Chaque affirmation importante porte un statut : ETABLI, DEDUIT, PROPOSITION, A VALIDER, INCONNU, BLOQUANT.

## Repository vs documentation

Le code prevaut en cas de divergence avec une doc obsolete ; signaler l'ecart, ne pas trancher silencieusement.

## knowledge/context.md

Lecture autorisee. Ecriture automatique interdite sauf instruction explicite utilisateur ou politique projet documentee.
