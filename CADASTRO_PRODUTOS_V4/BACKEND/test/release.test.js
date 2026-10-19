'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..', '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');

test('release includes the expected route entrypoints, docs and npm lockfile', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['check:production'], 'node scripts/check-production.js');
  for (const name of [
    'package-lock.json', 'vercel.json',
    'api/index.js', 'api/config.js', 'api/login.js', 'api/logout.js', 'api/session.js',
    'FRONTEND/index.html', 'FRONTEND/login.html', 'FRONTEND/login.js',
    'BACKEND/migrations/001-authentication.sql', 'BACKEND/check-schema.sql'
  ]) {
    assert.equal(fs.existsSync(path.join(root, name)), true, `${name} must exist`);
  }
});

test('git and Vercel ignore local secrets and databases', () => {
  assert.match(read('.gitignore'), /\.env\*/);
  const ignored = read('.vercelignore');
  assert.match(ignored, /\*\*\/\.env\.\*/);
  assert.match(ignored, /\*\*\/\*\.db/);
  assert.match(ignored, /\.git\/\*\*/);
});
