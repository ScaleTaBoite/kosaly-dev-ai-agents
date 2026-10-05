# Workflow — Architect mode Impact

Commande : **`kagents architect:impact "<demande>"`** (voir `commands/architect-impact.md`).

## Objectif

Analyser l'impact d'une evolution avant developpement.

## Enchainement

1. `agents/architect.md` + invariants
2. `architect-audit` si repo ou domaine peu connu
3. `architect-impact` (procedure complete)
4. `architect-write-output` → `outputs/features/` (evolution fonctionnelle) ou `outputs/impacts/` (impact general)
5. `architect-index`
6. Chat : `rules/domains/architect-chat.md`

## Handoff

Document persistant → Base (Database Expert) si Modele concerne → Developer (mention only, role hors perimetre).
