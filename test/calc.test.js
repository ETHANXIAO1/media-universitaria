// calc.test.js — test automatici per le funzioni di calc.js.
//
// Usa SOLO strumenti già inclusi in Node.js (node:test e node:assert),
// quindi NON serve installare nulla. Per lanciarli:
//
//     npm test
//
// oppure direttamente:
//
//     node --test

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  validaEsame,
  totaleCfu,
  mediaPonderata,
  mediaAritmetica,
  votoDiLaurea,
  numeroLodi,
} = require('../src/calc.js');

test('mediaPonderata pesa i voti sui CFU', () => {
  const esami = [
    { voto: 30, cfu: 10, lode: false },
    { voto: 20, cfu: 10, lode: false },
  ];
  // (30*10 + 20*10) / 20 = 25
  assert.equal(mediaPonderata(esami), 25);
});

test('mediaPonderata diversa dalla media semplice quando i CFU differiscono', () => {
  const esami = [
    { voto: 30, cfu: 12, lode: false },
    { voto: 18, cfu: 6, lode: false },
  ];
  // (30*12 + 18*6) / 18 = 468 / 18 = 26
  assert.equal(mediaPonderata(esami), 26);
});

test('mediaPonderata restituisce null senza CFU', () => {
  assert.equal(mediaPonderata([]), null);
});

test('mediaAritmetica fa la media semplice dei voti', () => {
  const esami = [
    { voto: 28, cfu: 6, lode: false },
    { voto: 30, cfu: 6, lode: false },
  ];
  assert.equal(mediaAritmetica(esami), 29);
});

test('mediaAritmetica restituisce null senza esami', () => {
  assert.equal(mediaAritmetica([]), null);
});

test('totaleCfu somma tutti i crediti', () => {
  const esami = [
    { voto: 25, cfu: 9, lode: false },
    { voto: 27, cfu: 6, lode: false },
  ];
  assert.equal(totaleCfu(esami), 15);
});

test('votoDiLaurea converte la media in base 110', () => {
  // 30 -> 110, 27 -> 99
  assert.equal(votoDiLaurea(30), 110);
  assert.equal(votoDiLaurea(27), 99);
});

test('votoDiLaurea gestisce il valore null', () => {
  assert.equal(votoDiLaurea(null), null);
});

test('numeroLodi conta solo le lodi', () => {
  const esami = [
    { voto: 30, cfu: 6, lode: true },
    { voto: 30, cfu: 6, lode: true },
    { voto: 28, cfu: 6, lode: false },
  ];
  assert.equal(numeroLodi(esami), 2);
});

test('validaEsame segnala voto fuori intervallo e CFU non positivi', () => {
  assert.ok(validaEsame({ voto: 35, cfu: 6 }).length > 0);
  assert.ok(validaEsame({ voto: 27, cfu: 0 }).length > 0);
  assert.equal(validaEsame({ voto: 27, cfu: 6 }).length, 0);
});
