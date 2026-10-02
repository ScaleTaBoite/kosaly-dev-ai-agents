# Adapter Cursor

Expose le harness dans le **repo projet** :

| Chemin | Role |
|--------|------|
| `.cursor/rules`, `.cursor/skills`, `.cursor/agents` | Integration Cursor (liens vers le canon) |
| `.kagents/docs/` | Arborescence documentaire de reference du projet |

Structure `.kagents/` installee :

```text
.kagents/
└── docs/
    ├── architect-docs/   # liens vers architect.md, skills Architect, templates ADR / Change Brief
    ├── base-docs/        # reserve (vide a l'install)
    └── knowledge/
        └── context.md    # cree si absent (contenu local projet, non ecrase)
```

Le harness source (`HARNESS_ROOT`) n'est jamais copie : uniquement des **liens symboliques** relatifs (aucun `.git` du harness dans le client).

## Prerequis

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

- `.cursor/` : liens vers `rules/`, `skills/`, `agents/` du harness (re-lancer apres mise a jour du harness).
- `.kagents/docs/architect-docs/` : liens vers le role Architect et ses quatre skills + templates harness.
- `.kagents/docs/base-docs/` : repertoire cree, sans contenu harness dedie.
- `.kagents/docs/knowledge/context.md` : modele minimal si le fichier n'existe pas deja.

Ne pas editer les fichiers **lies** dans `architect-docs/` : modifier le harness puis re-lancer l'install.

## Ce repo harness

Pas de `.cursor/` ni `.kagents/` versionnes a la racine du canon.
