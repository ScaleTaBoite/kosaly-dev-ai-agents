# Vue d'ensemble

Le Engineering Harness sépare :

- **Canon** (ce repo) : règles, skills, agents, workflows, commandes `kagents`, templates.
- **Projet** (repo client) : état, métier, schéma, ADR, `.kagents/docs/` (livrables Architect, décisions `DEC-XXX`, contexte).

Les adapters (`adapters/`) exposent le canon vers un IDE ou un agent sans en faire la source conceptuelle.

Point d’entrée humain :

- [README.md](../README.md) — structure et installation
- [architect-commands.md](architect-commands.md) — contrat `kagents architect*`
- [adapters/cursor/README.md](../adapters/cursor/README.md) — liens Cursor + arborescence `.kagents/`
