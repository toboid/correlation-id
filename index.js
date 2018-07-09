'use strict';

const uuid = require('uuid');
const cls = require('cls-hooked');

const store = cls.createNamespace('1d0e0c48-3375-46bc-b9ae-95c63b58938e');

module.exports = {
  withId: configureArgs(withId),
  bindId: configureArgs(bindId),
  getId
};

function withId (id, work) {
  return store.runAndReturn(() => {
    store.set('correlator', id);
    return work();
  });
}

function bindId (id, work) {
  return function () {
    return store.runAndReturn(() => {
      store.set('correlator', id);
      return work.apply(null, [].slice.call(arguments));
    });
  };
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

function isFunction (object) {
  return typeof object === 'function';
}

function getId () {
  return store.get('correlator');
}
