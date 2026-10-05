---
description: Architect — concevoir une architecture cible (proposition)
agent: architect
mode: Architecture cible
triggers: conçois l'architecture cible, propose une architecture
---
Lis le role Architect.

Commande : **`kagents architect:design "<objectif>"`**.

Distinction : `kagents architect` = observe ; `kagents architect:design` = **cible proposee** (PROPOSITION, pas decision).

Skills internes : `architect-discovery` (existant), `architect-write-output`, `architect-index`.

Workflow : `workflows/architect-design.md`.
Template : `templates/architect-design/template.md`.

Objectif : $ARGUMENTS
