# Workflow — Architect mode Architecture

Commande : **`kagents architect`** (voir `commands/architect.md`).

## Objectif

Comprendre et documenter l'architecture **observee** du projet (pas une architecture ideale inventee).

## Enchainement

1. `agents/architect.md` + `rules/domains/architect-invariants.md`
2. Skill `architect-discovery`
3. Skill `architect-write-output` → `.kagents/docs/architect-docs/outputs/architecture/`
4. Skill `architect-index` → mettre a jour `INDEX.md`
5. Chat : contrat `rules/domains/architect-chat.md`

## Livrable

Type : architecture. Niveau typique : L0 (ajuster si l'audit revele un changement planifie).
