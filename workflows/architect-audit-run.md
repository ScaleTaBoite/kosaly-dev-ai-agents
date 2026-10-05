# Workflow — kagents architect:audit

## Objectif

Auditer l'architecture **existante** (derive, ecart doc/code, couplage) — pas modifier le code.

## Enchainement

1. `agents/architect.md` + invariants
2. `architect-audit` — scope = argument commande si present
3. Documenter findings observes uniquement
4. `architect-write-output` → `outputs/audits/`, type `audit`
5. `architect-index`
6. Chat : `architect-chat.md`
