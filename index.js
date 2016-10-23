'use strict';

const uuid = require('uuid');
const cls = require('continuation-local-storage');

const store = cls.createNamespace('1d0e0c48-3375-46bc-b9ae-95c63b58938e');

function withId (work) {
  if (!work) throw new Error('Missing work parameter');

  store.run(() => {
    store.set('correlator', uuid.v4());
    work();
  });
}

function bindId (work) {
  if (!work) throw new Error('Missing work parameter');

  return function () {
    store.run(() => {
      store.set('correlator', uuid.v4());
      work.apply(null, [].slice.call(arguments));
    });
  };
}

function getId () {
  return store.get('correlator');
}

function express () {
  return (req, res, next) => {
    store.run(() => {
      store.set('correlator', uuid.v4());
      next();
    });
  };
}

module.exports = {
  withId,
  bindId,
  getId,
  express
};
