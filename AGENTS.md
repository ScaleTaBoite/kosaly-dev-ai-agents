# Engineering Harness — guide agent (maintenance de ce repo)

Tu travailles dans le **socle Engineering Harness** ScaleTaBoite, pas dans un projet client.

## Principes

1. Une source de verite par type de contenu : agents (qui), skills (comment), commandes (point d'entree).
2. Contexte minimal : lire uniquement les fichiers pertinents a la tache.
3. Pas de decision architecturale silencieuse : ADR / Change Brief dans le **repo projet**.
4. Preferer un script deterministe a un raisonnement LLM pour les verifications repetables.

## Gouvernance

Respecter `governance/actions.yaml`. En cas de doute sur une action sensible, **proposer** et attendre validation humaine.

## Ou trouver quoi

| Besoin | Emplacement |
|--------|-------------|
| Procedure | `skills/<nom>/SKILL.md` |
| Role specialise | `agents/` |
| Type de travail | `workflows/impact-levels.yaml` (Architect) |
| Installation | `install.sh`, `adapters/<outil>/` |
| Commandes | `commands/` (prefixe par agent : `base-*`) |

## Modifier ce repo

- Nouvelle skill = un dossier avec `SKILL.md` (frontmatter `name`, `description`).
- Nouvel outil = dossier `adapters/<outil>/install.sh` s'appuyant sur `adapters/_lib.sh` (liens relatifs depuis `.kagents/`), pas de canon dans `.cursor/` ou `.claude/` a la racine.
- Agent = frontmatter `name`, `docs` (espace `docs/<agent>-docs/`), `description` ; commande = frontmatter `description`, `agent`, `mode`, `triggers`.
