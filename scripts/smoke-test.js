#!/usr/bin/env node
'use strict';
// Test de fumée : installe le kit dans un projet temporaire et vérifie les garanties de l'installateur.
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');
const { execFileSync } = require('child_process');

const BIN = path.resolve(__dirname, '..', 'bin', 'kagents.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kagents-'));
const run = (args = [], env = {}) =>
  execFileSync(process.execPath, [BIN, ...args], { cwd: tmp, env: { ...process.env, ...env }, encoding: 'utf8', stdio: 'pipe' });
const p = (...s) => path.join(tmp, ...s);
const snapshot = () => {
  const out = [];
  const walk = (d) => {
    for (const n of fs.readdirSync(d).sort()) {
      const f = path.join(d, n);
      const st = fs.lstatSync(f);
      if (st.isSymbolicLink()) out.push(`${f} -> ${fs.readlinkSync(f)}`);
      else if (st.isDirectory()) walk(f);
      else out.push(`${f} ${fs.readFileSync(f, 'hex').length}`);
    }
  };
  walk(tmp);
  return out.join('\n');
};
const brokenLinks = () => {
  const bad = [];
  const walk = (d) => {
    for (const n of fs.readdirSync(d)) {
      const f = path.join(d, n);
      const st = fs.lstatSync(f);
      if (st.isSymbolicLink() && !fs.existsSync(f)) bad.push(f);
      else if (st.isDirectory()) walk(f);
    }
  };
  walk(tmp);
  return bad;
};
const test = (name, fn) => {
  fn();
  console.log(`ok - ${name}`);
};

try {
  fs.mkdirSync(p('.claude', 'commands'), { recursive: true });
  fs.mkdirSync(p('.cursor'));
  fs.writeFileSync(p('AGENTS.md'), '# Mon projet\n\nTexte utilisateur.\n');
  fs.writeFileSync(p('.claude', 'commands', 'base-audit.md'), 'mine');

  test('installation (auto)', () => {
    run();
    for (const f of ['.kagents/agents/database_expert.md', '.kagents/docs/knowledge/context.md', '.kagents/docs/base-docs', '.kagents/docs/architect-docs', '.claude/agents/database_expert.md', '.claude/commands/base-evolve.md', '.cursor/agents/architect.md', '.kagents/docs/architect-docs/INDEX.md', '.kagents/docs/architect-docs/outputs/specs', '.cursor/rules/architect-invariants.md', '.agents/skills/db-docs/SKILL.md'])
      assert(fs.existsSync(p(...f.split('/'))), `manquant : ${f}`);
    assert.deepStrictEqual(brokenLinks(), []);
  });
  test('AGENTS.md : contenu utilisateur gardé, bloc généré', () => {
    const s = fs.readFileSync(p('AGENTS.md'), 'utf8');
    assert(s.startsWith('# Mon projet\n\nTexte utilisateur.'));
    assert(s.includes('`/base-audit`') && s.includes('`/architect-impact`'));
    assert.strictEqual(s.split('<!-- kagents:start -->').length, 2);
  });
  test('fichier utilisateur jamais écrasé', () => {
    assert.strictEqual(fs.readFileSync(p('.claude', 'commands', 'base-audit.md'), 'utf8'), 'mine');
  });
  test('idempotence', () => {
    const a = snapshot();
    run();
    assert.strictEqual(snapshot(), a);
  });
  test('docs/ conservé à la réinstallation', () => {
    fs.writeFileSync(p('.kagents', 'docs', 'base-docs', 'INDEX.md'), 'livrable');
    run();
    assert.strictEqual(fs.readFileSync(p('.kagents', 'docs', 'base-docs', 'INDEX.md'), 'utf8'), 'livrable');
  });
  test('désinstallation', () => {
    run(['uninstall']);
    assert(!fs.existsSync(p('.kagents', 'agents')) && !fs.existsSync(p('.agents')));
    assert(fs.existsSync(p('.kagents', 'docs', 'base-docs', 'INDEX.md')));
    assert.strictEqual(fs.readFileSync(p('AGENTS.md'), 'utf8'), '# Mon projet\n\nTexte utilisateur.\n');
    assert.strictEqual(fs.readFileSync(p('.claude', 'commands', 'base-audit.md'), 'utf8'), 'mine');
    assert(fs.existsSync(p('.claude')) && fs.existsSync(p('.cursor')));
  });
  test('mode --copy : aucun lien symbolique', () => {
    run(['--copy']);
    const links = [];
    const walk = (d) => fs.readdirSync(d).forEach((n) => {
      const f = path.join(d, n);
      const st = fs.lstatSync(f);
      if (st.isSymbolicLink()) links.push(f);
      else if (st.isDirectory()) walk(f);
    });
    walk(tmp);
    assert.deepStrictEqual(links, []);
    assert(fs.existsSync(p('.cursor', 'commands', 'base-audit.md')));
  });
  test('--version et --help', () => {
    assert.strictEqual(run(['--version']).trim(), require('../package.json').version);
    assert(run(['--help']).includes('Usage'));
  });
  console.log('\nTous les tests passent.');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
