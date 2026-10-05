#!/usr/bin/env node
'use strict';
// KAgents : installe le kit d'agents IA dans le projet courant.
// Sans dépendance. Voir `kagents --help`.

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const tty = require('tty');

const PKG_ROOT = path.resolve(__dirname, '..');
const PKG = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, 'package.json'), 'utf8'));
const KIT_DIRS = ['agents', 'skills', 'commands', 'rules', 'templates', 'checklists', 'workflows', 'governance', 'docs'];
const SKIP = new Set(['README.md', '.gitkeep']);
const BLOCK_RE = /<!-- kagents:start -->[\s\S]*?<!-- kagents:end -->/;
const GITIGNORE_RE = /# kagents:start\n[\s\S]*?# kagents:end\n?/;
// On ignore le kit (régénérable) mais pas docs/ : livrables et contexte sont à versionner.

// Adaptateurs : un outil = une liste [dossier du kit, destination, type].
// type : files (fichiers), dirs (dossiers), agents (fichiers .md avec `name:`).
// Les skills ne sont volontairement PAS liées dans .claude/ ni .cursor/ : ces outils les listeraient
// comme commandes `/`. Les agents et commandes les chargent par chemin depuis .kagents/skills/.
const ADAPTERS = {
  agents: [['skills', '.agents/skills', 'dirs']],
  claude: [
    ['commands', '.claude/commands', 'files'],
    ['agents', '.claude/agents', 'agents'],
  ],
  cursor: [
    ['commands', '.cursor/commands', 'files'],
    ['agents', '.cursor/agents', 'agents'],
    ['rules/global', '.cursor/rules', 'files'],
    ['rules/domains', '.cursor/rules', 'files'],
  ],
};

const HELP = `kagents ${PKG.version}

Usage : kagents [install] [--tools claude,cursor,agents|auto|none] [--yes] [--copy]
        kagents --configure          (rechoisir les outils)
        kagents uninstall
        kagents --help | --version

À lancer depuis la racine du projet. Dans un terminal, une liste permet de choisir
les outils à brancher ; le choix est mémorisé dans .kagents/config.json.
  --tools      outils à brancher, sans question
  --yes, -y    ne pose pas de question (détection automatique)
  --configure  pose à nouveau la question
  --copy       copies au lieu de liens symboliques (aussi KAGENTS_MODE=copy)
  uninstall    retire ce que KAgents a installé (docs/ est conservé)
`;

const log = (m) => console.log(`kagents: ${m}`);
const warn = (m) => console.warn(`kagents: ATTENTION ${m}`);
const die = (m) => {
  console.error(`kagents: ${m}`);
  process.exit(1);
};

// --- Arguments ----------------------------------------------------------------
function parseArgs(argv) {
  const o = { cmd: 'install', tools: null, yes: false, configure: false, copy: process.env.KAGENTS_MODE === 'copy' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') o.cmd = 'help';
    else if (a === '-v' || a === '--version') o.cmd = 'version';
    else if (a === '--copy') o.copy = true;
    else if (a === '-y' || a === '--yes') o.yes = true;
    else if (a === '--configure') o.configure = true;
    else if (a === '--tools') o.tools = argv[++i] || die('--tools attend une valeur');
    else if (a.startsWith('--tools=')) o.tools = a.slice(8);
    else if (a === 'install' || a === 'uninstall') o.cmd = a;
    else if (/^[a-z,]+$/.test(a)) o.tools = a; // compat : kagents claude,cursor
    else die(`argument inconnu : ${a}\n${HELP}`);
  }
  return o;
}

// --- Utilitaires --------------------------------------------------------------
// Frontmatter YAML d'une ligne par clé : { name, docs, description, ... }
function frontmatter(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const fm = {};
  if (lines[0] !== '---') return fm;
  for (let i = 1; i < lines.length && lines[i] !== '---'; i++) {
    const m = lines[i].match(/^([A-Za-z_-]+):[ \t]*(.*)$/);
    if (m) fm[m[1]] = m[2];
  }
  return fm;
}

