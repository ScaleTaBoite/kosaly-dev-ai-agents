---
name: architecture-impact
description: >-
  Evalue impacts multi-axes (metier, archi, BDD, backend, frontend, securite,
  perf, cout) et determine le niveau L0-L3 avec justification. A utiliser apres
  feature-analysis ou audit-repository.
---

# Architecture impact

## Quand utiliser

- Apres comprehension initiale de la demande (`feature-analysis` ou `audit-repository`).
- Des qu'un doute existe sur L1 vs L2 vs L3.
- Avant `write-change-brief` pour L2+.

Reference canonique des niveaux : `workflows/impact-levels.yaml`.

## Prerequis

- Goal et perimetre connus (meme partiellement).
- Findings existant disponibles ou N/A (nouveau projet greenfield).

## Fichiers a lire

- `workflows/impact-levels.yaml`
- Projet : `schema.yaml`, ADR liees, `STATE.md` (zones protegees)
- `checklists/catalyst-change.md` si stack Catalyst probable
- `standards/README.md` — ouvrir un standard domaine **seulement** si l'impact de ce domaine est non trivial

## Etapes

1. Remplir **Impact** (une ligne ou courte liste par axe ; « None » si vraiment aucun) :

   | Axe | Contenu attendu |
   |-----|-----------------|
   | Business | regles, acteurs, changement comportement |
   | Architecture | modules, boundaries, nouveaux composants |
   | Database | voir formulations types dans `agents/architect.md` ; pas de DDL |
   | Backend | API, jobs, integrations |
   | Frontend | ecrans, etat, UX |
   | Security | auth, permissions, donnees sensibles, nouvelles API |
   | Performance | volume, latence, requetes repetees |
   | Cost | Catalyst / infra ; signalement analyse detaillee si besoin |

2. **Choisir L0–L3** et remplir **Why** en 1–3 phrases.

   Guide rapide :

   - **L0** : local, pas API/BDD/archi/permissions.
   - **L1** : feature localisee, contrat stable.
   - **L2** : BDD, API, multi-modules ou multi-couches.
   - **L3** : archi structurante, migration sensible, permissions majeures, securite critique, changement metier majeur.

3. **Proposal** : option retenue (simple par defaut) + alternatives ecartees en une phrase si utile.
4. **Decisions** : separer Accepted / To validate / Existing preserved.
5. **Risks / Exceptions** : regression, duplication data, hypothese non validee.
6. **Acceptance Criteria** : testables, orientes metier/tech sans implementation detaillee.

## Resultat attendu

- Sections Impact, Impact Level, Proposal, Decisions, Acceptance Criteria, Risks de l'**Architect Analysis** completees.
- Indication explicite : Database Architect requis (oui/non), ADR requise (oui/non), validation humaine (selon L2/L3).

## Proportionnalite

- L0/L1 : Impact peut etre bref ; pas de Change Brief obligatoire sauf equipe l'exige.
- L2/L3 : Impact complet ; Change Brief + validation selon `impact-levels.yaml`.
