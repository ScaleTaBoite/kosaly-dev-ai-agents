# ScaleTaBoite Engineering Harness

KAgents : kit d'agents IA d'ingenierie, installable dans un projet (Claude Code, Cursor, tout outil lisant `AGENTS.md`) de maniere coherente sur plusieurs projets.

Le **projet client** porte son etat et ses decisions (`STATE.md`, `schema.yaml`, ADR, etc.).  
Ce repository fournit regles, skills, workflows, templates et garde-fous.

## Structure

| Dossier | Role |
|---------|------|
| `governance/` | Matrice auto / proposition / validation humaine / interdit |
| `standards/` | Reference entreprise (charge a la demande) |
| `rules/` | Regles courtes actionnables |
| `skills/` | Procedures specialisees (`SKILL.md`) |
| `agents/` | Roles canoniques (independants de l'IDE) |
| `workflows/` | Enchainements et niveaux d'impact |
| `templates/` | Formats a copier dans un repo projet |
| `checklists/` | Controles de revue |
| `scripts/` | Verifications deterministes |
| `commands/` | Points d'entree : lancent un agent dans un mode |
| `adapters/` | Integration par outil (`claude`, `cursor`, `agents`) |
| `install.sh` | Installe le kit dans `.kagents/` d'un projet |
| `docs/` | Documentation humaine |

## Version

Voir `VERSION`. Tag semver sur `main` a chaque release du harness.

## Installation dans un projet

Depuis la racine du projet :

```bash
/chemin/vers/kosaly-dev-ai-agents/install.sh [agents,claude,cursor|auto]
```

Le kit est copie dans `.kagents/` (source unique) ; `.claude/`, `.cursor/` et `.agents/` ne contiennent que des liens relatifs (`KAGENTS_MODE=copy` pour des copies). Le bloc `<!-- kagents:start/end -->` de `AGENTS.md` est regenere. Voir [adapters/README.md](adapters/README.md).
