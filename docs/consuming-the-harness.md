# Consommer le harness dans un projet

1. Ajouter ce repository au projet (submodule recommande, ex. `tools/engineering-harness/`).
2. Generer les artefacts projet depuis `templates/project/` (skill ou script a venir).
3. Installer l'adapter Cursor : voir `adapters/cursor/README.md`.
4. Choisir un workflow dans `workflows/` et le niveau d'impact dans `workflows/impact-levels.yaml`.
5. Travailler en lisant d'abord les fichiers du **repo projet** (`STATE.md`, Change Brief, etc.).

Les donnees propres au projet ne sont jamais commitees dans le harness central.
