# Adapter Cursor

Expose le harness vers `.cursor/rules`, `.cursor/skills`, `.cursor/agents` **dans le repo projet** (ou ce repo si maintenance du harness).

## Prerequis

- Harness disponible (submodule ou copie), chemin connu : `HARNESS_ROOT`.

## Installation

Depuis la **racine du repo projet** :

```bash
HARNESS_ROOT=tools/engineering-harness ./tools/engineering-harness/adapters/cursor/install.sh
```

Ou depuis ce repo (maintenance du harness) :

```bash
HARNESS_ROOT=. ./adapters/cursor/install.sh
```

## Comportement

`install.sh` cree des liens symboliques relatifs vers le canon. Ne pas editer les copies dans `.cursor/` : modifier le harness puis re-lancer l'install.

## Ce repo

Pas de dossier `.cursor/` versionne a la racine du harness : evite de confondre canon et integration.
