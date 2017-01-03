'use strict';

const uuid = require('uuid');
const cls = require('continuation-local-storage');

function isFunction (object) {
  return typeof object === 'function';
}

function configureArgs (func) {
  return (id, work) => {
    if (!work && isFunction(id)) {
      work = id;
      id = uuid.v4();
    }
    if (!work) throw new Error('Missing work parameter');

    return func(id, work);
  };
}

const store = cls.createNamespace('1d0e0c48-3375-46bc-b9ae-95c63b58938e');

const withId = configureArgs((id, work) => {
  store.run(() => {
    store.set('correlator', id);
    work();
  });
});

const bindId = configureArgs((id, work) => {
  return function () {
    store.run(() => {
      store.set('correlator', id);
      work.apply(null, [].slice.call(arguments));
    });
  };
});

function getId () {
  return store.get('correlator');
}

module.exports = {
  withId,
  bindId,
  getId
};
