const test = require('node:test');
const assert = require('node:assert/strict');
const { getJwtSecret } = require('../utils/authConfig');

test('uses configured JWT secret when present', () => {
  process.env.JWT_SECRET = 'from-env';
  assert.equal(getJwtSecret(), 'from-env');
});

test('falls back to a default JWT secret when env is missing', () => {
  delete process.env.JWT_SECRET;
  const secret = getJwtSecret();
  assert.equal(typeof secret, 'string');
  assert.ok(secret.length > 0);
});
