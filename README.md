# KAgents

Kit d'agents IA d'ingénierie, installable dans n'importe quel projet. Il fonctionne avec Claude Code, Cursor et tout outil qui lit `AGENTS.md`.

- **Agent** : qui (identité, règles, modes).
- **Skill** : comment (procédure réutilisable).
- **Commande** : point d'entrée qui lance un agent dans un mode.

## Principes

1. **Une source de vérité par type** : agents, skills, commandes, workflows, standards.
2. **Contexte minimal** : lire uniquement ce qui sert la tâche.
3. **Proposition ≠ décision** : une recommandation de l'Architect reste une proposition tant qu'un humain ne l'a pas enregistrée (`/architect-decision`).
4. **Source unique** : tout vit dans `.kagents/` ; les dossiers des outils ne contiennent que des liens relatifs.
5. **Chaque agent n'écrit que dans son espace** : `.kagents/docs/<agent>-docs/`.

## Agents et commandes

Les commandes sont définies dans `commands/*.md`. Les skills correspondantes sont internes : on invoque une commande, pas une skill.

### Architect

Comprend l'architecture, prépare les changements et laisse des livrables persistants. Contrat complet : [docs/architect-commands.md](docs/architect-commands.md). Rôle : [agents/architect.md](agents/architect.md).

| Commande | Rôle |
|----------|------|
| `/architect` | Architecture **observée** (existant) |
| `/architect-impact "<demande>"` | Impact d'une évolution (L0–L3) |
| `/architect-spec "<fonctionnalité>"` | Spécification exploitable |
| `/architect-design "<objectif>"` | Architecture **cible** (proposition) |
| `/architect-audit [scope]` | Audit de l'architecture existante |
| `/architect-status` | État du projet, en lecture seule |
| `/architect-decision "<texte>"` | Décision **humaine** enregistrée (`decisions/DEC-XXX-*.md`) |

`/architect-compare` est préparée mais pas encore implémentée.

### Base

Conçoit, audite et fait évoluer la base de données. Rôle : [agents/database_expert.md](agents/database_expert.md).

| Commande | Rôle |
|----------|------|
| `/base-design` | Modèle de données d'un nouveau projet |
| `/base-audit` | Audit d'une base existante |
| `/base-evolve` | Impact d'une fonctionnalité sur la base |

## Installation dans un projet

Prérequis : Node 18 ou plus. Depuis la racine du projet :

```bash
npx @dev-kosaly/kagents            # ou : pnpm dlx @dev-kosaly/kagents
npx @dev-kosaly/kagents --tools claude,cursor,agents   # sans question
npx @dev-kosaly/kagents --configure                    # rechoisir les outils
npx @dev-kosaly/kagents --copy     # copies au lieu de liens (utile sous Windows)
npx @dev-kosaly/kagents uninstall
```

Ajouter le paquet comme dépendance (`npm add @dev-kosaly/kagents` ou `pnpm add @dev-kosaly/kagents`) lance aussi l'installation automatiquement. Avec **pnpm**, les scripts des dépendances sont bloqués tant qu'ils ne sont pas approuvés : lancez `pnpm approve-builds` une fois (ou `pnpm exec kagents` à la main). `KAGENTS_SKIP_POSTINSTALL=1` désactive l'installation automatique.

Dans un terminal, l'installation pose la question :

```text
? Pour quels outils installer KAgents ?  (↑↓ espace a entrée)
 ❯ ◉ Claude Code  (.claude/commands, .claude/agents)
   ◯ Cursor  (.cursor/commands, .cursor/agents, .cursor/rules)
   ◉ Codex et autres outils AGENTS.md  (.agents/skills)
```

Le choix est mémorisé dans `.kagents/config.json` et rejoué aux mises à jour. Sans terminal (CI) ou avec `--yes`, les outils sont détectés automatiquement (`.claude/`, `.cursor/`) et `.agents/skills/` est ajouté.

Ce que fait l'installation :
- Le kit est copié dans `.kagents/`. `.claude/` et `.cursor/` reçoivent des liens relatifs vers les commandes et les agents (les skills restent dans `.kagents/skills/` pour ne pas polluer le menu `/`) ; `.agents/skills/` expose les skills aux outils qui le lisent.
- Le bloc `<!-- kagents:start/end -->` de `AGENTS.md` est régénéré (mode d'emploi, agents, routage). Le reste du fichier n'est jamais modifié.
- `.gitignore` reçoit un bloc `# kagents:start/end` qui ignore le kit dans `.kagents/` mais pas `.kagents/docs/` (livrables et contexte, à versionner).
- Un fichier existant qui n'est pas géré par KAgents n'est jamais écrasé.

**Mise à jour** : relancer avec `@latest`. Les fichiers du kit dans `.kagents/` sont régénérés (ne pas les éditer). `.kagents/docs/`, qui contient les livrables des agents et `knowledge/context.md`, n'est jamais touché.

### Espace documentaire du projet

```text
.kagents/docs/
├── architect-docs/
│   ├── INDEX.md          # registre de navigation
│   ├── outputs/          # livrables (architecture, features, impacts, specs, designs, audits)
│   ├── decisions/        # DEC-001, DEC-002… (validées, rejetées ou remplacées)
│   └── proposals/        # propositions de l'Architect (historique conservé)
├── base-docs/            # livrables de Base (db/)
└── knowledge/
    └── context.md        # intention du projet (écrit par l'utilisateur, jamais écrasé)
```

## Structure du dépôt

| Dossier | Rôle |
|---------|------|
| `bin/kagents.js` | Installateur (Node, sans dépendance) |
| `agents/` | Les agents |
| `skills/` | Les procédures (`SKILL.md`) |
| `commands/` | Les points d'entrée (préfixe par agent : `base-*`, `architect*`) |
| `workflows/` | Enchaînements et niveaux d'impact |
| `templates/` | Formats de livrables (ADR, décisions, spécifications…) |
| `rules/` | Règles courtes actionnables |
| `checklists/`, `governance/` | Contrôles de revue et matrice des actions sensibles |
| `docs/` | Contrat des commandes Architect |
| `adapters/` | Documentation des outils pris en charge |
| `scripts/` | Test de fumée de l'installateur |

Voir [adapters/README.md](adapters/README.md). Développement : `npm test`.

## Licence

Usage libre, modification interdite. Voir [LICENSE](LICENSE).
