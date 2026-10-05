---
name: architect-audit
description: >-
  Audit cible du repository avant analyse d'impact : stack, composants, ADR,
  zones sensibles. Alimente Constats et Elements etablis du livrable.
---

# Architect audit

## Quand utiliser

- Mode Impact sur repo ou domaine peu connu.
- Etape 3–4 de `architect-impact` si les constats sont insuffisants.

## Lecture

Ordre (aligne `agents/architect.md`) : decisions validees ; docs metier projet si presentes ; livrables Architect + `INDEX.md` ; `base-docs/` lecture seule ; `knowledge/context.md` ; code cible ; config non sensible ; standards harness si besoin.

Signaler absences (STATE, schema, etc.) — ne pas creer.

## Etapes

1. Stack et decoupage (synthese actionnable).
2. Composants et fichiers **directement** lies a la demande.
3. Dependances et flux pertinents.
4. Documentation architecturale existante : coherence avec code.
5. Renseigner sections Constats / Architecture actuelle du template.

## Limites

Pas de refactoring propose. Pas d'ecriture base-docs.
