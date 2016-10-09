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

test.cb('bindId correlator for sync function', t => {
  const boundFunction = correlator.bindId(() => {
    const actual = correlator.get();
    t.regex(actual, uuidMatcher, 'get() should return a uuid');
    t.end();
  });
  boundFunction();
});

test.cb('bind correlator for async function', t => {
  const boundFunction = correlator.bindId(() => {
    setTimeout(() => {
      const actual = correlator.get();
      t.regex(actual, uuidMatcher, 'get() should return a uuid');
      t.end();
    });
  });
  boundFunction();
});

test.cb('bindId correlator with arguments', t => {
  const boundFunction = correlator.bindId((...args) => {
    const actual = args;
    const expected = ['firstArg', 'secondArg'];
    t.deepEqual(actual, expected, 'bindId() should return a function that forwards arguments');
    t.end();
  });
  boundFunction('firstArg', 'secondArg');
});