'use strict';

const uuid = require('uuid');
const cls = require('continuation-local-storage');

const defaultCorrelatorStore = cls.createNamespace('1d0e0c48-3375-46bc-b9ae-95c63b58938e');

defaultCorrelatorStore.set('correlator', uuid.v4());

function createCorrelator (name) {
  if (name == null) {
    throw new Error('Must supply correlator name');
  }

  const correlatorStore = cls.createNamespace(name);

  return {
    begin: begin.bind(null, correlatorStore),
    get: get.bind(null, correlatorStore)
  };
}

function begin (store, work) {
  store.run(() => {
    store.set('correlator', uuid.v4());
    work();
  })
}

function get (store) {
  store.get('correlator');
}

createCorrelator.begin = begin.bind(null, defaultCorrelatorStore)

createCorrelator.get = get.bind(null, defaultCorrelatorStore)

module.exports = createCorrelator;
