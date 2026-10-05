#!/usr/bin/env bash
# Fonctions communes à install.sh et aux adaptateurs. À sourcer, pas à exécuter.
#
# Variables attendues (posées par install.sh, valeurs par défaut sinon) :
#   TARGET_ROOT   racine du projet client            (défaut : répertoire courant)
#   KAGENTS_DIR   .kagents/ du projet                 (défaut : $TARGET_ROOT/.kagents)
#   KAGENTS_MODE  link (défaut) | copy                (copy : pas de liens, utile sous Windows)

: "${TARGET_ROOT:=$(pwd)}"
: "${KAGENTS_DIR:=$TARGET_ROOT/.kagents}"
: "${KAGENTS_MODE:=link}"
MANIFEST="$KAGENTS_DIR/.installed"

log()  { echo "kagents: $*"; }
warn() { echo "kagents: ATTENTION $*" >&2; }

# Valeur d'une clé du frontmatter YAML (une ligne) : fm_get fichier clé
fm_get() {
  awk -v key="$2" '
    NR == 1 && $0 != "---" { exit }
    NR > 1 && $0 == "---" { exit }
    NR > 1 && index($0, key ":") == 1 { sub(/^[^:]*:[ \t]*/, ""); print; exit }
  ' "$1"
}

# Enregistre un chemin (relatif à TARGET_ROOT) dans le manifeste.
manifest_add() {
  mkdir -p "$KAGENTS_DIR"
  echo "${1#"$TARGET_ROOT"/}" >>"$MANIFEST"
}

# Place SRC en DEST : lien relatif, ou copie si KAGENTS_MODE=copy.
# N'écrase jamais ce qui existe déjà (le nettoyage préalable a retiré nos propres fichiers).
place() {
  local src="$1" dest="$2"
  if [[ ! -e "$src" ]]; then
    return 0
  fi
  if [[ -e "$dest" || -L "$dest" ]]; then
    warn "${dest#"$TARGET_ROOT"/} existe déjà et n'est pas géré par KAgents : conservé"
    return 0
  fi
  mkdir -p "$(dirname "$dest")"
  if [[ "$KAGENTS_MODE" == "copy" ]]; then
    cp -R "$src" "$dest"
  else
    local rel
    rel="$(realpath -m --relative-to="$(dirname "$dest")" "$src")"
    ln -s "$rel" "$dest"
  fi
  manifest_add "$dest"
}

# Place chaque entrée de SRC_DIR dans DEST_DIR. Filtre optionnel : fichiers | dossiers.
place_all() {
  local src_dir="$1" dest_dir="$2" kind="${3:-}"
  [[ -d "$src_dir" ]] || return 0
  local entry base
  for entry in "$src_dir"/*; do
    [[ -e "$entry" ]] || continue
    base="$(basename "$entry")"
    case "$base" in README.md | .gitkeep) continue ;; esac
    [[ "$kind" == "fichiers" && ! -f "$entry" ]] && continue
    [[ "$kind" == "dossiers" && ! -d "$entry" ]] && continue
    place "$entry" "$dest_dir/$base"
  done
}

# Comme place_all pour les agents, en ignorant ceux sans frontmatter `name:`
# (les outils les rejetteraient).
place_agents() {
  local src_dir="$1" dest_dir="$2" f
  [[ -d "$src_dir" ]] || return 0
  for f in "$src_dir"/*.md; do
    [[ -e "$f" ]] || continue
    if [[ -z "$(fm_get "$f" name)" ]]; then
      warn "agent $(basename "$f") sans frontmatter 'name:' : non exposé à l'outil"
      continue
    fi
    place "$f" "$dest_dir/$(basename "$f")"
  done
}
