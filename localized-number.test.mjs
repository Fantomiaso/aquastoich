import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalNumberText, decimalSeparator, normalizeLocalizedNumberText } from './localized-number.mjs';

test('decimal separator follows the active locale', () => {
  assert.equal(decimalSeparator('en-US'), '.');
  assert.equal(decimalSeparator('ru-RU'), ',');
  assert.equal(decimalSeparator('de-DE'), ',');
  assert.equal(decimalSeparator('es-ES'), ',');
});

test('dot and comma are accepted and normalized to the locale', () => {
  assert.equal(normalizeLocalizedNumberText('12.5', 'ru-RU'), '12,5');
  assert.equal(normalizeLocalizedNumberText('12,5', 'en-US'), '12.5');
  assert.equal(normalizeLocalizedNumberText('0,125', 'de-DE'), '0,125');
});

test('finalized numeric input has a canonical machine representation', () => {
  assert.equal(normalizeLocalizedNumberText(',5', 'ru-RU', { finalize: true }), '0,5');
  assert.equal(normalizeLocalizedNumberText('7,', 'ru-RU', { finalize: true }), '7');
  assert.equal(canonicalNumberText('-1,25'), '-1.25');
});
