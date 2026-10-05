# Workflow — kagents architect:spec

## Objectif

Formaliser une **spec** (comportement attendu) distincte de l'**impact** (ce que ca touche).

## Enchainement

1. `agents/architect.md` + invariants
2. `architect-audit` si contexte insuffisant
3. `architect-impact` — remplir uniquement parties impact (zones touchees) / L0–L3 / risques (pas substitut a la spec)
4. Rediger sections **Spec** via `templates/architect-spec/template.md`
5. `architect-write-output` → `outputs/specs/`, type `spec`
6. `architect-index`
7. Chat : `architect-chat.md`

## Regles

Ne pas inventer regles metier. Qualifier ETABLI / INCONNU.
