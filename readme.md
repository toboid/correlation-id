[![Build Status](https://travis-ci.org/toboid/correlation-id.svg?branch=master)](https://travis-ci.org/toboid/correlation-id)
[![Coverage Status](https://coveralls.io/repos/github/toboid/correlation-id/badge.svg?branch=master)](https://coveralls.io/github/toboid/correlation-id?branch=master)
[![Dependencies](https://david-dm.org/toboid/correlation-id.svg)](https://github.com/toboid/correlation-id/blob/master/package.json)
[![npm version](https://badge.fury.io/js/correlation-id.svg)](https://badge.fury.io/js/correlation-id)

# Correlation id
Correlation id maintains a consistent id across asynchronous calls in node.js applications.
This is extremely useful for logging purposes. For example within a web application, each incoming request can be assigned an id that will be available in all function calls made processing that request, so we can see which requests caused errors.

## Installation
```shell
npm i correlation-id --save
```

## Simple example
As demonstrated by this example, all calls to `getId()` within the same `withId()` block will return the same id.
``` javascript
const correlator = require('correlation-id');

function printCurrentId (name) {
  console.log('%s id: %s', name, correlator.getId())
}

correlator.withId(() => {
  setTimeout(() => {
    printCurrentId('withId block 1, call 1')
  });
  setTimeout(() => {
    printCurrentId('withId block 1, call 2')
  }, 1000);
});
correlator.withId(() => {
  setTimeout(() => {
    printCurrentId('withId block 2, call 1')
  }, 500);
});

// Output:
// withId block 1, call 1 id: 5816e2d3-6b90-43be-8738-f6e1b2654f39
// withId block 2, call 1 id: 1f5f051d-0b98-489e-8c46-b9b0a0f9be09
// withId block 1, call 2 id: 5816e2d3-6b90-43be-8738-f6e1b2654f39
```

## Express middleware
An express middleware is included. All middleware and route handlers following `correlator.express()` middleware will be within a single correlation scope.

```javascript
const correlator = require('correlation-id');
const express = require('express');

const app = express()
app.use(correlator.express());

app.get('/', (req, res) => {
  console.log('ID for this request is:', correlator.getId())
  res.end()
})
```

## API
### `withId(work)`
Executes function `work` within a correlation scope. Within work and any other function executions (sync or async) calls to `getId()` will return the same id.
Calls to `withId()` may be nested.

```javascript
correlator.withId(() => {
  console.log(correlator.getId()) // Writes a uuid to stdout
})
```

### `bindId(work)`
Returns function `work` bound with a correlation scope. When `work` is executed all calls to `getId()` will return the same id. Arguments passed to the bound function will be propagated to `work`.

```javascript
const boundFunction = correlator.bindId((p1) => {
  console.log('p1 is', p1)
  console.log(correlator.getId())
})
boundFunction('foo') // Writes 'p1 is foo' and then a uuid to stdout
```

### `getId()`
Returns a uuid for the current correlation scope (created via `withId` or `bindId`). If called outside of a correlation scope returns `undefined`.

```javascript
correlator.getId() // Returns a uuid
```

### `express()`
Returns an express middleware that creates a correlation scope for all following middleware and route handlers.

```javascript
const app = express()
app.use(correlator.express())
```

## How does it work?
Currently this module a slim wrapper over [continuation-local-storage](https://github.com/othiym23/node-continuation-local-storage). I intend to move to async-hook when it's generally available.

## License
MIT