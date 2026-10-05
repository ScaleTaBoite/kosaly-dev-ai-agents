# Contrat de sortie chat — Architect

Reference adaptative — omettre les sections sans contenu utile.

Priorite : **Clarte > Pertinence > Structure > Concision > Esthetique**.

```markdown
# Architect — [titre]

**Mode :** Architecture | Impact
**Niveau :** L0 | L1 | L2 | L3
**Statut :** ETABLI | A VALIDER | BLOQUANT (selon le cas)

## Synthese

Quelques paragraphes : conclusion immediate, ce qui a ete analyse, proposition retenue.

## Constats principaux

Tableau ou liste (elements importants seulement).

## Impact architectural

Tableau MVC si mode Impact (ou « Pas d'impact identifie » par couche).

| Couche | Impact | Element cle |
|--------|--------|-------------|
| Modele | | |
| Controleur | | |
| Vue | | |

## Architecture concernee

Diagramme Mermaid ou schema **uniquement** si cela clarifie flux ou composants.

## Points a decider

Decisions humaines importantes (pas les propositions de l'agent presentees comme decidees).

## Incertitudes / points bloquants

Ce qui influence la suite (max 5 questions bloquantes).

## Handoff

### Base (Database Expert)
Si BDD / donnees concernees : ce que Base doit analyser dans `base-docs/`.

### Suite du travail
Validation humaine, Base, puis implementation (Developer hors scope de ce role).

## Prochaine etape

Action concrete.

## Livrable

Chemin exact : `.kagents/docs/architect-docs/outputs/...`
```

Le chat **n'est pas** une copie du fichier persistant. Ne pas lister tous les fichiers du repo.
