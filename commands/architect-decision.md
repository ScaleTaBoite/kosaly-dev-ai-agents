---
description: Architect — enregistrer une decision humaine explicitement fournie
---
Lis `agents/architect.md`.

Commande : **`kagents architect:decision "<decision>"`**.

Le argument utilisateur **est** la decision a enregistrer (confirmation humaine implicite via la commande). Ce n'est pas une question a resoudre.

Skill : `architect-decision`.
Workflow : `workflows/architect-decision.md`.
Template : `templates/architect-decision/template.md`.
Cible : `.kagents/docs/architect-docs/decisions/DEC-XXX-<slug>.md`

Statut par defaut : **VALIDEE**. Ne jamais promouvoir une PROPOSITION agent sans cette commande.

Decision a enregistrer : $ARGUMENTS
