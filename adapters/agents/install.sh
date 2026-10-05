#!/usr/bin/env bash
# Adaptateur standard ouvert : expose les skills dans .agents/skills/
# (lu par Codex et les outils compatibles Agent Skills). Le routage passe par AGENTS.md.
set -euo pipefail
: "${TARGET_ROOT:=$(pwd)}"
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/_lib.sh"

place_all "$KAGENTS_DIR/skills" "$TARGET_ROOT/.agents/skills"
log "agents : skills liées dans .agents/skills/"
