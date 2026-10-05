# KAgents

Kit d'agents IA d'ingénierie, installable dans n'importe quel projet. Il fonctionne avec Claude Code, Cursor et tout outil qui lit `AGENTS.md`.

- **Agent** : qui (identité, règles, limites).
- **Skill** : comment (procédure réutilisable, interne).
- **Commande** : point d'entrée que l'utilisateur lance (`/architect-impact`, `/base-audit`…).

## Démarrage rapide

```bash
npx @dev-kosaly/kagents            # à lancer à la racine du projet
```

Puis, dans le chat de l'outil (Cursor, Claude Code), tape la commande suivie de ta demande en langage naturel :

```text
/architect-impact Je veux ajouter la reprise des marges depuis une autre facture
/architect-status
/architect-decision La marge sera figée au moment de la création
```

On invoque une **commande**, jamais une skill. Les commandes sont les fichiers de `commands/` ; les skills sont chargées en interne par l'agent.

## Principes

1. **Une source de vérité par type** : agents, skills, commandes, workflows, standards.
2. **Contexte minimal** : lire uniquement ce qui sert la tâche.
3. **Proposition ≠ décision** : une recommandation de l'Architect reste une proposition tant qu'un humain ne l'a pas enregistrée (`/architect-decision`).
4. **Source unique** : tout vit dans `.kagents/` ; les dossiers des outils ne contiennent que des liens relatifs.
5. **Chaque agent n'écrit que dans son espace** : `.kagents/docs/<agent>-docs/`.
6. **Le chat explique, le livrable documente** : la réponse affichée reste courte et centrée sur la décision ; preuves, identifiants et détails vont dans les documents.

## Agents et commandes

### Architect

Comprend l'architecture, prépare les changements et laisse des livrables persistants. Il ne code pas, ne touche pas au schéma de données et ne prend aucune décision à la place de l'équipe.

| Commande | Rôle | Livrable |
|----------|------|----------|
| `/architect` | Architecture **observée** (existant) | `outputs/architecture/` |
| `/architect-impact "<demande>"` | Impact d'une évolution avant de coder | `outputs/features/` ou `outputs/impacts/` |
| `/architect-spec "<fonctionnalité>"` | Spécification exploitable | `outputs/specs/` |
| `/architect-design "<objectif>"` | Architecture **cible** (proposition) | `outputs/designs/` |
| `/architect-audit [scope]` | Audit de l'architecture existante | `outputs/audits/` |
| `/architect-status` | Où en est le projet (lecture seule) | aucun |
| `/architect-decision "<texte>"` | Enregistre une décision **humaine** | `decisions/DEC-XXX-*.md` |

`/architect-compare` est préparée mais pas encore implémentée.

Comment il travaille :

- **Impact adapté au projet** : pas de grille imposée ; seules les zones réellement touchées sont décrites, avec le vocabulaire du projet.
- **Niveaux L0 à L3** pour qualifier l'ampleur d'un changement ([workflows/architect-impact-levels.yaml](workflows/architect-impact-levels.yaml)).
- **Relais** : chaque livrable indique ce qui doit se passer ensuite (validation, analyse Base, implémentation) pour reprendre sans relire la conversation.
- **Décisions** : `DEC-001`, `DEC-002`… ; jamais supprimées ni écrasées. Une décision remplacée passe en `REMPLACÉE` et reste consultable.
- **Réponses du chat** : naturelles, concises, orientées compréhension et décision ([rules/domains/architect-chat.md](rules/domains/architect-chat.md)).

Contrat complet : [docs/architect-commands.md](docs/architect-commands.md). Rôle : [agents/architect.md](agents/architect.md).

### Base

Conçoit, audite et fait évoluer la base de données. Rôle : [agents/database_expert.md](agents/database_expert.md).

| Commande | Rôle |
|----------|------|
| `/base-design` | Modèle de données d'un nouveau projet |
| `/base-audit` | Audit d'une base existante |
| `/base-evolve` | Impact d'une fonctionnalité sur la base |

### Enchaînement typique

```text
/architect-impact   →  analyse + livrable
/architect-decision →  tu valides ce qui doit l'être
/base-evolve        →  si des données sont concernées
```

## Installation

Prérequis : Node 18 ou plus. Depuis la racine du projet :

```bash
npx @dev-kosaly/kagents                          # ou : pnpm dlx @dev-kosaly/kagents
npx @dev-kosaly/kagents --tools claude,cursor,agents
npx @dev-kosaly/kagents --copy                   # copies au lieu de liens (utile sous Windows)
npx @dev-kosaly/kagents uninstall
```

Le binaire `kagents` **installe et désinstalle** le kit. Les commandes des agents se lancent dans le chat de l'outil, pas dans le terminal.

Ajouter le paquet comme dépendance (`npm add @dev-kosaly/kagents` ou `pnpm add @dev-kosaly/kagents`) lance aussi l'installation. Avec **pnpm**, les scripts des dépendances sont bloqués tant qu'ils ne sont pas approuvés : lancer `pnpm approve-builds` une fois (ou `pnpm exec kagents`). `KAGENTS_SKIP_POSTINSTALL=1` désactive l'installation automatique.

Par défaut, le kit détecte les outils présents (`.claude/`, `.cursor/`) et branche aussi `.agents/skills/`.

Ce que fait l'installation :

- Le kit est copié dans `.kagents/`. `.claude/` et `.cursor/` reçoivent des liens relatifs vers les commandes et les agents (et les règles pour Cursor). Les skills restent dans `.kagents/skills/` pour ne pas polluer le menu `/` ; `.agents/skills/` les expose aux outils qui le lisent.
- Le bloc `<!-- kagents:start/end -->` de `AGENTS.md` est régénéré (mode d'emploi, agents, routage). Le reste du fichier n'est jamais modifié.
- `.gitignore` reçoit un bloc `# kagents:start/end` qui ignore le kit mais pas `.kagents/docs/` (livrables et contexte, à versionner).
- Un fichier existant qui n'est pas géré par KAgents n'est jamais écrasé.

**Mise à jour** : relancer avec `@latest`. Les fichiers du kit dans `.kagents/` sont régénérés (ne pas les éditer). `.kagents/docs/` n'est jamais touché.

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

Les livrables Architect sont nommés `YYYY-MM-DD__<type>__<sujet>__vN.md` ; une nouvelle version n'écrase jamais la précédente. Renseigner `knowledge/context.md` (intention, stack, contraintes) améliore nettement la qualité des analyses.

## Structure du dépôt

| Dossier | Rôle |
|---------|------|
| `bin/` | Installateur `kagents` (Node, sans dépendance) |
| `agents/` | Les agents |
| `skills/` | Les procédures (`SKILL.md`), internes |
| `commands/` | Les points d'entrée (préfixe par agent : `architect*`, `base-*`) |
| `workflows/` | Enchaînements et niveaux d'impact |
| `templates/` | Formats de livrables (ADR, décisions, spécifications…) |
| `rules/` | Règles courtes actionnables (invariants et style de réponse Architect) |
| `checklists/`, `governance/` | Contrôles de revue et matrice des actions sensibles |
| `docs/` | Contrat des commandes Architect |
| `adapters/` | Documentation des outils pris en charge ([adapters/README.md](adapters/README.md)) |
| `scripts/` | Test de fumée de l'installateur |

## Développement

```bash
npm test      # installe le kit dans un projet temporaire et vérifie l'installateur
```

Guide de maintenance : [AGENTS.md](AGENTS.md). Toute modification de l'installateur doit être suivie de `npm test`.

## Licence

Usage libre, modification interdite. Voir [LICENSE](LICENSE).
