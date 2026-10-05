# Skills

## Architect / Spec (internes — pas des commandes publiques)

| Skill | Commande publique typique |
|-------|---------------------------|
| `architect-discovery/` | `kagents architect` |
| `architect-audit/` | `kagents architect:audit`, `:impact`, `:spec` |
| `architect-impact/` | `kagents architect:impact`, partie `:spec` |
| `architect-write-output/` | toutes commandes avec livrable |
| `architect-index/` | livrables + registre decisions |
| `architect-status/` | `kagents architect:status` (read-only) |
| `architect-decision/` | `kagents architect:decision` |

Contrat commandes : `docs/architect-commands.md` — fichiers `commands/architect*.md`.

Role : `agents/architect.md`.

## Base (base de données)

| Skill | Rôle |
|-------|------|
| `schema-exploration/` | Explorer le repo et reconstruire le modèle |
| `catalyst-export/` | Exploiter l'export JSON Catalyst |
| `db-analysis/` | Grille d'analyse et sévérités |
| `db-docs/` | Modèles des fichiers de `base-docs/db/` |

Agent : `agents/database_expert.md`.
