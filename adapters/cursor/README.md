# Adapter Cursor

Expose le harness dans le **repo projet** :

| Chemin | Rôle |
|--------|------|
| `.cursor/rules`, `.cursor/skills`, `.cursor/agents` | Intégration Cursor (liens vers le canon) |
| `.kagents/docs/` | Arborescence documentaire de référence du projet |

Structure `.kagents/` installée :

```text
.kagents/
└── docs/
    ├── architect-docs/
    │   ├── INDEX.md
    │   ├── command-architect*.md    # entrées kagents (liens)
    │   ├── outputs/                 # architecture, features, impacts, specs, designs, audits
    │   ├── decisions/               # DEC-XXX-<slug>.md
    │   └── proposals/               # propositions Architect (historique)
    ├── base-docs/                   # réservé Database Architect (vide à l’install)
    └── knowledge/
        └── context.md               # créé si absent (contenu local projet, non écrasé)
```

Le harness source (`HARNESS_ROOT`) n’est jamais copié : uniquement des **liens symboliques** relatifs (aucun `.git` du harness dans le client).

## Prérequis

- Harness disponible (submodule ou copie), chemin connu : `HARNESS_ROOT`.

## Installation

Depuis la **racine du repo projet** (ex. harness en submodule `tools/engineering-harness/`) :

```bash
HARNESS_ROOT=tools/engineering-harness ./tools/engineering-harness/adapters/cursor/install.sh
```

Depuis ce repo (maintenance du harness) :

```bash
HARNESS_ROOT=. ./adapters/cursor/install.sh
```

## Comportement

- `.cursor/` : liens vers `rules/`, `skills/`, `agents/` du harness (re-lancer après mise à jour du harness).
- `.kagents/docs/architect-docs/` : rôle, `architect-commands.md`, skills internes Architect, `command-architect*.md`, templates, **`INDEX.md`**, **`outputs/`**, **`decisions/`**, **`proposals/`**.
- Commandes publiques Architect : voir [docs/architect-commands.md](../../docs/architect-commands.md) — notamment **`kagents architect`**, **`:impact`**, **`:spec`**, **`:design`**, **`:audit`**, **`:status`** (read-only), **`:decision`** (décision humaine). Extension préparée : **`:compare`** uniquement.
- Skills liées pour Architect : discovery, audit, impact, write-output, index, **status**, **decision** (internes, pas de commandes `architect:read-status` etc.).
- `.kagents/docs/base-docs/` : répertoire créé, sans contenu harness dédié.
- `.kagents/docs/knowledge/context.md` : modèle minimal si le fichier n’existe pas déjà.

Ne pas éditer les fichiers **liés** dans `architect-docs/` : modifier le harness puis re-lancer l’install.

## Ce repo harness

Pas de `.cursor/` ni `.kagents/` versionnés à la racine du canon.
