---
name: audit-repository
description: >-
  Cartographie un projet existant ou un codebase avant changement (situation B,
  ou A avec code deja present). Stack, modules, flux, ADR, zones protegees.
  Sortie synthese pour Architect Analysis ou onboarding.
---

# Audit repository

## Quand utiliser

- **Projet existant** : onboarding, audit initial, avant grosse feature (situation **B**).
- **Nouveau projet** avec code deja present (legacy, template, fork) — situation **A** partielle.
- Avant `feature-analysis` si l'agent ne connait pas la structure du repo.

Ne pas remplacer une exploration exhaustive : produire une **synthese actionnable** pour l'Architect.

## Prerequis

- Racine du repo projet identifiee.
- Lire d'abord les artefacts projet avant le code.

## Fichiers a lire (ordre)

1. `AGENTS.md`, `STATE.md`, `project.yaml`
2. `business-rules.md`, `glossary.md`, `schema.yaml`, `debt.yaml` (si present)
3. ADR dans le repo (souvent `docs/adr/` ou racine — chercher `ADR` par nom, limiter aux 5–10 plus recents ou pertinents)
4. Manifestes stack : `package.json`, `composer.json`, `catalyst.json`, README projet, configs deploy — **ceux presents uniquement**
5. Code : arborescence de premier niveau + dossiers mentionnes dans STATE/debt ; approfondir seulement les zones liees a la demande courante

Harness : `workflows/existing-project.md` pour alignement processus.

## Etapes

1. **Stack** : langages, frameworks, hebergement (dont Catalyst si indices).
2. **Architecture actuelle** : decoupage modules / couches en 5–15 lignes max.
3. **Flux principaux** touches ou a risque (si demande connue) ; sinon flux generiques entree/sortie.
4. **Decisions** : ADR acceptees resumees ; contradictions possibles avec la demande.
5. **Zones protegees** : depuis `STATE.md` ou deduction explicite *hypothesis*.
6. **Fichiers / composants cles** : liste courte avec role (pas dump de tree).
7. **Dette** : pointer `debt.yaml` ou observations majeures si visibles sans lire tout le code.
8. Integrer les findings dans **Architect Analysis** → sections Context, Found, Artifacts.

## Resultat attendu

- Section **Found** et **Artifacts** de l'Architect Analysis remplies.
- **Next Step** : feature-analysis, architecture-impact, ou write-change-brief selon la demande suivante.

## Limites

- Pas de refactoring propose dans l'audit.
- Pas de revue securite complete (signaler surfaces evidentes seulement).
