const test = require('ava');
const { base64, unbase64 } = require('../src/utils');

test('base64 converts ascii to base64', (t) => {
  t.is(
    base64('sunny weather'),
    'c3Vubnkgd2VhdGhlcg=='
  );
});

test('unbase64 converts base64 to ascii', (t) => {
  t.is(
    unbase64('c3Vubnkgd2VhdGhlcg=='),
    'sunny weather'
  );
});
