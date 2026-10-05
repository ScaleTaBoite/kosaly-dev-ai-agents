---
name: db-analysis
description: Grille d'analyse d'une base de données (intégrité, sécurité, performance, maintenabilité, évolutivité) et niveaux de sévérité pour classer les problèmes observés.
---

# Analyse de la base

Ne signale que ce que tu as observé, avec sa preuve (fichier et ligne, ou entrée de l'export).

## Intégrité
- Clés étrangères absentes alors qu'une relation existe dans le code.
- Unicité manquante sur des valeurs métier uniques (email, référence, slug).
- Nullabilité ou valeurs par défaut incohérentes.
- Suppression en cascade dangereuse, ou orphelins possibles.
- Règles métier garanties seulement par le code alors qu'elles devraient l'être en base.
- Opérations multi-étapes sans transaction (ou sans mécanisme compensatoire quand la plateforme n'en offre pas).
- Types inadaptés (montants en flottant, dates en chaîne, énumérations en texte libre).

## Sécurité
- Données personnelles ou sensibles non protégées, mots de passe non hachés.
- Requêtes construites par concaténation (SQL, ZCQL) : risque d'injection.
- Isolation multi-tenant absente ou fragile.
- Secrets en clair dans le code ou les migrations.
- Colonnes sensibles exposées sans nécessité.
- Règles d'accès absentes ou trop larges (RLS, permissions de table, règles de sécurité Catalyst).

## Performance
- Colonnes filtrées, triées ou jointes sans index.
- Requêtes N+1, chargements excessifs.
- Pagination absente sur des listes potentiellement longues.
- Index redondants.
- En NoSQL : motifs de lecture qui ne correspondent pas aux clés (parcours complets).
- Croissance forte sans stratégie (archivage, partitionnement) au regard de la volumétrie annoncée.

## Maintenabilité
- Nommage incohérent.
- Migrations modifiées après coup, schéma ORM désynchronisé, ou code Catalyst qui utilise des colonnes absentes de l'export.
- Logique d'accès aux données dupliquée.
- Colonnes ou tables mortes.
- Colonnes fourre-tout (JSON, texte libre) là où une structure serait préférable, ou l'inverse.

## Évolutivité
- Modèle qui bloque une évolution annoncée dans `knowledge/context.md`.
- Type de base inadapté aux accès réels.
- Couplage fort qui rendra les migrations coûteuses.
- Absence de suppression logique ou d'historisation quand le métier en aura besoin.

## Sévérité
- **Critique** : risque de perte, corruption ou fuite de données.
- **Élevée** : bug probable ou dégradation sérieuse à court terme.
- **Moyenne** : dette qui coûtera cher si elle n'est pas traitée.
- **Faible** : amélioration de confort ou de clarté.