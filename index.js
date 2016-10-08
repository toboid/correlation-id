'use strict';

const uuid = require('uuid');
const cls = require('continuation-local-storage');

const defaultCorrelatorStore = cls.createNamespace('1d0e0c48-3375-46bc-b9ae-95c63b58938e');

// TODO: what are the implications of this?
var stores = new Set()

function createCorrelator (name) {
  if (name == null) {
    throw new Error('Must supply correlator name');
  }

  let correlatorStore;

  if (stores.has(name)) {
     correlatorStore = cls.getNamespace(name);
  } else {
    correlatorStore =  cls.createNamespace(name);
    stores.add(name);
  }

  return {
    begin: begin.bind(null, correlatorStore),
    get: get.bind(null, correlatorStore)
  };
}

function begin (store, work) {
  return (...args) => {
    store.run(() => {
      store.set('correlator', uuid.v4());
      work(...args);
    })
  }
}

function get (store) {
  return store.get('correlator');
}

createCorrelator.begin = begin.bind(null, defaultCorrelatorStore)

createCorrelator.get = get.bind(null, defaultCorrelatorStore)

module.exports = createCorrelator;
