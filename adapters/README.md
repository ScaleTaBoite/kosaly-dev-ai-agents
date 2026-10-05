# Outils pris en charge

Déclarés dans `ADAPTERS` de `bin/kagents.js`. Le kit est copié dans `.kagents/` ; chaque outil reçoit des **liens relatifs** (des copies avec `--copy`, ou si les liens sont impossibles). Ce que KAgents place est listé dans `.kagents/.installed`.

| Outil | Placé dans le projet |
|-------|----------------------|
| `claude` | `.claude/commands`, `skills`, `agents` |
| `cursor` | `.cursor/commands`, `skills`, `agents` |
| `agents` | `.agents/skills` (standard ouvert ; toujours installé en mode `auto`) |

Les agents sans frontmatter `name:` ne sont pas exposés aux outils.

Ajouter un outil : une entrée dans `ADAPTERS` (`[dossier du kit, destination, files|dirs|agents]`), puis mettre ce tableau à jour.
