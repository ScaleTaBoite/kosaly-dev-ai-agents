# ScaleTaBoite Engineering Harness

Socle interne versionne pour faire travailler des agents IA (Cursor, Claude Code, etc.) de maniere coherente sur plusieurs projets.

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
| `adapters/` | Integration par environnement (Cursor, etc.) |
| `docs/` | Documentation humaine |

## Version

Voir `VERSION`. Tag semver sur `main` a chaque release du harness.

## Consommation dans un projet

Voir [docs/consuming-the-harness.md](docs/consuming-the-harness.md) et [adapters/cursor/README.md](adapters/cursor/README.md).
