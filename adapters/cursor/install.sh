#!/usr/bin/env bash
set -euo pipefail

# Installe l'integration dans le repo courant (PWD = racine projet client ou harness).
HARNESS_ROOT="${HARNESS_ROOT:-.}"
HARNESS_ROOT="$(cd "$HARNESS_ROOT" && pwd)"
TARGET_ROOT="$(pwd)"

CURSOR_DIR="$TARGET_ROOT/.cursor"
KAGENTS_DIR="$TARGET_ROOT/.kagents"
ARCHITECT_DOCS="$KAGENTS_DIR/docs/architect-docs"
ARCHITECT_INDEX="$ARCHITECT_DOCS/INDEX.md"
BASE_DOCS="$KAGENTS_DIR/docs/base-docs"
KNOWLEDGE_DIR="$KAGENTS_DIR/docs/knowledge"
CONTEXT_FILE="$KNOWLEDGE_DIR/context.md"

RULES_SRC="$HARNESS_ROOT/rules"
SKILLS_SRC="$HARNESS_ROOT/skills"
AGENTS_SRC="$HARNESS_ROOT/agents"
COMMANDS_SRC="$HARNESS_ROOT/commands"
DOCS_SRC="$HARNESS_ROOT/docs"

ARCHITECT_OUTPUTS="$ARCHITECT_DOCS/outputs"

mkdir -p "$CURSOR_DIR/rules" "$CURSOR_DIR/skills" "$CURSOR_DIR/agents"
mkdir -p "$ARCHITECT_OUTPUTS/architecture" "$ARCHITECT_OUTPUTS/impacts" \
  "$ARCHITECT_OUTPUTS/features" "$ARCHITECT_OUTPUTS/specs" \
  "$ARCHITECT_OUTPUTS/designs" "$ARCHITECT_OUTPUTS/audits" \
  "$ARCHITECT_DOCS/decisions" "$ARCHITECT_DOCS/proposals" \
  "$BASE_DOCS" "$KNOWLEDGE_DIR"

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

# --- Cursor ---
link_tree "$RULES_SRC/global" "$CURSOR_DIR/rules"
link_tree "$RULES_SRC/domains" "$CURSOR_DIR/rules"

find "$SKILLS_SRC" -mindepth 1 -maxdepth 1 -type d | while read -r skill_dir; do
  base="$(basename "$skill_dir")"
  ln -sfn "$(realpath --relative-to="$CURSOR_DIR/skills" "$skill_dir")" "$CURSOR_DIR/skills/$base"
done

link_tree "$AGENTS_SRC" "$CURSOR_DIR/agents"

# --- .kagents/docs/architect-docs ---
link_file "$AGENTS_SRC/architect.md" "$ARCHITECT_DOCS/architect.md"
link_file "$DOCS_SRC/architect-commands.md" "$ARCHITECT_DOCS/architect-commands.md"

ARCHITECT_SKILLS=(
  architect-discovery
  architect-audit
  architect-impact
  architect-write-output
  architect-index
  architect-status
  architect-decision
)
for skill in "${ARCHITECT_SKILLS[@]}"; do
  link_file "$SKILLS_SRC/$skill/SKILL.md" "$ARCHITECT_DOCS/${skill}.md"
done

ARCHITECT_COMMANDS=(
  architect
  architect-impact
  architect-spec
  architect-design
  architect-audit
  architect-compare
  architect-status
  architect-decision
)
for cmd in "${ARCHITECT_COMMANDS[@]}"; do
  link_file "$COMMANDS_SRC/${cmd}.md" "$ARCHITECT_DOCS/command-${cmd}.md"
done

link_file "$HARNESS_ROOT/templates/architect-output/template.md" "$ARCHITECT_DOCS/architect-output-template.md"
link_file "$HARNESS_ROOT/templates/architect-spec/template.md" "$ARCHITECT_DOCS/architect-spec-template.md"
link_file "$HARNESS_ROOT/templates/architect-design/template.md" "$ARCHITECT_DOCS/architect-design-template.md"
link_file "$HARNESS_ROOT/templates/architect-decision/template.md" "$ARCHITECT_DOCS/architect-decision-template.md"
link_file "$HARNESS_ROOT/templates/architect-index/INDEX.template.md" "$ARCHITECT_DOCS/INDEX.template.md"
link_file "$HARNESS_ROOT/rules/domains/architect-invariants.md" "$ARCHITECT_DOCS/architect-invariants.md"
link_file "$HARNESS_ROOT/rules/domains/architect-chat.md" "$ARCHITECT_DOCS/architect-chat.md"
link_file "$HARNESS_ROOT/workflows/architect-impact-levels.yaml" "$ARCHITECT_DOCS/architect-impact-levels.yaml"

if [[ ! -f "$ARCHITECT_INDEX" ]]; then
  cp "$HARNESS_ROOT/templates/architect-index/INDEX.template.md" "$ARCHITECT_INDEX"
fi

if [[ ! -f "$CONTEXT_FILE" ]]; then
  cat >"$CONTEXT_FILE" <<'EOF'
# Contexte projet

Document local du repository client. Completer avec stack, contraintes, liens vers les artefacts projet.

## Stack

-

## Contraintes

-

## References

-
EOF
fi

echo "Harness install:"
echo "  Cursor: $CURSOR_DIR"
echo "  KAgents: $KAGENTS_DIR/docs"
echo "  Commandes Architect: kagents architect, architect:impact, :spec, :design, :audit"
echo "  Voir architect-docs/architect-commands.md"
