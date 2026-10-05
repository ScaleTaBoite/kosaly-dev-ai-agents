---
name: schema-exploration
description: Explorer un repository de façon ciblée pour identifier la base de données, sa source de vérité, reconstruire le modèle de données et son usage réel, et savoir quand l'exploration est suffisante.
---

# Exploration du schéma

## 1. Principe
Exploration ciblée et progressive, jamais le repository entier. Boucle :

**Explorer → Observer → Décider → Rechercher précisément → Analyser → Diagnostiquer**

À chaque tour : « Que me manque-t-il pour cocher le critère d'arrêt (section 6) ? » Cherche uniquement cela.

## 2. Outils
- Si `graft` est disponible, utilise-le d'abord pour localiser modèles, schémas et requêtes.
- Sinon, recherche par motif de fichiers, puis `grep` pour les usages.

## 3. Identifier la stack et la source de vérité
Commence par les fichiers de dépendances et de configuration (`package.json`, `composer.json`, `requirements.txt`, `pyproject.toml`, `go.mod`, `catalyst.json`…).

| Stack | Où regarder en priorité |
|---|---|
| Laravel / Eloquent | `database/migrations/`, `app/Models/`, `config/database.php` |
| Prisma | `prisma/schema.prisma`, `prisma/migrations/` |
| Drizzle | `schema.ts` ou `schema/`, `drizzle.config.*`, dossier `drizzle/` |
| TypeORM | `*.entity.ts`, `migrations/` |
| Sequelize | `models/`, `migrations/` |
| Django | `*/models.py`, `*/migrations/` |
| Rails | `db/schema.rb` ou `db/structure.sql`, `app/models/` |
| Mongoose / MongoDB | `models/`, `*.schema.ts`, validateurs JSON Schema |
| Supabase | `supabase/migrations/`, politiques RLS |
| **Zoho Catalyst Data Store** | **Source de vérité : l'export** (skill `catalyst-export`). Dans le code : `catalyst.json`, `functions/*/`, appels `datastore()`, `.table(...)`, `zcql()`, `executeZCQLQuery(...)` |
| **Zoho Catalyst NoSQL** | Dans le code : appels `nosql()`, `.table(...)` ; clés de partition et de tri, attributs écrits, motifs de lecture |
| SQL brut | fichiers `.sql`, dossiers `db/` ou `sql/` |

Si plusieurs sources de schéma coexistent (migrations et schéma ORM, export Catalyst et code), identifie celle qui fait foi et signale toute incohérence.

## 4. Reconstruire le modèle
Pour chaque entité : nom, attributs et types, clé primaire (ou clés de partition et de tri en NoSQL), contraintes (unicité, obligation, défauts), relations (cardinalité, clé étrangère, comportement à la suppression), index.

## 5. Comprendre l'usage réel
Pour les entités critiques, trouve où les données sont **créées, lues, modifiées, supprimées** : contrôleurs, services, repositories, fonctions Catalyst, jobs, requêtes brutes. Repère :
- les filtres et tris fréquents (candidats aux index) ;
- les requêtes dans des boucles (N+1) ;
- les transactions, ou leur absence ;
- les suppressions logiques ;
- les règles métier appliquées dans le code plutôt qu'en base.

## 6. Critère d'arrêt
Tu passes au diagnostic quand **tous** ces points sont cochés :

- [ ] Base de données et couche d'accès identifiées.
- [ ] Source de vérité du schéma localisée (Catalyst : export présent dans `.kagents/docs/knowledge/catalyst-export/`, ou demandé et son absence notée).
- [ ] Toutes les entités listées avec leurs relations.
- [ ] Pour chaque entité critique (désignée par `knowledge/context.md`, sinon : utilisateurs, paiements, données personnelles, cœur métier), chemins de création, lecture, modification et suppression trouvés.
- [ ] Index et contraintes recensés.
- [ ] Chaque point non vérifiable classé **Inconnu**.

**Budget** : si après une vingtaine de fichiers lus un point reste bloqué, arrête, classe-le en Inconnu et pose la question. En mode Évolution, limite l'exploration aux entités touchées et à leurs voisines directes.