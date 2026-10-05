#!/usr/bin/env bash
# KAgents : installe le kit d'agents dans le projet courant.
#
#   install.sh [agents,claude,cursor | auto]      (défaut : auto)
#
# À lancer depuis la racine du projet. Idempotent : nettoie d'abord ce que le
# manifeste .kagents/.installed liste, puis réinstalle. Ne touche jamais un fichier
# qui n'est pas dans le manifeste. KAGENTS_MODE=copy remplace les liens par des copies.
set -euo pipefail

HARNESS_ROOT="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
export HARNESS_ROOT
export TARGET_ROOT="${TARGET_ROOT:-$(pwd)}"
export KAGENTS_DIR="$TARGET_ROOT/.kagents"
export KAGENTS_MODE="${KAGENTS_MODE:-link}"
source "$HARNESS_ROOT/adapters/_lib.sh"

TOOLS="${1:-auto}"
KIT_DIRS=(agents skills commands templates checklists workflows governance)

if [[ "$TARGET_ROOT" == "$HARNESS_ROOT" ]]; then
  echo "kagents: à lancer depuis la racine d'un projet, pas depuis le harness." >&2
  exit 1
fi

# --- 1. Nettoyage de ce que l'on a installé ---------------------------------
cleanup() {
  [[ -f "$MANIFEST" ]] || return 0
  local path
  while IFS= read -r path; do
    case "$path" in "" | /* | *..*) continue ;; esac
    rm -rf "${TARGET_ROOT:?}/$path"
  done <"$MANIFEST"
  : >"$MANIFEST"
}

# --- 2. Copie du kit dans .kagents/ -----------------------------------------
copy_kit() {
  local dir f rel
  for dir in "${KIT_DIRS[@]}"; do
    [[ -d "$HARNESS_ROOT/$dir" ]] || continue
    while IFS= read -r f; do
      rel="${f#"$HARNESS_ROOT"/}"
      if [[ -e "$KAGENTS_DIR/$rel" ]]; then
        warn ".kagents/$rel existe déjà et n'est pas géré par KAgents : conservé"
        continue
      fi
      mkdir -p "$(dirname "$KAGENTS_DIR/$rel")"
      cp "$f" "$KAGENTS_DIR/$rel"
      manifest_add "$KAGENTS_DIR/$rel"
    done < <(find "$HARNESS_ROOT/$dir" -type f ! -name .gitkeep | sort)
  done
  cp "$HARNESS_ROOT/VERSION" "$KAGENTS_DIR/VERSION"
  manifest_add "$KAGENTS_DIR/VERSION"
}

# --- 3. Espaces docs/ (un par agent) et contexte partagé --------------------
create_docs() {
  local agent docs
  mkdir -p "$KAGENTS_DIR/docs/knowledge"
  for agent in "$KAGENTS_DIR"/agents/*.md; do
    [[ -e "$agent" ]] || continue
    docs="$(fm_get "$agent" docs)"
    [[ -n "$docs" ]] && mkdir -p "$KAGENTS_DIR/docs/$docs"
  done
  if [[ ! -f "$KAGENTS_DIR/docs/knowledge/context.md" ]]; then
    cat >"$KAGENTS_DIR/docs/knowledge/context.md" <<'EOF'
# Contexte projet

Document partagé, écrit par l'utilisateur. Les agents le lisent, ne l'écrivent pas.

## Intention

- Ce que le système doit faire, pour qui :

## Stack

-

## Contraintes

-

## Références

-
EOF
  fi
}

# --- 4. Bloc KAgents dans AGENTS.md -----------------------------------------
render_block() {
  local f name agent_stem mode triggers desc
  echo "<!-- kagents:start -->"
  echo "## KAgents"
  echo
  echo "Kit d'agents IA installé dans \`.kagents/\` (v$(<"$KAGENTS_DIR/VERSION")). Ce bloc est régénéré par \`install.sh\` : ne pas l'éditer."
  echo
  echo "**Utilisation** : lance une commande (ex. \`/base-audit\`). Sans commandes dans ton outil, lis le fichier indiqué dans \`.kagents/commands/\` et applique-le. Contexte partagé : \`.kagents/docs/knowledge/context.md\`. Chaque agent n'écrit que dans son espace \`.kagents/docs/<agent>-docs/\`."
  echo
  echo "### Agents"
  echo
  echo "| Agent | Fichier | Rôle |"
  echo "|---|---|---|"
  for f in "$KAGENTS_DIR"/agents/*.md; do
    [[ -e "$f" ]] || continue
    name="$(fm_get "$f" name)"
    desc="$(fm_get "$f" description)"
    desc="${desc%%. *}"
    echo "| ${name:-$(basename "$f" .md)} | \`.kagents/agents/$(basename "$f")\` | ${desc:-—} |"
  done
  echo
  echo "### Routage"
  echo
  echo "| Demande | Commande | Agent | Mode |"
  echo "|---|---|---|---|"
  for f in "$KAGENTS_DIR"/commands/*.md; do
    [[ -e "$f" ]] || continue
    agent_stem="$(fm_get "$f" agent)"
    name=""
    [[ -n "$agent_stem" && -f "$KAGENTS_DIR/agents/$agent_stem.md" ]] && name="$(fm_get "$KAGENTS_DIR/agents/$agent_stem.md" name)"
    mode="$(fm_get "$f" mode)"
    triggers="$(fm_get "$f" triggers)"
    [[ -z "$triggers" ]] && triggers="$(fm_get "$f" description)"
    echo "| ${triggers:-—} | \`/$(basename "$f" .md)\` | ${name:-${agent_stem:-—}} | ${mode:-—} |"
  done
  echo "<!-- kagents:end -->"
}

write_agents_md() {
  local target="$TARGET_ROOT/AGENTS.md" block tmp
  block="$(mktemp)"
  tmp="$(mktemp)"
  render_block >"$block"
  if [[ -f "$target" ]] && grep -q '<!-- kagents:start -->' "$target"; then
    awk -v blockfile="$block" '
      /<!-- kagents:start -->/ { while ((getline line < blockfile) > 0) print line; skip = 1; next }
      /<!-- kagents:end -->/ { skip = 0; next }
      !skip { print }
    ' "$target" >"$tmp"
  elif [[ -f "$target" ]]; then
    { cat "$target"; echo; cat "$block"; } >"$tmp"
  else
    cp "$block" "$tmp"
  fi
  cat "$tmp" >"$target"
  rm -f "$block" "$tmp"
}

# --- 5. Adaptateurs ----------------------------------------------------------
resolve_tools() {
  if [[ "$TOOLS" != "auto" ]]; then
    echo "${TOOLS//,/ }"
    return
  fi
  local list="agents"
  [[ -d "$TARGET_ROOT/.claude" || -f "$TARGET_ROOT/CLAUDE.md" ]] && list="$list claude"
  [[ -d "$TARGET_ROOT/.cursor" ]] && list="$list cursor"
  echo "$list"
}

run_adapters() {
  local tool
  for tool in $(resolve_tools); do
    if [[ -x "$HARNESS_ROOT/adapters/$tool/install.sh" || -f "$HARNESS_ROOT/adapters/$tool/install.sh" ]]; then
      bash "$HARNESS_ROOT/adapters/$tool/install.sh"
    else
      warn "adaptateur inconnu : $tool (disponibles : $(cd "$HARNESS_ROOT/adapters" && ls -d */ | tr -d / | tr '\n' ' '))"
    fi
  done
}

mkdir -p "$KAGENTS_DIR"
cleanup
copy_kit
create_docs
write_agents_md
run_adapters
log "installé dans $KAGENTS_DIR (mode $KAGENTS_MODE)"
