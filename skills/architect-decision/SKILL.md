---
name: architect-decision
description: >-
  Interne — kagents architect:decision. Enregistre decision humaine dans
  decisions/DEC-XXX-slug.md, met a jour INDEX, lie propositions/livrables.
---

# Architect decision

## Quand utiliser

- **`kagents architect:decision "<texte>"`** — le texte est la decision a enregistrer (VALIDEE par acte humain de commande).

## Interdictions

- Ne pas marquer VALIDEE une simple recommandation agent non confirmee par cette commande.
- Ne pas ecraser un fichier DEC existant ; ne pas reutiliser un ID.
- Ne pas supprimer propositions ni outputs ; ne pas ecrire base-docs ; pas de SQL/migrations.

## Etapes

1. Interpreter `$ARGUMENTS` comme **Decision** (pas une question).
2. Detecter intent special dans le texte :
   - « remplace DEC-00N » / « remplacement DEC-00N » → creer nouvelle DEC VALIDEE, mettre DEC-00N en **REMPLACEE** + lien.
   - « rejet » / « REJETEE » → statut **REJETEE** si l'utilisateur enregistre un rejet explicite.
3. **Prochain ID** : lister `decisions/DEC-*.md`, prendre max(N)+1 → `DEC-001`, etc.
4. **Slug** : kebab-case court depuis le sujet (ex. `finance-marge-source`).
5. Creer `decisions/DEC-XXX-<slug>.md` depuis `templates/architect-decision/template.md`.
6. Renseigner metadonnees ; **Decideur : Humain** ; Statut **VALIDEE** par defaut.
7. Lier **proposition d'origine** : chercher dans INDEX / dernier livrable pertinent (ex. finance marge v3) — ne pas modifier le livrable sauf ajout optionnel en **References** d'une ligne « Decision : DEC-XXX » en fin de fichier si deja ouvert pour edition ; preferer lien depuis decision vers output.
8. Mettre a jour INDEX section **## Decisions (registre)** (ajouter ligne, ne pas reconstruire tout le fichier).
9. Chat synthese : ID, statut, domaine, chemin, suite.

## Propositions

Conserver fichiers dans `proposals/` et contenu PROPOSITION dans outputs — ajouter dans decision le lien PROPOSITION → DECISION.

## Remplacement

Editer l'ancien fichier : Statut **REMPLACEE**, `Remplace par : DEC-YYY`. Creer DEC-YYY **VALIDEE**.
