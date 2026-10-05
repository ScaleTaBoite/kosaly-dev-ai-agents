---
name: catalyst-export
description: Demander, lire et exploiter l'export JSON d'un projet Zoho Catalyst (tables Data Store, colonnes, clés étrangères, permissions, règles de sécurité) sans le charger en entier.
---

# Export Catalyst

## 1. Pourquoi
Les tables Data Store sont définies dans la console Catalyst, pas dans le repository. Le code ne dit rien des types exacts, de l'obligation, de l'unicité, des clés étrangères ni des permissions. **L'export JSON du projet est la source de vérité du schéma.** Il se trouve dans `.kagents/docs/knowledge/catalyst-export/`.

## 2. Vérifier sa présence et sa fraîcheur
- **Présent** : il fait foi. Note son nom et sa date dans `INDEX.md` et dans l'en-tête de `schema-map.md`.
- **Absent**, ou **plus ancien** que des changements visibles dans le code (nouvelle table ou colonne utilisée) : demande-le (section 3). En attendant, reconstruis ce que tu peux depuis le code et classe le reste en **Inconnu**.

## 3. Demander l'export
Avant un audit ou une évolution, en quelques lignes. Par exemple :

> Avant de fouiller, un petit service : le schéma Catalyst vit dans la console, pas dans le code. Sans lui, je devine les types et les relations, et deviner n'est pas auditer.
> Exporte le projet depuis la console Catalyst (fichier JSON), puis dépose-le dans `.kagents/docs/knowledge/catalyst-export/`. Deux minutes, et mon audit gagne en précision.
> Tu préfères que je commence sans ? Possible, mais tout ce qui touche au schéma sera marqué Inconnu.

## 4. Lire l'export sans le charger en entier
L'export pèse souvent plusieurs centaines de Ko et contient des milliers d'entrées. Ne l'ouvre jamais en entier. Extrais seulement ce dont tu as besoin avec `jq` (ou un court script Python si `jq` est absent), puis résume dans la carte. Une fois la carte construite, c'est elle que tu relis, pas l'export.

### Structure utile
Sous `components` :
- `Datastore` : la base. Chaque entrée a un `type` :
  - `table` : `properties.table_name` ;
  - `column` : `table_name`, `column_name`, `data_type` (`varchar`, `text`, `int`, `bigint`, `double`, `boolean`, `date`, `datetime`, `foreign key`…), `is_mandatory`, `is_unique`, `max_length`, `default_value`, `search_index_enabled` ; pour une clé étrangère : `parent_table`, `parent_column`, `constraint_type` (ex. `ON-DELETE-SET-NULL`) ;
  - `tableScope` et `tablePermission` : portée et droits (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) par rôle et par table.
- `SecurityRules` : règles d'accès aux endpoints (méthodes, `authentication`).
- `Authentication` : rôles et configuration d'authentification.
- Le reste (`Functions`, `Cron`, `SchedulingCron`, `Filestore`, `Cache`, `AppSail`…) : seulement si une question précise l'exige.

### Extractions types

```bash
F=.kagents/docs/knowledge/catalyst-export/*.json
# Liste des tables
jq -r '.components.Datastore[] | select(.type=="table") | .properties.table_name' $F
# Colonnes d'une table
jq -r '.components.Datastore[] | select(.type=="column" and .properties.table_name=="TABLE")
  | .properties | [.column_name,.data_type,.is_mandatory,.is_unique,.max_length] | @tsv' $F
# Toutes les clés étrangères
jq -r '.components.Datastore[] | select(.type=="column" and .properties.data_type=="foreign key")
  | .properties | "\(.table_name).\(.column_name) -> \(.parent_table).\(.parent_column) [\(.constraint_type)]"' $F
# Permissions d'une table
jq -r '.components.Datastore[] | select(.type=="tablePermission" and .properties.table_name=="TABLE")
  | .properties | "\(.role_name): \(.table_permissions|join(","))"' $F
```

## 5. Croiser avec le code
- Table ou colonne utilisée dans le code mais absente de l'export, ou l'inverse : écart à signaler.
- Colonne qui ressemble à un identifiant (`*_id`) mais n'est pas déclarée en `foreign key` : intégrité non garantie.

## 6. Points d'attention systématiques
- Rôles ayant `DELETE` sur des tables sensibles.
- Règles de sécurité avec `authentication` optionnelle.
- Absence d'unicité sur des valeurs métier uniques.
- Clés étrangères en `ON-DELETE-SET-NULL` sur des liens qui ne devraient jamais être vides.

## 7. Limites de la plateforme
Tiens compte des limites propres à Catalyst (capacités de ZCQL, contraintes disponibles, quotas). Ne les suppose pas : si une limite conditionne ta proposition, indique-la comme point à vérifier dans la documentation officielle Catalyst.