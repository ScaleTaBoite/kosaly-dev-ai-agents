# Outils pris en charge

Déclarés dans `ADAPTERS` de `bin/kagents.js`. Le kit est copié dans `.kagents/` ; chaque outil reçoit des **liens relatifs** (des copies avec `--copy`, ou si les liens sont impossibles). Ce que KAgents place est listé dans `.kagents/.installed`.

| Outil | Placé dans le projet |
|-------|----------------------|
| `claude` | `.claude/commands`, `agents` |
| `cursor` | `.cursor/commands`, `agents`, `rules` |
| `agents` | `.agents/skills` (standard ouvert ; toujours installé en mode `auto`) |

Les skills ne sont pas liées dans `.claude/` ni `.cursor/` : ces outils les afficheraient comme des commandes `/`. Elles sont chargées par chemin (`.kagents/skills/`) par les agents.

Les agents sans frontmatter `name:` ne sont pas exposés aux outils.

Ajouter un outil : une entrée dans `ADAPTERS` (`[dossier du kit, destination, files|dirs|agents]`), puis mettre ce tableau à jour.
