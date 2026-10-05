---
name: architect-write-output
description: >-
  Ecrit le livrable Markdown dans .kagents/docs/architect-docs/outputs/ avec
  nommage deterministe YYYY-MM-DD__type__slug__vN.md sans ecrasement silencieux.
---

# Architect write output

## Repertoires

| Type | Sous-dossier |
|------|----------------|
| architecture | `outputs/architecture/` |
| impact | `outputs/impacts/` |
| feature | `outputs/features/` |
| spec | `outputs/specs/` |
| design | `outputs/designs/` |
| audit | `outputs/audits/` |

**Choix du sous-dossier**

- `architecture/` : `kagents architect`.
- `features/` : evolution fonctionnelle (`architect:impact` focalise feature).
- `impacts/` : `architect:impact` transversal sans focalisation feature.
- `specs/` : `architect:spec`.
- `designs/` : `architect:design`.
- `audits/` : `architect:audit`.

Creer les dossiers si absents.

## Nom de fichier

`YYYY-MM-DD__<type>__<slug-kebab>__vN.md`

- `slug` : sujet metier court (ex. `finance-marge-facture`)
- `vN` : incrementer si un fichier meme date+type+slug existe deja

## Etapes

1. Choisir type et sous-dossier.
2. Verifier collision ; ajuster `vN`.
3. Remplir `templates/architect-output/template.md`.
4. Renseigner Metadonnees.Fichier avec chemin relatif.
5. Ne pas inclure secrets ni SQL/migrations.

## Resultat

Chemin communique dans le chat (section Livrable).
