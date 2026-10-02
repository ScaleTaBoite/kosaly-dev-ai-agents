---
name: write-change-brief
description: >-
  Redige un Change Brief dans le repository projet a partir d'une Architect
  Analysis. Utiliser pour L2+ ou changement L1 significatif. Template harness
  templates/change-brief/template.md.
---

# Write Change Brief

## Quand utiliser

- **L2 ou L3** (obligatoire processus : `workflows/impact-levels.yaml`).
- **L1** si le changement touche contrat API, regles metier nouvelles, ou equipe exige trace ecrite.
- Apres **`architecture-impact`** (Architect Analysis a jour).

Ne pas confondre avec l'ADR : Change Brief = cadre du changement ; ADR = decision structurante (L3 typiquement), template `templates/adr/template.md`, statut **propose**.

## Prerequis

- Architect Analysis complete ou sections Goal, Impact, Impact Level, Proposal, Decisions, Acceptance Criteria remplies.
- Emplacement projet choisi (convention equipe : ex. `docs/changes/YYYY-MM-DD-titre.md` ou `change-briefs/` — **dans le repo projet**, jamais dans le harness).

## Fichiers a lire

- Harness : `templates/change-brief/template.md`, `governance/actions.yaml`
- Projet : ADR existantes pour liens croises

## Etapes

1. Copier la structure du **template** et adapter le titre.
2. Renseigner metadonnees : niveau L0–L3, auteur (agent + validateur humain prevu), date.
3. Mapper le contenu depuis l'Architect Analysis :

   | Change Brief (template) | Source Analysis |
   |-------------------------|-----------------|
   | Besoin | Goal + Context |
   | Perimetre | Goal (in/out) + Found |
   | Impacts | Impact (tous axes) |
   | Plan | Next Step + Proposal (phases courtes) |
   | Validation | Decisions To validate ; cocher humain si L2/L3 |

4. Ajouter dans le corps du document (sections libres si utile, rester concis) :

   - Regles metier concernees
   - Hors perimetre explicite
   - Donnees / entites (niveau Architect, pas schema detaille)
   - Dependances et regression
   - Criteres d'acceptation (liste Analysis)
   - Artefacts a consulter (liste Analysis)
   - Risques / exceptions

5. Toute decision nouvelle : libelle **proposition — a valider**, jamais « decide » sans ADR acceptee ou accord humain documente.
6. L3 : mentionner brouillon ADR associe ou lien a creer.

## Resultat attendu

- Fichier Change Brief **dans le repo projet**, pret pour revue humaine (L2 propose, L3 requis).
- **Next Step** dans l'Analysis mise a jour : ex. « Validation Change Brief », « Database Architect sur schema », « Developer apres validation ».

## Gouvernance

Actions sensibles : `governance/actions.yaml` — l'agent **propose** le fichier ; merge / validation selon processus equipe.
