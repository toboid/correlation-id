"use strict";

const { AsyncLocalStorage } = require("async_hooks");
const { randomUUID } = require("crypto");

const asyncLocalStorage = new AsyncLocalStorage();

module.exports = {
  withId: configureArgs(withId),
  bindId: configureArgs(bindId),
  getId,
  setId,
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
      id = randomUUID();
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

function setId(id) {
  const store = asyncLocalStorage.getStore();
  if (!store) {
    throw new Error(
      "Missing correlation scope. \nUse bindId or withId to create a correlation scope."
    );
  }
  store.id = id;
}
