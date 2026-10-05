# Adapters

Couche d'integration par outil. Le canon est copie par `install.sh` dans `.kagents/` du projet ; chaque adapter y cree des **liens relatifs** (ou des copies avec `KAGENTS_MODE=copy`) et enregistre ce qu'il place dans `.kagents/.installed`. Un fichier utilisateur existant n'est jamais ecrase.

| Adapter | Place dans le projet |
|---------|----------------------|
| `claude/` | `.claude/commands`, `skills`, `agents` |
| `cursor/` | `.cursor/commands`, `skills`, `agents` |
| `agents/` | `.agents/skills` (standard ouvert, toujours installe en mode `auto`) |

Les agents sans frontmatter `name:` ne sont pas exposes aux outils.

Ajouter un outil : creer `adapters/<outil>/install.sh` (une dizaine de lignes) avec `source ../_lib.sh` puis `place_all` / `place_agents`. Fonctions : voir `_lib.sh`.
