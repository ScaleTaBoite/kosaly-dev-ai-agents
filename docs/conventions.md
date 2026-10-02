# Conventions

## Nommage

- Dossiers et fichiers : `kebab-case` (sauf `AGENTS.md`, `README.md`, `SKILL.md`, `VERSION`).
- Skills : un dossier par skill, fichier obligatoire `SKILL.md`.
- Agents : un fichier `.md` par role dans `agents/`.
- Rules : fichiers `.md` dans `rules/` ; variantes Cursor `.mdc` generees ou liees via l'adapter.

## Langue

- Rules, agents, skills : anglais recommande (compatibilite modeles).
- Docs humaines et templates projet : francais ou anglais selon le projet.

## Frontières

| Type | Contient |
|------|----------|
| `standards/` | Reference longue, normative |
| `rules/` | Regles courtes + liens vers standards |
| `skills/` | Procedure pas a pas |
| `agents/` | Mission et limites d'un role |
| `workflows/` | Enchainement d'etapes et niveau d'impact |
| `checklists/` | Cases a cocher |
| `scripts/` | Logique deterministe |

Ne pas melanger workflow complet dans une rule ni procedure dans `AGENTS.md`.
