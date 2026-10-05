# Contrat des commandes — Architect (public)

Racine officielle : **`kagents architect`** (pas `kagents architecture`).

Les skills `architect-*` sont **internes** ; l'utilisateur invoque une **commande**, pas une skill.

## Priorite 1 — disponibles

| Commande | Role | Workflow | Skills internes | Livrable |
|----------|------|----------|-----------------|----------|
| `kagents architect` | Architecture **observee** (existant) | `workflows/architect-architecture.md` | discovery, write-output, index | `outputs/architecture/` |
| `kagents architect:impact "<demande>"` | Impact d'une evolution | `workflows/architect-impact.md` | audit?, impact, write-output, index | `outputs/features/` ou `outputs/impacts/` |
| `kagents architect:spec "<fonctionnalite>"` | Spec exploitable (comportement attendu) | `workflows/architect-spec.md` | audit?, impact (partie impact), write-output, index | `outputs/specs/` |
| `kagents architect:design "<objectif>"` | Architecture **cible** proposee | `workflows/architect-design.md` | discovery, write-output, index | `outputs/designs/` |
| `kagents architect:audit [scope]` | Audit architecture existante | `workflows/architect-audit-run.md` | audit, write-output, index | `outputs/audits/` |
| `kagents architect:status` | Etat documentaire (read-only) | `workflows/architect-status.md` | architect-status | chat |
| `kagents architect:decision "<texte>"` | Decision **humaine** enregistree | `workflows/architect-decision.md` | architect-decision | `decisions/DEC-XXX-*.md` |

Fichiers entree harness : `commands/architect*.md`.

## Distinctions

- **Impact** : ce que le changement **touche** (zones touchees adaptees au projet, risques, L0–L3).
- **Spec** : ce que la fonctionnalite doit **faire** (comportement, cas, criteres) + reference impact si pertinent.
- **architect** (sans suffixe) : etat **reel** observe.
- **architect:design** : etat **cible** PROPOSITION (jamais decision automatique).
- **architect:status** : synthese **read-only** (INDEX, decisions, proposals, travaux ouverts) — pas d’audit repo complet.
- **architect:decision** : enregistre une decision **explicitement fournie ou confirmee par l’humain** ; statut typique **VALIDEE** ; registre `decisions/DEC-XXX-*.md` + ligne dans INDEX. Une proposition dans `proposals/` ou un livrable n’est **pas** promue en decision sans cette commande.

Statuts decision : PROPOSEE, A VALIDER, VALIDEE, REJETEE, REMPLACEE (remplacement sans suppression du fichier historique).

## Priorite 2 — extension

| Commande | Statut |
|----------|--------|
| `kagents architect:compare "<question>"` | Prepare — workflow a creer |

Fichier : `commands/architect-compare.md`.

## Mode naturel

Formulations sans commande → resolver vers la commande la plus proche (souvent `architect:impact` ou `architect`).

## Database Architect (Base)

**Hors scope.** Commandes inchangees : `commands/base-audit.md`, `base-design.md`, `base-evolve.md`.

## Chaine d'execution

```text
Commande → agents/architect.md → rules/architect-* → workflow → skills → template → livrable → INDEX → chat
```
