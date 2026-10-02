# Checklist — Revue

## General

- [ ] Coherent avec `STATE.md` et ADR
- [ ] Change Brief respecte si L2+
- [ ] Tests adequats

## Architecture

- [ ] Pas de decision archi non documentee

## Donnees

- [ ] Source de verite unique ou exception documentee
- [ ] Migrations reversibles ou plan de rollback

## Securite

- [ ] Pas de secret en clair
- [ ] Permissions justifiees

## Performance et cout

- [ ] Pas de N+1 / requetes repetees evidentes
- [ ] Catalyst : voir `catalyst-change.md` si applicable
