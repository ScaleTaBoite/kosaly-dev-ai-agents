# Workflow — kagents architect:decision

## Objectif

Enregistrer une **decision humaine** (argument utilisateur = texte a enregistrer, pas a debattre).

## Gouvernance

- L'agent **ne valide pas** seul une recommandation : la commande implique confirmation humaine explicite.
- Statut par defaut a l'enregistrement : **VALIDEE** (sauf indication contraire dans la commande : « rejet », « remplace DEC-00X »).

## Enchainement

1. `agents/architect.md` + invariants
2. Skill `architect-decision`
3. Chat : synthese (ID, statut, chemin) — pas recopie integrale

## Remplacement

Nouveau fichier DEC-YYY ; ancien fichier mis a jour statut **REMPLACEE** + lien `Remplace par : DEC-YYY` — jamais supprimer l'ancien.
