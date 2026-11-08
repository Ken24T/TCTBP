'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

function fixture(t) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'begin installed '));
  t.after(() => fs.rmSync(home, { recursive: true, force: true }));
  const root = path.join(home, 'release'), configDirectory = path.join(home, '.config/tctbp-begin');
  fs.mkdirSync(path.join(root, 'core'), { recursive: true }); fs.mkdirSync(configDirectory, { recursive: true });
  const cli = path.join(root, 'core/cli.cjs'); fs.writeFileSync(cli, 'console.log(JSON.stringify({received:process.argv.slice(2)}));');
  const manifest = path.join(root, 'release.json');
  fs.writeFileSync(manifest, JSON.stringify({ contract: 'tctbp-begin/1', coreRelease: 'a'.repeat(64), files: { 'core/cli.cjs': hash(cli) } }));
  const node = fs.realpathSync(process.execPath);
  const pointer = { schemaVersion: 1, node, nodeSha256: hash(node), manifest, manifestSha256: hash(manifest), coreRelease: 'a'.repeat(64) };
  const configFile = path.join(configDirectory, 'current.json');
  const write = () => fs.writeFileSync(configFile, JSON.stringify(pointer), { mode: 0o600 }); write();
  const run = args => spawnSync('python3', [path.resolve(__dirname, '../tools/installed-begin.py'), ...args], { env: { ...process.env, HOME: home }, encoding: 'utf8' });
  return { home, cli, pointer, configFile, write, run };
}
test('host launcher preserves exact argument boundaries for checkout paths with spaces', t => {
  const f = fixture(t), args = ['--repo', path.join(f.home, 'selected checkout'), '--no-actions', '--json'];
  const result = f.run(args); assert.equal(result.status, 0, result.stderr); assert.deepEqual(JSON.parse(result.stdout).received, args);
});
test('changed core or Node pins block before executing the selected program', t => {
  const f = fixture(t); f.pointer.nodeSha256 = '0'.repeat(64); f.write();
  assert.equal(JSON.parse(f.run(['--json']).stdout).state, 'BLOCKED');
  f.pointer.nodeSha256 = hash(f.pointer.node); f.write(); fs.appendFileSync(f.cli, '\n// changed core\n');
  assert.equal(JSON.parse(f.run(['--json']).stdout).state, 'BLOCKED');
});
test('a publicly writable runtime pointer cannot select a program', t => {
  const f = fixture(t); fs.chmodSync(f.configFile, 0o666); const result = f.run(['--json']);
  assert.equal(result.status, 1); assert.equal(JSON.parse(result.stdout).state, 'BLOCKED');
});
test('an inspect-only rollback pin cannot resume through the host launcher', t => {
  const f = fixture(t), manifest = path.join(f.home, 'release/release.json');
  const release = JSON.parse(fs.readFileSync(manifest)); release.inspectOnly = true;
  fs.writeFileSync(manifest, JSON.stringify(release)); f.pointer.manifestSha256 = hash(manifest); f.write();
  const result = f.run(['--repo', path.join(f.home, 'selected'), '--json']);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout).received, ['--repo', path.join(f.home, 'selected'), '--json', '--no-actions']);
});
