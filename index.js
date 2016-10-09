'use strict';

const uuid = require('uuid');
const cls = require('continuation-local-storage');

const defaultCorrelatorStore = cls.createNamespace('1d0e0c48-3375-46bc-b9ae-95c63b58938e');

// TODO: what are the implications of this? Might be able to try and get the namespace and just create it if it doesn't exist
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
    withId: withId.bind(null, correlatorStore),
    get: get.bind(null, correlatorStore)
  };
}

function withId (store, work) {
  store.run(() => {
    store.set('correlator', uuid.v4());
    work();
  })
}

function _bind (store, work) {
  console.log('begginging');
  return (...args) => {
    console.log('args', args);
    store.run(() => {
      console.log('running');
      store.set('correlator', uuid.v4());
      work(...args);
    })
  }
}

function get (store) {
  return store.get('correlator');
}

createCorrelator.withId = withId.bind(null, defaultCorrelatorStore)

createCorrelator.bind = _bind.bind(null, defaultCorrelatorStore)

createCorrelator.get = get.bind(null, defaultCorrelatorStore)

module.exports = createCorrelator;
