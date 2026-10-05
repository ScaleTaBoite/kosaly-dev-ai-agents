# Adapter Cursor

Lie le kit installe dans `.kagents/` vers `.cursor/` :

| Source (`.kagents/`) | Destination |
|----------------------|-------------|
| `commands/*.md` | `.cursor/commands/` |
| `skills/<nom>/` | `.cursor/skills/` |
| `agents/*.md` | `.cursor/agents/` |
| `rules/global/`, `rules/domains/` | `.cursor/rules/` |

Lance par `install.sh cursor` (ou `auto` si `.cursor/` existe) depuis la racine du projet. Ne pas editer les fichiers lies : modifier le harness puis relancer l'install.
