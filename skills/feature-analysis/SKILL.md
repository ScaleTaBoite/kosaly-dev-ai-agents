---
name: feature-analysis
description: >-
  Analyse une nouvelle fonctionnalite ou modification fonctionnelle avant
  implementation. Utiliser pour situation C (feature) ou clarification de
  demande sur projet existant. Produit une Architect Analysis ou alimente
  write-change-brief.
---

# Feature analysis

## Quand utiliser

- Nouvelle fonctionnalite ou evolution d'une existante (situation **C**).
- Demande ambigue necessitant cadrage avant dev.
- **Ne pas** utiliser seul pour L0 correctif trivial (workflow `bug-local.md`) : renvoyer Developer sauf doute sur le niveau.

## Prerequis

- Demande utilisateur ou ticket identifiable.
- Repo projet accessible avec artefacts de base (`STATE.md` ideal).

## Fichiers a lire (minimal, puis elargir si besoin)

1. Projet : `AGENTS.md`, `STATE.md`, `business-rules.md`, `glossary.md`
2. ADR / Change Brief ouverts lies au sujet
3. `schema.yaml` si la demande touche donnees ou entites metier
4. Code : uniquement modules, routes, ecrans ou APIs **nommes** dans la demande ou deduits apres premiere passe

References harness : `agents/architect.md`, `workflows/impact-levels.yaml`.

## Etapes

1. **Goal** : objectif, utilisateurs, resultat attendu cote utilisateur.
2. **Perimetre** : in scope / out of scope explicites.
3. **Regles metier** : extraire de `business-rules.md` et glossary ; signaler lacunes (questions ou hypotheses).
4. **Entites et dependances** : noms metier ; pas de schema detaille — noter « Database Architect si L2+ ».
5. **Existant** : composants, flux, API deja en place a reutiliser ; zones protegees (`STATE.md`).
6. **Simplicite** : solution minimale ; justifier toute nouvelle couche/table/service.
7. Invoquer **`architecture-impact`** pour Impact + niveau L0–L3.
8. Remplir le format **Architect Analysis** (`agents/architect.md`).
9. Si L2+ ou changement significatif L1 : enchainer **`write-change-brief`**.

## Resultat attendu

- **Architect Analysis** complete (sections vides ou N/A si non pertinent).
- Liste de **questions metier** seulement si bloquantes.
- **Next Step** clair (ex. validation Change Brief, Database Architect, Developer).

## Standards / rules

Charger `standards/` uniquement si le sujet l'exige (securite, catalyst). Index : `standards/README.md`.
