# ScaleTaBoite Engineering Harness

Socle interne versionné pour faire travailler des agents IA (Cursor, Claude Code, etc.) de manière cohérente sur plusieurs projets.

Le **projet client** porte son état et ses décisions (`STATE.md`, schéma, ADR, `.kagents/docs/`, etc.).  
Ce dépôt fournit règles, skills, workflows, templates, commandes `kagents` et garde-fous — **sans** dupliquer le métier ni le code applicatif du client.

Guide de maintenance de ce repo : [AGENTS.md](AGENTS.md).

## Principes

1. **Une source de vérité par type** — standards vs rules vs skills vs workflows vs agents.
2. **Contexte minimal** — lire uniquement ce qui sert la tâche.
3. **Proposition ≠ décision** — une recommandation Architect reste une proposition tant qu’un humain ne l’a pas enregistrée (`architect:decision`).
4. **Adapter, pas copier le canon** — le harness n’est pas versionné dans le repo client ; l’installation crée des liens symboliques.

## Structure du harness

| Dossier | Rôle |
|---------|------|
| `governance/` | Matrice auto / proposition / validation humaine / interdit |
| `standards/` | Référence entreprise (chargée à la demande) |
| `rules/` | Règles courtes actionnables |
| `skills/` | Procédures spécialisées (`SKILL.md`) |
| `agents/` | Rôles canoniques (indépendants de l’IDE) |
| `workflows/` | Enchaînements et niveaux d’impact |
| `commands/` | Entrées utilisateur `kagents` (Architect, Base) |
| `templates/` | Formats à copier ou à lier dans un repo projet |
| `checklists/` | Contrôles de revue |
| `scripts/` | Vérifications déterministes |
| `adapters/` | Intégration par environnement (Cursor, etc.) |
| `docs/` | Documentation humaine |

Documentation utile :

- [docs/overview.md](docs/overview.md) — canon vs projet
- [docs/conventions.md](docs/conventions.md) — nommage et frontières
- [docs/architect-commands.md](docs/architect-commands.md) — contrat des commandes Architect

## Agents et commandes

Les commandes publiques sont définies dans `commands/*.md`. Les skills correspondantes restent **internes** (non exposées comme CLI).

### Architect / Spec

Racine officielle : **`kagents architect`** (pas `kagents architecture`).

| Commande | Rôle |
|----------|------|
| `kagents architect` | Architecture **observée** (existant) |
| `kagents architect:impact "<demande>"` | Impact d’une évolution (L0–L3 Architect) |
| `kagents architect:spec "<fonctionnalité>"` | Spécification exploitable |
| `kagents architect:design "<objectif>"` | Architecture **cible** (proposition) |
| `kagents architect:audit [scope]` | Audit documentaire / structure |
| `kagents architect:status` | **État du projet** — lecture INDEX, décisions, propositions (read-only) |
| `kagents architect:decision "<texte>"` | **Décision humaine** enregistrée (`decisions/DEC-XXX-*.md`) |

Extension préparée : `kagents architect:compare` (stub).

Rôle canon : [agents/architect.md](agents/architect.md).

### Database Architect (Base)

Hors périmètre des évolutions Architect ci-dessus. Commandes : `base-audit`, `base-design`, `base-evolve` — voir `commands/base-*.md` et [agents/database_expert.md](agents/database_expert.md).

## Espace documentaire projet (`.kagents/docs/`)

Installé par [adapters/cursor/install.sh](adapters/cursor/install.sh) dans le **repo client** :

```text
.kagents/docs/
├── architect-docs/
│   ├── INDEX.md              # registre de navigation
│   ├── outputs/              # livrables (architecture, features, impacts, specs, designs, audits)
│   ├── decisions/              # DEC-001, DEC-002, … (décisions validées / rejetées / remplacées)
│   └── proposals/              # propositions Architect (historique, non supprimées)
├── base-docs/                  # réservé Database Architect
└── knowledge/
    └── context.md              # intention projet (local, non écrasé à l’install)
```

Ne pas éditer les fichiers **liés** depuis le client : modifier le harness puis relancer l’install.

## Consommation dans un projet

1. Placer le harness (submodule ou copie) et définir `HARNESS_ROOT`.
2. Depuis la racine du repo projet :

```bash
HARNESS_ROOT=chemin/vers/engineering-harness ./chemin/vers/engineering-harness/adapters/cursor/install.sh
```

3. Travailler via les commandes `kagents` et les rèles dans `.cursor/` (liens vers le canon).

Détails Cursor : [adapters/cursor/README.md](adapters/cursor/README.md).

## Version

Voir [VERSION](VERSION). Tag semver sur `main` à chaque release du harness.
