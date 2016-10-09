'use strict';

const uuid = require('uuid');
const cls = require('continuation-local-storage');

const store = cls.createNamespace('1d0e0c48-3375-46bc-b9ae-95c63b58938e');

function withId (work) {
  store.run(() => {
    store.set('correlator', uuid.v4());
    work();
  });
}

function bindId (work) {
  return (...args) => {
    store.run(() => {
      store.set('correlator', uuid.v4());
      work(...args);
    });
  };
}

function getId () {
  return store.get('correlator');
}

module.exports = {
  withId,
  bindId,
  getId
};
