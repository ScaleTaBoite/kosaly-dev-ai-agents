#!/usr/bin/env bash
# Adaptateur Cursor : commands, skills, agents et rules liés dans .cursor/
set -euo pipefail
: "${TARGET_ROOT:=$(pwd)}"
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/_lib.sh"

place_all "$KAGENTS_DIR/commands" "$TARGET_ROOT/.cursor/commands" fichiers
place_all "$KAGENTS_DIR/skills" "$TARGET_ROOT/.cursor/skills" dossiers
place_agents "$KAGENTS_DIR/agents" "$TARGET_ROOT/.cursor/agents"
place_all "$KAGENTS_DIR/rules/global" "$TARGET_ROOT/.cursor/rules"
place_all "$KAGENTS_DIR/rules/domains" "$TARGET_ROOT/.cursor/rules"
log "cursor : commands, skills, agents et rules liés dans .cursor/"
