'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { fixture } = require('./fixture.cjs');
const { adopt } = require('../tools/adopt.cjs');

test('adoption preserves project policy and existing skill metadata while carrying a self-contained runtime', t => {
  const f = fixture(t);
  const header = '---\nname: begin\ndescription: Preserve this project description.\n---\n';
  const yaml = 'interface:\n  display_name: "TCTBP Begin"\n  default_prompt: "Use $begin for this project."\npolicy:\n  allow_implicit_invocation: false\n';
  f.write(f.checkout, '.agents/skills/begin/SKILL.md', `${header}\nOld project workflow\n`);
  f.write(f.checkout, '.agents/skills/begin/agents/openai.yaml', yaml);
  const policy = { branchModel: { strategy: 'intentional-fork' }, profile: { commands: { test: 'keep-actual-project-gate' } }, activation: { triggers: ['status'] } };
  f.write(f.checkout, '.github/TCTBP.json', JSON.stringify(policy));
  const result = adopt(f.checkout, { project: 'fixture', mode: 'orient', repository: { remotes: [f.remote] }, data: { kind: 'none' } }, { sourceCommit: '1'.repeat(40) });
  const actual = JSON.parse(fs.readFileSync(path.join(f.checkout, '.github/TCTBP.json')));
  assert.deepEqual(actual.branchModel, policy.branchModel); assert.deepEqual(actual.profile, policy.profile);
  assert.equal(fs.readFileSync(path.join(f.checkout, '.agents/skills/begin/agents/openai.yaml'), 'utf8'), yaml);
  assert.ok(fs.readFileSync(path.join(f.checkout, '.agents/skills/begin/SKILL.md'), 'utf8').startsWith(header));
  f.write(f.checkout, 'package.json', '{"type":"module"}'); f.commit(f.checkout, 'Adopt isolated common runtime');
  const version = JSON.parse(execFileSync(process.execPath, [path.join(f.checkout, 'scripts/tctbp-run-begin.cjs'), '--version', '--json'], { encoding: 'utf8' }));
  assert.equal(version.release, result.release);
  const report = JSON.parse(execFileSync(process.execPath, [path.join(f.checkout, 'scripts/tctbp-run-begin.cjs'), '--repo', f.checkout, '--no-actions', '--json'], { encoding: 'utf8' }));
  assert.equal(report.state, 'ORIENTED'); assert.equal(report.continuation.state, 'READ');
});
