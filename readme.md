# Correlation id

Correlation id maintains a consistent id across asynchronous calls in node.js applications; this is especially useful for logging purposes.

For example within an API, each incoming request can be assigned an id that will be available in all function calls made processing that request, so we can see which requests caused errors.

100% test coverage, no prod dependencies.

## Installation

yarn:

```shell
yarn add correlation-id
```

npm:

```shell
npm i correlation-id --save
```

## Compatibility

From v5 onwards this library requires node >=14. For older node versions use v3.x or v4.x.

## Simple example

As demonstrated by this example, all calls to `getId()` within the same `withId()` block will return the same id. The id can be supplied, otherwise a v4 uuid will be generated.

```javascript
const correlator = require("correlation-id");

function printCurrentId(name) {
  console.log("%s id: %s", name, correlator.getId());
}

correlator.withId(() => {
  setTimeout(() => {
    printCurrentId("withId block 1, call 1");
  });
  setTimeout(() => {
    printCurrentId("withId block 1, call 2");
  }, 1000);
});

correlator.withId("my-custom-id", () => {
  setTimeout(() => {
    printCurrentId("withId block 2, call 1");
  }, 500);
});

// Output:
// withId block 1, call 1 id: 5816e2d3-6b90-43be-8738-f6e1b2654f39
// withId block 2, call 1 id: my-custom-id
// withId block 1, call 2 id: 5816e2d3-6b90-43be-8738-f6e1b2654f39
```

## API

### `withId([id,] work)`

Executes function `work` within a correlation scope and returns any result returned from `work`. Within work and any other function executions (sync or async) calls to `getId()` will return the same id. The id for the context may be set explicitly with the optional `id` parameter, otherwise it will be a v4 uuid. Calls to `withId()` may be nested.

```javascript
correlator.withId(() => {
  console.log(correlator.getId()); // Writes a uuid to stdout
});
correlator.withId("my-custom-id", () => {
  console.log(correlator.getId()); // Writes 'my-custom-id' to stdout
});
```

### `bindId([id,] work)`

Returns function `work` bound with a correlation scope. When `work` is executed all calls to `getId()` will return the same id. The id for the context may be set explicitly with the optional `id` parameter, otherwise it will be a v4 uuid. Arguments passed to the bound function will be applied to `work`.

```javascript
const boundFunction = correlator.bindId((p1) => {
  console.log("p1 is", p1);
  console.log(correlator.getId());
});
boundFunction("foo"); // Writes 'p1 is foo' and then a uuid to stdout

const boundFunction2 = correlator.bindId("my-custom-id", (p1) => {
  console.log("p1 is", p1);
  console.log(correlator.getId());
});
boundFunction2("foo"); // Writes 'p1 is foo' and then 'my-custom-id' to stdout
```

### `getId()`

Returns the id for the current correlation scope (created via `withId` or `bindId`). If called outside of a correlation scope returns `undefined`.

```javascript
correlator.getId(); // Returns the current id or undefined
```

### `setId(id)`

Sets the id for the current correlation scope (created via `withId` or `bindId`). If called outside of a correlation scope throws an error.

```javascript
correlator.setId("my-correlation-id");
```

## Typescript

Type defs are included.

## License

MIT
