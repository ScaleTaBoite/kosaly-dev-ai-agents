#!/usr/bin/env node
'use strict';
// Lancé par npm/pnpm après `add @dev-kosaly/kagents` : installe le kit dans le projet.
// Ne doit jamais faire échouer l'installation des dépendances.
const path = require('path');
const { spawnSync } = require('child_process');

const pkgRoot = path.resolve(__dirname, '..');
const project = process.env.INIT_CWD;

const skip = (why) => {
  if (why) console.log(`kagents: installation automatique ignorée (${why}). Lancez : npx kagents`);
  process.exit(0);
};

if (process.env.KAGENTS_SKIP_POSTINSTALL) skip();
if (!project) skip();
if (process.env.npm_config_global === 'true') skip('installation globale');
if (!pkgRoot.split(path.sep).includes('node_modules')) skip(); // développement du kit lui-même
if (path.resolve(project) === pkgRoot) skip();

try {
  spawnSync(process.execPath, [path.join(__dirname, 'kagents.js')], { cwd: project, stdio: 'inherit', env: { ...process.env, KAGENTS_FROM_POSTINSTALL: '1' } });
} catch {
  /* jamais bloquant */
}
