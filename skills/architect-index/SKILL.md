---
name: architect-index
description: >-
  Met a jour .kagents/docs/architect-docs/INDEX.md apres un livrable Architect
  (registre navigation, pas rapport).
---

# Architect index

## Fichier

`.kagents/docs/architect-docs/INDEX.md`

Creer depuis `templates/architect-index/INDEX.template.md` si absent.

## Apres chaque livrable

1. Ajouter une ligne dans le tableau appropriate (Architecture / Impacts / Audits).
2. Colonnes : Date, Fichier (lien relatif), Sujet, Niveau, Statut si impact.
3. Mettre a jour **Decisions ouvertes** / **Travaux en cours** si pertinent (listes courtes).
4. Ne pas dupliquer le contenu du livrable dans INDEX.

## Apres chaque decision (`architect-decision`)

1. Ajouter une ligne dans **## Decisions (registre)** : ID, Titre, Statut, Date, Domaine, Lien vers `decisions/DEC-XXX-*.md`.
2. Retirer ou ajuster **Decisions ouvertes** si la decision tranche une question listee.
3. Ne pas reconstruire tout INDEX.md.

## Limites

Ne pas modifier INDEX d'autres domaines (base-docs).
