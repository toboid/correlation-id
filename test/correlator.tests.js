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

test.cb('nested withId correlator', t => {
  correlator.withId(() => {
    const actualOuterScope1 = correlator.get();
    t.regex(actualOuterScope1, uuidMatcher, 'correlator.get() should return a uuid');
    correlator.withId(() => {
      const actualInnerScope = correlator.get();
      t.not(actualInnerScope, actualOuterScope1, 'correlator.get() should return a different id for eachcorrect id for scope');
      t.regex(actualInnerScope, uuidMatcher, 'correlator.get() should return a uuid');
    });
    const actualOuterScope2 = correlator.get();
    t.is(actualOuterScope2, actualOuterScope1, 'correlator.get() should return the same id within correlation scope');
    t.regex(actualOuterScope2, uuidMatcher, 'correlator.get() should return a uuid');
    t.end();
  });
});

test.cb('nested bindId correlator', t => {
  const outerBoundFunction = correlator.bindId(() => {
    const actualOuterScope1 = correlator.get();
    t.regex(actualOuterScope1, uuidMatcher, 'correlator.get() should return a uuid');
    const innerBoundFunction = correlator.bindId(() => {
      const actualInnerScope = correlator.get();
      t.not(actualInnerScope, actualOuterScope1, 'correlator.get() should return a different id for eachcorrect id for scope');
      t.regex(actualInnerScope, uuidMatcher, 'correlator.get() should return a uuid');
    });
    innerBoundFunction()
    const actualOuterScope2 = correlator.get();
    t.is(actualOuterScope2, actualOuterScope1, 'correlator.get() should return the same id within correlation scope');
    t.regex(actualOuterScope2, uuidMatcher, 'correlator.get() should return a uuid');
    t.end();
  });
  outerBoundFunction();
});
