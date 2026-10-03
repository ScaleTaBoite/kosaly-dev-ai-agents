#!/usr/bin/env bash
set -euo pipefail

# Installe l'integration dans le repo courant (PWD = racine projet client ou harness).
# - .cursor/ : liens vers rules, skills, agents (comportement Cursor existant)
# - .kagents/docs/ : arborescence documentaire projet (canon harness via liens + context.md local)
HARNESS_ROOT="${HARNESS_ROOT:-.}"
HARNESS_ROOT="$(cd "$HARNESS_ROOT" && pwd)"
TARGET_ROOT="$(pwd)"

CURSOR_DIR="$TARGET_ROOT/.cursor"
KAGENTS_DIR="$TARGET_ROOT/.kagents"
ARCHITECT_DOCS="$KAGENTS_DIR/docs/architect-docs"
BASE_DOCS="$KAGENTS_DIR/docs/base-docs"
KNOWLEDGE_DIR="$KAGENTS_DIR/docs/knowledge"
CONTEXT_FILE="$KNOWLEDGE_DIR/context.md"

RULES_SRC="$HARNESS_ROOT/rules"
SKILLS_SRC="$HARNESS_ROOT/skills"
AGENTS_SRC="$HARNESS_ROOT/agents"

mkdir -p "$CURSOR_DIR/rules" "$CURSOR_DIR/skills" "$CURSOR_DIR/agents"
mkdir -p "$ARCHITECT_DOCS" "$BASE_DOCS" "$KNOWLEDGE_DIR"

link_tree() {
  local src="$1"
  local dest="$2"
  if [[ ! -d "$src" ]]; then
    echo "skip: $src (missing)" >&2
    return 0
  fi
  find "$src" -mindepth 1 -maxdepth 1 | while read -r entry; do
    base="$(basename "$entry")"
    [[ "$base" == "README.md" ]] && continue
    ln -sfn "$(realpath --relative-to="$dest" "$entry")" "$dest/$base"
  done
}

link_file() {
  local src="$1"
  local dest="$2"
  if [[ ! -e "$src" ]]; then
    echo "skip: $src (missing)" >&2
    return 0
  fi
  ln -sfn "$(realpath --relative-to="$(dirname "$dest")" "$src")" "$dest"
}

# --- Cursor (inchangé) ---
link_tree "$RULES_SRC/global" "$CURSOR_DIR/rules"
link_tree "$RULES_SRC/domains" "$CURSOR_DIR/rules"

find "$SKILLS_SRC" -mindepth 1 -maxdepth 1 -type d | while read -r skill_dir; do
  base="$(basename "$skill_dir")"
  ln -sfn "$(realpath --relative-to="$CURSOR_DIR/skills" "$skill_dir")" "$CURSOR_DIR/skills/$base"
done

link_tree "$AGENTS_SRC" "$CURSOR_DIR/agents"

# --- .kagents/docs (pas de copie du depot harness, liens symboliques uniquement) ---
link_file "$AGENTS_SRC/architect.md" "$ARCHITECT_DOCS/architect.md"

ARCHITECT_SKILLS=(
  feature-analysis
  audit-repository
  architecture-impact
  write-change-brief
)
for skill in "${ARCHITECT_SKILLS[@]}"; do
  link_file "$SKILLS_SRC/$skill/SKILL.md" "$ARCHITECT_DOCS/${skill}.md"
done

link_file "$HARNESS_ROOT/templates/change-brief/template.md" "$ARCHITECT_DOCS/change-brief-template.md"
link_file "$HARNESS_ROOT/templates/adr/template.md" "$ARCHITECT_DOCS/adr-template.md"

# base-docs : espace reserve (ex. Database Architect) — repertoire vide, pas de contenu dedie ici
# knowledge/context.md : fichier projet, cree une seule fois si absent
if [[ ! -f "$CONTEXT_FILE" ]]; then
  cat >"$CONTEXT_FILE" <<'EOF'
# Contexte projet

Document local du repository client. Completer avec stack, contraintes, liens vers les artefacts projet (ex. STATE.md, schema.yaml).

## Stack

-

## Contraintes

-

## References

-
EOF
fi

echo "Harness install:"
echo "  Cursor links: $CURSOR_DIR  (from $HARNESS_ROOT)"
echo "  KAgents docs: $KAGENTS_DIR/docs"
echo "    architect-docs -> liens vers role/skills/templates Architect du harness"
echo "    base-docs      -> (vide, reserve)"
echo "    knowledge      -> $CONTEXT_FILE"
