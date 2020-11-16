"use strict";

const { AsyncLocalStorage } = require("async_hooks");
const uuid = require("uuid");

const asyncLocalStorage = new AsyncLocalStorage();

module.exports = {
  withId: configureArgs(withId),
  bindId: configureArgs(bindId),
  getId,
};

function withId(id, work) {
  return asyncLocalStorage.run({ id }, () => work());
}

function bindId(id, work) {
  return (...args) => asyncLocalStorage.run({ id }, () => work(...args));
}

function configureArgs(func) {
  return (id, work) => {
    if (!work && isFunction(id)) {
      work = id;
      id = uuid.v4();
    }
    if (!work) throw new Error("Missing work parameter");

    return func(id, work);
  };
}

function isFunction(object) {
  return typeof object === "function";
}

function getId() {
  const store = asyncLocalStorage.getStore();
  return store && store.id;
}
