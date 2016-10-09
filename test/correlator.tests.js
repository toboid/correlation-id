'use strict';

const test = require('ava');
const correlator = require('../index');

const uuidMatcher = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

test.cb('withId correlator for sync function', t => {
  correlator.withId(() => {
    const actual = correlator.get();
    t.regex(actual, uuidMatcher, 'get() should return a uuid');
    t.end();
  });
});

test.cb('withId correlator for async function', t => {
  correlator.withId(() => {
    setTimeout(() => {
      const actual = correlator.get();
      t.regex(actual, uuidMatcher, 'get() should return a uuid');
      t.end();
    });
  });
});