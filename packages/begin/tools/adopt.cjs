#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { VERSION, releaseIdentity } = require('../lib/begin.cjs');
const { hash } = require('../lib/process.cjs');
const { update } = require('./json-property.cjs');
const source = path.resolve(__dirname, '..');
const runtimeFiles = () => ['cli.cjs', 'package.json', ...fs.readdirSync(path.join(source, 'lib')).filter(name => name.endsWith('.cjs')).sort().map(name => `lib/${name}`)];

function adopt(target, profile, { canonical = false, sourceCommit = null } = {}) {
  if (!path.isAbsolute(target) || fs.realpathSync(target) !== target) throw new Error('Select the real absolute authoring checkout.');
  const top = execFileSync('git', ['-C', target, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  if (top !== target) throw new Error('Target must be a Git worktree root.');
  if (!['inspect', 'orient', 'resume'].includes(profile.mode) || !profile.project || !profile.repository) throw new Error('Provide an explicit project-owned profile.');
  const changed = [];
  function write(relative, bytes) {
    const filename = path.join(target, relative);
    for (let parent = filename; parent !== target; parent = path.dirname(parent)) {
      if (!parent.startsWith(`${target}${path.sep}`) || fs.existsSync(parent) && fs.lstatSync(parent).isSymbolicLink()) throw new Error('Managed destination contains an escaping or symbolic path.');
    }
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    if (!fs.existsSync(filename) || !fs.readFileSync(filename).equals(Buffer.from(bytes))) {
      fs.writeFileSync(filename, bytes); changed.push(relative);
    }
  }
  if (!canonical) {
    for (const file of runtimeFiles()) write(`scripts/tctbp-begin/${file}`, fs.readFileSync(path.join(source, file)));
    // The same behavioral fixtures travel with the runtime for local conformance checks.
    for (const file of ['fixture.cjs', 'contract.test.cjs', 'partial-clone.test.cjs']) {
      write(`scripts/tctbp-begin/test/${file}`, fs.readFileSync(path.join(source, 'test', file)));
    }
    write('scripts/tctbp-run-begin.cjs', fs.readFileSync(path.join(source, 'templates/tctbp-run-begin.cjs')));
    write('docs/BEGIN_CONTRACT.md', fs.readFileSync(path.resolve(source, '../../docs/BEGIN_CONTRACT.md')));
  } else write('scripts/tctbp-run-begin.cjs', "#!/usr/bin/env node\n'use strict';\nrequire('../packages/begin/cli.cjs');\n");
  const skillPath = '.agents/skills/begin/SKILL.md';
  const template = fs.readFileSync(path.join(source, 'templates/begin/SKILL.md'), 'utf8');
  const existing = fs.existsSync(path.join(target, skillPath)) ? fs.readFileSync(path.join(target, skillPath), 'utf8') : null;
  if (existing) {
    const header = /^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(existing);
    if (!header) throw new Error('Existing Begin skill has no valid frontmatter; review it manually.');
    write(skillPath, header[0] + template.replace(/^---\n[\s\S]*?\n---\n/, ''));
  } else write(skillPath, template);
  const yaml = '.agents/skills/begin/agents/openai.yaml';
  if (!fs.existsSync(path.join(target, yaml))) write(yaml, fs.readFileSync(path.join(source, 'templates/begin/agents/openai.yaml')));
  const release = releaseIdentity();
  write('.github/TCTBP_BEGIN.json', `${JSON.stringify({ schemaVersion: 1, contract: 'tctbp-begin/1', ...profile, runtimeRelease: release }, null, 2)}\n`);
  const provenance = { schemaVersion: 1, owner: 'Ken24T/TCTBP', sourceCommit, version: VERSION, release,
    files: Object.fromEntries(runtimeFiles().map(file => [file, hash(fs.readFileSync(path.join(source, file)))])) };
  write('.github/TCTBP_BEGIN_SOURCE.json', `${JSON.stringify(provenance, null, 2)}\n`);
  const policyPath = path.join(target, '.github/TCTBP.json');
  if (fs.existsSync(policyPath)) {
    let policyText = fs.readFileSync(policyPath, 'utf8');
    const policy = JSON.parse(policyText);
    policy.begin = { contract: 'tctbp-begin/1', executionCommand: 'node scripts/tctbp-run-begin.cjs', profile: '.github/TCTBP_BEGIN.json', owner: 'TCTBP common core; project-owned capabilities' };
    if (policy.activation?.triggers) for (const trigger of ['begin', 'begin please']) {
      if (!policy.activation.triggers.includes(trigger)) policy.activation.triggers.push(trigger);
    }
    policyText = update(policyText, ['begin'], policy.begin);
    if (policy.activation?.triggers) policyText = update(policyText, ['activation', 'triggers'], policy.activation.triggers);
    if (JSON.stringify(JSON.parse(policyText)) !== JSON.stringify(policy)) throw new Error('Scoped policy edit changed unrelated fields.');
    write('.github/TCTBP.json', policyText);
  }
  return { project: profile.project, mode: profile.mode, release, changed };
}

if (require.main === module) {
  const [target, profileFile] = process.argv.slice(2);
  if (!target || !profileFile || process.argv.length !== 4) throw new Error('Usage: adopt.cjs <absolute-isolated-worktree> <explicit-profile.json>');
  console.log(JSON.stringify(adopt(target, JSON.parse(fs.readFileSync(profileFile)))));
}
module.exports = { adopt, runtimeFiles };