const exists = (p) => {
  try {
    fs.lstatSync(p);
    return true;
  } catch {
    return false;
  }
};
const listDir = (d) => (fs.existsSync(d) ? fs.readdirSync(d).sort() : []);
const listFiles = (dir) =>
  listDir(dir).flatMap((n) => {
    const p = path.join(dir, n);
    if (SKIP.has(n)) return [];
    return fs.statSync(p).isDirectory() ? listFiles(p) : [p];
  });

// --- Installateur -------------------------------------------------------------
class Installer {
  constructor(target, copy) {
    this.target = target;
    this.copy = copy;
    this.kagents = path.join(target, '.kagents');
    this.manifest = path.join(this.kagents, '.installed');
    this.config = path.join(this.kagents, 'config.json');
    this.entries = [];
  }

  rel(p) {
    return path.relative(this.target, p).split(path.sep).join('/');
  }

  // Place src en dest : lien relatif (repli en copie), sans jamais écraser.
  place(src, dest) {
    if (!fs.existsSync(src)) return;
    if (exists(dest)) {
      warn(`${this.rel(dest)} existe déjà et n'est pas géré par KAgents : conservé`);
      return;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    let linked = false;
    if (!this.copy) {
      try {
        const type = fs.statSync(src).isDirectory() ? 'dir' : 'file';
        fs.symlinkSync(path.relative(path.dirname(dest), src), dest, type);
        linked = true;
      } catch {
        /* pas de droits de lien (Windows) : copie */
      }
    }
    if (!linked) fs.cpSync(src, dest, { recursive: true });
    this.entries.push(this.rel(dest));
  }

  cleanup() {
    if (!fs.existsSync(this.manifest)) return [];
    const removed = [];
    for (const line of fs.readFileSync(this.manifest, 'utf8').split('\n')) {
      const p = line.trim();
      if (!p || path.isAbsolute(p) || p.split('/').includes('..')) continue;
      const full = path.join(this.target, p);
      if (exists(full)) fs.rmSync(full, { recursive: true, force: true });
      removed.push(full);
    }
    fs.writeFileSync(this.manifest, '');
    return removed;
  }

  copyKit() {
    for (const dir of KIT_DIRS) {
      for (const f of listFiles(path.join(PKG_ROOT, dir))) {
        const dest = path.join(this.kagents, path.relative(PKG_ROOT, f));
        if (exists(dest)) {
          warn(`${this.rel(dest)} existe déjà et n'est pas géré par KAgents : conservé`);
          continue;
        }
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(f, dest);
        this.entries.push(this.rel(dest));
      }
    }
    const v = path.join(this.kagents, 'VERSION');
    fs.writeFileSync(v, PKG.version + '\n');
    this.entries.push(this.rel(v));
  }

  createDocs() {
    fs.mkdirSync(path.join(this.kagents, 'docs', 'knowledge'), { recursive: true });
    for (const f of listDir(path.join(this.kagents, 'agents'))) {
      if (!f.endsWith('.md')) continue;
      const docs = frontmatter(path.join(this.kagents, 'agents', f)).docs;
      if (docs) fs.mkdirSync(path.join(this.kagents, 'docs', docs), { recursive: true });
    }
    this.createArchitectDocs();
    const ctx = path.join(this.kagents, 'docs', 'knowledge', 'context.md');
    if (!fs.existsSync(ctx)) {
      fs.writeFileSync(
        ctx,
        `# Contexte projet

Document partagé, écrit par l'utilisateur. Les agents le lisent, ne l'écrivent pas.

## Intention

- Ce que le système doit faire, pour qui :

## Stack

-

## Contraintes

-

## Références

-
`,
      );
    }
  }

  // Espace de l'Architect : livrables, décisions, propositions et INDEX.md (créé une fois, jamais écrasé).
  createArchitectDocs() {
    const root = path.join(this.kagents, 'docs', 'architect-docs');
    if (!fs.existsSync(root)) return;
    for (const d of ['architecture', 'impacts', 'features', 'specs', 'designs', 'audits'].map((n) => `outputs/${n}`).concat(['decisions', 'proposals']))
      fs.mkdirSync(path.join(root, d), { recursive: true });
    const index = path.join(root, 'INDEX.md');
    const tpl = path.join(this.kagents, 'templates', 'architect-index', 'INDEX.template.md');
    if (!fs.existsSync(index) && fs.existsSync(tpl)) fs.copyFileSync(tpl, index);
  }

  renderBlock() {
    const agentsDir = path.join(this.kagents, 'agents');
    const cmdDir = path.join(this.kagents, 'commands');
    const agentRows = [];
    const names = {};
    for (const f of listDir(agentsDir).filter((n) => n.endsWith('.md'))) {
      const fm = frontmatter(path.join(agentsDir, f));
      const stem = f.replace(/\.md$/, '');
      names[stem] = fm.name || stem;
      const desc = (fm.description || '').split('. ')[0] || '—';
      agentRows.push(`| ${names[stem]} | \`.kagents/agents/${f}\` | ${desc} |`);
    }
    const routeRows = [];
    for (const f of listDir(cmdDir).filter((n) => n.endsWith('.md'))) {
      const fm = frontmatter(path.join(cmdDir, f));
      const agent = names[fm.agent] || fm.agent || '—';
      routeRows.push(
        `| ${fm.triggers || fm.description || '—'} | \`/${f.replace(/\.md$/, '')}\` | ${agent} | ${fm.mode || '—'} |`,
      );
    }
    return [
      '<!-- kagents:start -->',
      '## KAgents',
      '',
      `Kit d'agents IA installé dans \`.kagents/\` (v${PKG.version}). Ce bloc est régénéré par \`kagents\` : ne pas l'éditer.`,
      '',
      "**Utilisation** : lance une commande (ex. `/base-audit`). Sans commandes dans ton outil, lis le fichier indiqué dans `.kagents/commands/` et applique-le. Contexte partagé : `.kagents/docs/knowledge/context.md`. Chaque agent n'écrit que dans son espace `.kagents/docs/<agent>-docs/`.",
      '',
      '### Agents',
      '',
      '| Agent | Fichier | Rôle |',
      '|---|---|---|',
      ...agentRows,
      '',
      '### Routage',
      '',
      '| Demande | Commande | Agent | Mode |',
      '|---|---|---|---|',
      ...routeRows,
      '<!-- kagents:end -->',
    ].join('\n');
  }

  writeAgentsMd() {
    const file = path.join(this.target, 'AGENTS.md');
    const block = this.renderBlock();
    let out;
    if (fs.existsSync(file)) {
      const cur = fs.readFileSync(file, 'utf8');
      out = BLOCK_RE.test(cur) ? cur.replace(BLOCK_RE, () => block) : cur.replace(/\n*$/, '\n\n') + block + '\n';
    } else {
      out = block + '\n';
    }
    fs.writeFileSync(file, out);
  }

  // Bloc .gitignore : le kit et les liens que l'on a posés, jamais docs/ (sauf les fichiers du kit qui s'y trouvent).
  gitignoreBlock() {
    const extra = this.entries.filter((e) => !e.startsWith('.kagents/') || e.startsWith('.kagents/docs/')).sort();
    return ['# kagents:start', '.kagents/*', '!.kagents/docs/', ...extra, '# kagents:end'].join('\n') + '\n';
  }

  writeGitignore() {
    const file = path.join(this.target, '.gitignore');
    if (!fs.existsSync(file) && !fs.existsSync(path.join(this.target, '.git'))) return;
    const cur = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    const block = this.gitignoreBlock();
    const out = GITIGNORE_RE.test(cur)
      ? cur.replace(GITIGNORE_RE, () => block)
      : (cur && !cur.endsWith('\n') ? cur + '\n' : cur) + (cur ? '\n' : '') + block;
    fs.writeFileSync(file, out);
  }

  detectTools() {
    const has = (p) => fs.existsSync(path.join(this.target, p));
    const t = [];
    if (has('.claude') || has('CLAUDE.md')) t.push('claude');
    if (has('.cursor')) t.push('cursor');
    return t;
  }

  resolveTools(tools) {
    return tools === 'auto' ? ['agents', ...this.detectTools()] : tools;
  }

  loadConfig() {
    try {
      const c = JSON.parse(fs.readFileSync(this.config, 'utf8'));
      return Array.isArray(c.tools) ? c.tools : null;
    } catch {
      return null;
    }
  }

  saveConfig(tools) {
    fs.mkdirSync(this.kagents, { recursive: true });
    fs.writeFileSync(this.config, JSON.stringify({ tools }, null, 2) + '\n');
  }

  runAdapters(tools) {
    for (const tool of this.resolveTools(tools)) {
      if (!ADAPTERS[tool]) {
        warn(`outil inconnu : ${tool} (disponibles : ${Object.keys(ADAPTERS).join(', ')})`);
        continue;
      }
      for (const [from, to, kind] of ADAPTERS[tool]) {
        const srcDir = path.join(this.kagents, from);
        for (const name of listDir(srcDir)) {
          const src = path.join(srcDir, name);
          if (SKIP.has(name)) continue;
          const isDir = fs.statSync(src).isDirectory();
          if (kind === 'dirs' && !isDir) continue;
          if (kind !== 'dirs' && isDir) continue;
          if (kind === 'agents') {
            if (!name.endsWith('.md')) continue;
            if (!frontmatter(src).name) {
              warn(`agent ${name} sans frontmatter 'name:' : non exposé à l'outil`);
              continue;
            }
          }
          this.place(src, path.join(this.target, to, name));
        }
      }
      log(`${tool} : branché`);
    }
  }

  saveManifest() {
    fs.mkdirSync(this.kagents, { recursive: true });
    fs.writeFileSync(this.manifest, this.entries.join('\n') + '\n');
  }

  // Supprime les dossiers vides laissés par la désinstallation (jamais .claude/.cursor eux-mêmes).
  prune(removed) {
    const keep = new Set([this.target, path.join(this.target, '.claude'), path.join(this.target, '.cursor')]);
    for (const p of removed) {
      for (let d = path.dirname(p); d.startsWith(this.target) && !keep.has(d); d = path.dirname(d)) {
        if (!fs.existsSync(d) || fs.readdirSync(d).length) break;
        fs.rmdirSync(d);
      }
    }
  }

  install(tools) {
    fs.mkdirSync(this.kagents, { recursive: true });
    this.cleanup();
    this.copyKit();
    this.createDocs();
    this.writeAgentsMd();
    this.runAdapters(tools);
    this.writeGitignore();
    this.saveManifest();
    log(`installé dans ${this.kagents} (${this.copy ? 'copies' : 'liens'})`);
  }

  uninstall() {
    const removed = this.cleanup();
    const file = path.join(this.target, 'AGENTS.md');
    if (fs.existsSync(file)) {
      const cur = fs.readFileSync(file, 'utf8');
      if (BLOCK_RE.test(cur)) {
        const out = cur.replace(BLOCK_RE, '').replace(/\n{3,}/g, '\n\n').replace(/\s+$/, '');
        if (out) fs.writeFileSync(file, out + '\n');
        else fs.rmSync(file);
      }
    }
    const gi = path.join(this.target, '.gitignore');
    if (fs.existsSync(gi) && GITIGNORE_RE.test(fs.readFileSync(gi, 'utf8'))) {
      const out = fs.readFileSync(gi, 'utf8').replace(GITIGNORE_RE, '').replace(/\n{3,}/g, '\n\n').replace(/\s+$/, '');
      if (out) fs.writeFileSync(gi, out + '\n');
      else fs.rmSync(gi);
    }
    fs.rmSync(this.manifest, { force: true });
    fs.rmSync(this.config, { force: true });
    this.prune(removed);
    log('désinstallé (.kagents/docs/ conservé : ce sont vos livrables)');
  }
}

// --- Question interactive -----------------------------------------------------
// Terminal utilisable : le nôtre, ou /dev/tty quand on est lancé par un postinstall (stdin/stdout détournés).
function openTTY() {
  if (process.stdin.isTTY && process.stdout.isTTY) return { input: process.stdin, output: process.stdout, close() {} };
  if (process.env.KAGENTS_FROM_POSTINSTALL && process.platform !== 'win32') {
    try {
      const rfd = fs.openSync('/dev/tty', 'r');
      const wfd = fs.openSync('/dev/tty', 'w');
      const input = new tty.ReadStream(rfd);
      const output = new tty.WriteStream(wfd);
      return { input, output, close: () => { input.destroy(); output.destroy(); } };
    } catch {
      return null;
    }
  }
  return null;
}

// Liste à cocher : ↑↓ déplacer, espace cocher, a tout, entrée valider. Renvoie les ids cochés.
function multiselect(io, message, items) {
  return new Promise((resolve) => {
    const { input, output } = io;
    const state = items.map((i) => ({ ...i }));
    let cur = 0;
    let drawn = false;
    const draw = () => {
      if (drawn) output.write(`\x1b[${state.length + 1}A`);
      drawn = true;
      output.write(`\x1b[2K\x1b[1m?\x1b[0m ${message}\n`);
      state.forEach((it, i) => {
        const box = it.checked ? '\x1b[32m◉\x1b[0m' : '◯';
        output.write(`\x1b[2K ${i === cur ? '\x1b[36m❯\x1b[0m' : ' '} ${box} ${it.label}\n`);
      });
    };
    const finish = () => {
      input.removeListener('keypress', onKey);
      input.setRawMode(false);
      input.pause();
      output.write('\x1b[?25h');
      io.close();
      resolve(state.filter((i) => i.checked).map((i) => i.id));
    };
    const onKey = (str, key = {}) => {
      if (key.ctrl && key.name === 'c') {
        output.write('\x1b[?25h\n');
        process.exit(130);
      }
      if (key.name === 'up') cur = (cur + state.length - 1) % state.length;
      else if (key.name === 'down') cur = (cur + 1) % state.length;
      else if (key.name === 'space') state[cur].checked = !state[cur].checked;
      else if (key.name === 'a') {
        const all = state.every((i) => i.checked);
        state.forEach((i) => (i.checked = !all));
      } else if (key.name === 'return') {
        draw();
        return finish();
      }
      draw();
    };
    readline.emitKeypressEvents(input);
    input.setRawMode(true);
    input.resume();
    output.write('\x1b[?25l');
    input.on('keypress', onKey);
    draw();
  });
}

async function chooseTools(inst, o) {
  if (o.tools) {
    const t = o.tools === 'auto' ? 'auto' : o.tools === 'none' ? [] : o.tools.split(',').filter(Boolean);
    if (t !== 'auto') inst.chosen = t;
    return t;
  }
  if (!o.configure) {
    const saved = inst.loadConfig();
    if (saved) return saved;
  }
  if (!o.yes && !process.env.KAGENTS_NO_PROMPT && !process.env.CI) {
    const io = openTTY();
    if (io) {
      const detected = inst.detectTools();
      const picked = await multiselect(io, 'Pour quels outils installer KAgents ?  (↑↓ espace a entrée)', [
        { id: 'claude', label: 'Claude Code  (.claude/commands, .claude/agents)', checked: detected.includes('claude') },
        { id: 'cursor', label: 'Cursor  (.cursor/commands, .cursor/agents, .cursor/rules)', checked: detected.includes('cursor') },
        { id: 'agents', label: 'Codex et autres outils AGENTS.md  (.agents/skills)', checked: true },
      ]);
      inst.chosen = picked;
      return picked;
    }
  }
  return 'auto';
}

// --- Main ---------------------------------------------------------------------
async function main() {
  const o = parseArgs(process.argv.slice(2));
  if (o.cmd === 'help') return console.log(HELP);
  if (o.cmd === 'version') return console.log(PKG.version);
  const target = process.cwd();
  if (path.resolve(target) === PKG_ROOT) die("à lancer depuis la racine d'un projet, pas depuis le kit.");
  const inst = new Installer(target, o.copy);
  if (o.cmd === 'uninstall') return inst.uninstall();
  const tools = await chooseTools(inst, o);
  inst.install(tools);
  if (inst.chosen) inst.saveConfig(inst.chosen);
}

main();
