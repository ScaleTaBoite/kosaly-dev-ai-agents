# KAgents

Kit d'agents IA d'ingénierie, installable dans n'importe quel projet. Il fonctionne avec Claude Code, Cursor et tout outil qui lit `AGENTS.md`.

- **Agent** : qui (identité, règles, modes).
- **Skill** : comment (procédure réutilisable).
- **Commande** : point d'entrée qui lance un agent dans un mode.

## Agents

| Agent | Rôle | Commandes |
|-------|------|-----------|
| **Base** | Conçoit, audite et fait évoluer la base de données | `/base-design`, `/base-audit`, `/base-evolve` |
| **Architect** | Cadre une demande avant implémentation (impact, niveau L0–L3, Change Brief) | `/arch-design`, `/arch-audit`, `/arch-feature` |

Chaque agent n'écrit que dans son propre espace, `.kagents/docs/<agent>-docs/`.

## Installation dans un projet

Prérequis : Node 18 ou plus. Depuis la racine du projet :

```bash
npx @dev-kosaly/kagents            # ou : pnpm dlx @dev-kosaly/kagents
npx @dev-kosaly/kagents --tools claude,cursor,agents
npx @dev-kosaly/kagents --copy     # copies au lieu de liens (utile sous Windows)
npx @dev-kosaly/kagents uninstall
```

Par défaut, le kit détecte les outils présents (`.claude/`, `.cursor/`) et branche aussi `.agents/skills/`.

Ce que fait l'installation :
- Le kit est copié dans `.kagents/`, qui est la source unique. `.claude/`, `.cursor/` et `.agents/` ne contiennent que des liens relatifs.
- Le bloc `<!-- kagents:start/end -->` de `AGENTS.md` est régénéré (mode d'emploi, agents, routage). Le reste du fichier n'est jamais modifié.
- Un fichier existant qui n'est pas géré par KAgents n'est jamais écrasé.

**Mise à jour** : relancer avec `@latest`. Les fichiers du kit dans `.kagents/` sont régénérés (ne pas les éditer). `.kagents/docs/`, qui contient les livrables des agents et `knowledge/context.md`, n'est jamais touché.

## Structure du dépôt

| Dossier | Rôle |
|---------|------|
| `bin/kagents.js` | Installateur (Node, sans dépendance) |
| `agents/` | Les agents |
| `skills/` | Les procédures (`SKILL.md`) |
| `commands/` | Les points d'entrée (préfixe par agent : `base-*`, `arch-*`) |
| `workflows/`, `templates/`, `checklists/`, `governance/` | Support de l'agent Architect |
| `adapters/` | Documentation des outils pris en charge |
| `scripts/` | Test de fumée de l'installateur |

Voir [adapters/README.md](adapters/README.md) pour ajouter un outil. Développement : `npm test`.

## Licence

Usage libre, modification interdite. Voir [LICENSE](LICENSE).
