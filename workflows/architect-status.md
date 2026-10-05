# Workflow — kagents architect:status

## Objectif

Vue **read-only** de l'etat documentaire Architect (pas d'audit repo complet).

## Enchainement

1. `agents/architect.md` + invariants
2. Skill `architect-status`
3. Chat : format pilotage (pas de livrable persistant obligatoire)

## Lecture (ordre)

1. `.kagents/docs/architect-docs/INDEX.md`
2. `decisions/` (fichiers DEC-*.md)
3. `proposals/` si present
4. Derniers chemins cites dans INDEX (outputs) — lire entete/metadonnees seulement si necessaire
5. Code : **uniquement** si incohérence documentaire a verifier

Principe : lire peu, synthetiser juste.
