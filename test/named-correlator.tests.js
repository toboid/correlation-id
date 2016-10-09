'use strict';

const test = require('ava');
const correlationId = require('../index');

const uuidMatcher = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

test.cb('named withId correlator', t => {
  const correlator = correlationId('my-correlator');
  correlator.withId(() => {
    const actual = correlator.get();
    t.regex(actual, uuidMatcher, 'get() should return a uuid');
    t.end();
  });
});

test.cb('named bindId correlator', t => {
  const correlator = correlationId('my-correlator');
  const boundFunction = correlator.bindId(() => {
    const actual = correlator.get();
    t.regex(actual, uuidMatcher, 'get() should return a uuid');
    t.end();
  });
  boundFunction();
});

test.cb('nested named withId correlator', t => {
  const correlatorOne = correlationId('first-correlator');
  correlatorOne.withId(() => {
    const correlatorTwo = correlationId('second-correlator');
    correlatorTwo.withId(() => {
      const actualOne = correlatorOne.get();
      t.regex(actualOne, uuidMatcher, 'correlatorOne.get() should return a uuid');
      const actualTwo = correlatorTwo.get();
      t.regex(actualTwo, uuidMatcher, 'correlatorTwo.get() should return a uuid');
      t.not(actualOne, actualTwo, ' correlatorOne.get() and correlatorTwo.get() should return different ids');
      t.end();
    });
  });
});

test.cb('nested named bindId correlator', t => {
  const correlatorOne = correlationId('first-correlator');
  const boundFunctionOne = correlatorOne.bindId(() => {
    const correlatorTwo = correlationId('second-correlator');
    const boundFunctionTwo = correlatorTwo.bindId(() => {
      const actualOne = correlatorOne.get();
      t.regex(actualOne, uuidMatcher, 'correlatorOne.get() should return a uuid');
      const actualTwo = correlatorTwo.get();
      t.regex(actualTwo, uuidMatcher, 'correlatorTwo.get() should return a uuid');
      t.not(actualOne, actualTwo, ' correlatorOne.get() and correlatorTwo.get() should return different ids');
      t.end();
    });
    boundFunctionTwo();
  });
  boundFunctionOne();
});
