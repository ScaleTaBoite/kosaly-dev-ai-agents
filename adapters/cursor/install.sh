#!/usr/bin/env bash
set -euo pipefail

# Installe l'integration Cursor dans le repo courant (PWD = racine projet ou harness).
HARNESS_ROOT="${HARNESS_ROOT:-.}"
HARNESS_ROOT="$(cd "$HARNESS_ROOT" && pwd)"
TARGET_ROOT="$(pwd)"

CURSOR_DIR="$TARGET_ROOT/.cursor"
RULES_SRC="$HARNESS_ROOT/rules"
SKILLS_SRC="$HARNESS_ROOT/skills"
AGENTS_SRC="$HARNESS_ROOT/agents"

mkdir -p "$CURSOR_DIR/rules" "$CURSOR_DIR/skills" "$CURSOR_DIR/agents"

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

link_tree "$RULES_SRC/global" "$CURSOR_DIR/rules"
link_tree "$RULES_SRC/domains" "$CURSOR_DIR/rules"

find "$SKILLS_SRC" -mindepth 1 -maxdepth 1 -type d | while read -r skill_dir; do
  base="$(basename "$skill_dir")"
  [[ "$base" == "README.md" ]] && continue
  ln -sfn "$(realpath --relative-to="$CURSOR_DIR/skills" "$skill_dir")" "$CURSOR_DIR/skills/$base"
done

link_tree "$AGENTS_SRC" "$CURSOR_DIR/agents"

echo "Cursor adapter: linked from $HARNESS_ROOT into $CURSOR_DIR"
