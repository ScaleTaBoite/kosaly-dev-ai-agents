#!/usr/bin/env bash
# Adaptateur Claude Code : commands, skills et agents liés dans .claude/
set -euo pipefail
: "${TARGET_ROOT:=$(pwd)}"
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/_lib.sh"

place_all "$KAGENTS_DIR/commands" "$TARGET_ROOT/.claude/commands" fichiers
place_all "$KAGENTS_DIR/skills" "$TARGET_ROOT/.claude/skills" dossiers
place_agents "$KAGENTS_DIR/agents" "$TARGET_ROOT/.claude/agents"
log "claude : commands, skills et agents liés dans .claude/"
