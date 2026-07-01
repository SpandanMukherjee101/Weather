const test = require('node:test');
const assert = require('node:assert/strict');
const { isValidEmail, isStrongPassword, normalizeText } = require('../utils/validation');

test('validates email addresses', () => {
  assert.equal(isValidEmail('user@example.com'), true);
  assert.equal(isValidEmail('invalid-email'), false);
  assert.equal(isValidEmail(''), false);
});

test('validates password strength', () => {
  assert.equal(isStrongPassword('Abcdef1!'), true);
  assert.equal(isStrongPassword('password'), false);
  assert.equal(isStrongPassword('ABC123!'), false);
});

test('normalizes text input', () => {
  assert.equal(normalizeText('  New   York  '), 'New York');
  assert.equal(normalizeText('   '), '');
});
