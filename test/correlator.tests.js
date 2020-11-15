'use strict';

const test = require('ava');
const correlator = require('../index');

const uuidMatcher = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

test.cb('withId correlator for sync function', t => {
  correlator.withId(() => {
    const actual = correlator.getId();
    t.regex(actual, uuidMatcher, 'getId() should return a uuid');
    t.end();
  });
});

test.cb('withId correlator for async function', t => {
  correlator.withId(() => {
    setTimeout(() => {
      const actual = correlator.getId();
      t.regex(actual, uuidMatcher, 'getId() should return a uuid');
      t.end();
    });
  });
});

test('withId correlator for async function returning value', async t => {
  const actual = await correlator.withId(() => {
    return 'foo';
  });
  t.is(actual, 'foo', 'withId() should return value returned by callback');
});

test.cb('withId with supplied id', t => {
  const testId = 'id-1';
  correlator.withId(testId, () => {
    const actual = correlator.getId();
    t.is(actual, testId, 'getId() should return supplied id');
    t.end();
  });
});

test.cb('bindId correlator for sync function', t => {
  const boundFunction = correlator.bindId(() => {
    const actual = correlator.getId();
    t.regex(actual, uuidMatcher, 'getId() should return a uuid');
    t.end();
  });
  boundFunction();
});

test.cb('bindId correlator for async function', t => {
  const boundFunction = correlator.bindId(() => {
    setTimeout(() => {
      const actual = correlator.getId();
      t.regex(actual, uuidMatcher, 'getId() should return a uuid');
      t.end();
    });
  });
  boundFunction();
});

test('bindId correlator for async function returning value', async t => {
  const boundFunction = correlator.bindId(() => {
    return 'foo';
  });
  const actual = await boundFunction();
  t.is(actual, 'foo', 'bindId() should return value from callback function');
});

test.cb('bindId with supplied id', t => {
  const testId = 'id-1';
  const boundFunction = correlator.bindId(testId, () => {
    const actual = correlator.getId();
    t.is(actual, testId, 'getId() should return supplied id');
    t.end();
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
    const actualOuterScope1 = correlator.getId();
    t.regex(actualOuterScope1, uuidMatcher, 'correlator.getId() should return a uuid');
    correlator.withId(() => {
      const actualInnerScope = correlator.getId();
      t.not(actualInnerScope, actualOuterScope1, 'correlator.getId() should return a different id for eachcorrect id for scope');
      t.regex(actualInnerScope, uuidMatcher, 'correlator.getId() should return a uuid');
    });
    const actualOuterScope2 = correlator.getId();
    t.is(actualOuterScope2, actualOuterScope1, 'correlator.getId() should return the same id within correlation scope');
    t.regex(actualOuterScope2, uuidMatcher, 'correlator.getId() should return a uuid');
    t.end();
  });
});

test.cb('nested bindId correlator', t => {
  const outerBoundFunction = correlator.bindId(() => {
    const actualOuterScope1 = correlator.getId();
    t.regex(actualOuterScope1, uuidMatcher, 'correlator.getId() should return a uuid');
    const innerBoundFunction = correlator.bindId(() => {
      const actualInnerScope = correlator.getId();
      t.not(actualInnerScope, actualOuterScope1, 'correlator.getId() should return a different id for eachcorrect id for scope');
      t.regex(actualInnerScope, uuidMatcher, 'correlator.getId() should return a uuid');
    });
    innerBoundFunction();
    const actualOuterScope2 = correlator.getId();
    t.is(actualOuterScope2, actualOuterScope1, 'correlator.getId() should return the same id within correlation scope');
    t.regex(actualOuterScope2, uuidMatcher, 'correlator.getId() should return a uuid');
    t.end();
  });
  outerBoundFunction();
});

test.cb('withId works with native promises', t => {
  const promiseForId = () => Promise.resolve(correlator.getId());

  correlator.withId(() => {
    promiseForId()
      .then(id => {
        t.regex(id, uuidMatcher, 'Promise should resolve correlation id');
        t.is(id, correlator.getId(), 'getId() should return a consistent id within a correlation scope');
        t.end();
      });
  });
});

test('withId works with async/await', async t => {
  const promiseForId = () => Promise.resolve(correlator.getId());

  correlator.withId(async () => {
    const id = await promiseForId();
    t.regex(id, uuidMatcher, 'Promise should resolve correlation id');
    t.is(id, correlator.getId(), 'getId() should return a consistent id within a correlation scope');
  });
});

test('withId throws for missing work paramter', t => {
  t.throws(() => correlator.withId(), { message: 'Missing work parameter' }, 'withId() should throw if work parameter is missing');
});

test('bindId throws for missing work paramter', t => {
  t.throws(() => correlator.bindId(), { message: 'Missing work parameter' }, 'bindId() should throw if work parameter is missing');
});

