"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const correlator = require("../index");

const uuidMatcher =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const pause = async (waitTime) =>
  new Promise((resolve) => setTimeout(resolve, waitTime));

describe("withId", () => {
  it("sets correlator for sync function", () => {
    let id;

    correlator.withId(() => {
      id = correlator.getId();
    });

    assert.match(id, uuidMatcher);
  });

  it("sets correlator for async function", async () => {
    let id;

    await correlator.withId(async () => {
      await pause(1);
      id = correlator.getId();
    });

    assert.match(id, uuidMatcher);
  });

  it("sets correlator to supplied id", async () => {
    const testId = "id-1";
    let id;

    await correlator.withId(testId, async () => {
      await pause(1);
      id = correlator.getId();
    });

    assert.equal(id, testId);
  });

  it("supports nested correlators", async () => {
    let outerCorrelationId1;
    let innerCorrelationId;
    let outerCorrelationId2;

    await correlator.withId(async () => {
      await pause(1);
      outerCorrelationId1 = correlator.getId();

      await correlator.withId(async () => {
        await pause(1);
        innerCorrelationId = correlator.getId();
      });

      outerCorrelationId2 = correlator.getId();
    });

    assert.match(outerCorrelationId1, uuidMatcher);
    assert.match(innerCorrelationId, uuidMatcher);
    assert.notEqual(outerCorrelationId1, innerCorrelationId);
    assert.equal(outerCorrelationId2, outerCorrelationId1);
  });

  it("forwards return value from callback", async () => {
    const result = await correlator.withId(async () => {
      await pause(1);
      return "foo";
    });

    assert.equal(result, "foo");
  });

  it("throws if work parameter is missing", () => {
    assert.throws(
      () => correlator.withId(),
      new Error("Missing work parameter")
    );
  });
});

describe("bindId", () => {
  it("sets correlator for sync function", () => {
    let id;

    const boundFunction = correlator.bindId(() => {
      id = correlator.getId();
    });

    boundFunction();

    assert.match(id, uuidMatcher);
  });

  it("sets correlator for async function", async () => {
    let id;

    const boundFunction = correlator.bindId(async () => {
      await pause(1);
      id = correlator.getId();
    });

    await boundFunction();

    assert.match(id, uuidMatcher);
  });

  it("forwards return value from callback", async () => {
    const boundFunction = correlator.bindId(async () => {
      await pause(1);
      return "foo";
    });

    const result = await boundFunction();

    assert.equal(result, "foo");
  });

  it("sets correlator to supplied id", async () => {
    const testId = "id-1";
    let id;

    const boundFunction = correlator.bindId(testId, async () => {
      await pause(1);
      id = correlator.getId();
    });
    await boundFunction();

    assert.equal(id, testId);
  });

  it("supports nested correlators", async () => {
    let outerCorrelationId1;
    let innerCorrelationId;
    let outerCorrelationId2;

    const outerBoundFunction = correlator.bindId(async () => {
      await pause(1);

      outerCorrelationId1 = correlator.getId();

      const innerBoundFunction = correlator.bindId(async () => {
        await pause(1);

        innerCorrelationId = correlator.getId();
      });

      await innerBoundFunction();

      outerCorrelationId2 = correlator.getId();
    });

    await outerBoundFunction();

    assert.match(outerCorrelationId1, uuidMatcher);
    assert.match(innerCorrelationId, uuidMatcher);
    assert.notEqual(outerCorrelationId1, innerCorrelationId);
    assert.equal(outerCorrelationId2, outerCorrelationId1);
  });

  it("forwards arguments", async () => {
    const testId = "id-1";
    let receivedArgs;

    const boundFunction = correlator.bindId(testId, async (...args) => {
      await pause(1);
      receivedArgs = args;
    });

    await boundFunction("firstArg", "secondArg");

    assert.deepEqual(receivedArgs, ["firstArg", "secondArg"]);
  });

  it("throws if work parameter is missing", () => {
    assert.throws(
      () => correlator.bindId(),
      new Error("Missing work parameter")
    );
  });
});

describe("getId", () => {
  it("returns undefined if no correlator has been set", () => {
    assert.equal(correlator.getId(), undefined);
  });
});

describe("setId", () => {
  it("throws error if no correlator has been set", () => {
    assert.throws(
      () => correlator.setId("id-1"),
      new Error(
        "Missing correlation scope. \nUse bindId or withId to create a correlation scope."
      )
    );
  });

  it("sets correlator for sync function", () => {
    let id;

    correlator.withId(() => {
      correlator.setId("id-1");
      id = correlator.getId();
    });

    assert.equal(id, "id-1");
  });

  it("sets correlator for async function", async () => {
    let id;

    await correlator.withId(async () => {
      correlator.setId("id-1");
      await pause(1);
      id = correlator.getId();
    });

    assert.equal(id, "id-1");
  });

  it("setting id does not overwrite nested correlators", async () => {
    let outerCorrelationId1;
    let innerCorrelationId;
    let outerCorrelationId2;

    await correlator.withId(async () => {
      await pause(1);
      correlator.setId("id-1");
      outerCorrelationId1 = correlator.getId();

      await correlator.withId(async () => {
        await pause(1);
        innerCorrelationId = correlator.getId();
      });

      outerCorrelationId2 = correlator.getId();
    });

    assert.equal(outerCorrelationId1, "id-1");
    assert.match(innerCorrelationId, uuidMatcher);
    assert.notEqual(outerCorrelationId1, innerCorrelationId);
    assert.equal(outerCorrelationId2, outerCorrelationId1);
  });
});
