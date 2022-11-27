"use strict";

const correlator = require("../index");

const uuidMatcher =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const pause = async (waitTime) =>
  new Promise((resolve) => setTimeout(resolve, waitTime));

describe("withId", () => {
  it("sets correlator for sync function", () => {
    expect.assertions(1);

    correlator.withId(() => {
      expect(correlator.getId()).toMatch(uuidMatcher);
    });
  });

  it("sets correlator for async function", async () => {
    expect.assertions(1);

    await correlator.withId(async () => {
      await pause(1);
      expect(correlator.getId()).toMatch(uuidMatcher);
    });
  });

  it("sets correlator to supplied id", async () => {
    expect.assertions(1);

    const testId = "id-1";

    await correlator.withId(testId, async () => {
      await pause(1);
      expect(correlator.getId()).toEqual(testId);
    });
  });

  it("supports nested correlators", async () => {
    expect.assertions(5);

    await correlator.withId(async () => {
      await pause(1);
      const outerCorrelationId1 = correlator.getId();
      expect(outerCorrelationId1).toMatch(uuidMatcher);

      await correlator.withId(async () => {
        await pause(1);
        const innerCorrelationId = correlator.getId();
        expect(innerCorrelationId).toMatch(uuidMatcher);
        expect(outerCorrelationId1).not.toEqual(innerCorrelationId);
      });

      const outerCorrelationId2 = correlator.getId();
      expect(outerCorrelationId2).toMatch(uuidMatcher);
      expect(outerCorrelationId2).toEqual(outerCorrelationId1);
    });
  });

  it("forwards return value from callback", async () => {
    const result = await correlator.withId(async () => {
      await pause(1);
      return "foo";
    });

    expect(result).toEqual("foo");
  });

  it("throws if work parameter is missing", () => {
    expect.assertions(1);

    try {
      correlator.withId();
    } catch (ex) {
      expect(ex).toEqual(new Error("Missing work parameter"));
    }
  });
});

describe("bindId", () => {
  it("sets correlator for sync function", () => {
    expect.assertions(1);

    const boundFunction = correlator.bindId(() => {
      expect(correlator.getId()).toMatch(uuidMatcher);
    });

    boundFunction();
  });

  it("sets correlator for async function", async () => {
    expect.assertions(1);

    const boundFunction = correlator.bindId(async () => {
      await pause(1);
      expect(correlator.getId()).toMatch(uuidMatcher);
    });

    await boundFunction();
  });

  it("forwards return value from callback", async () => {
    const boundFunction = correlator.bindId(async () => {
      await pause(1);
      return "foo";
    });

    const result = await boundFunction();

    expect(result).toEqual("foo");
  });

  it("sets correlator to supplied id", async () => {
    expect.assertions(1);

    const testId = "id-1";

    const boundFunction = correlator.bindId(testId, async () => {
      await pause(1);
      expect(correlator.getId()).toEqual(testId);
    });
    await boundFunction();
  });

  it("supports nested correlators", async () => {
    expect.assertions(5);

    const outerBoundFunction = correlator.bindId(async () => {
      await pause(1);

      const outerCorrelationId1 = correlator.getId();
      expect(outerCorrelationId1).toMatch(uuidMatcher);

      const innerBoundFunction = correlator.bindId(async () => {
        await pause(1);

        const innerCorrelationId = correlator.getId();
        expect(innerCorrelationId).toMatch(uuidMatcher);
        expect(outerCorrelationId1).not.toEqual(innerCorrelationId);
      });

      await innerBoundFunction();

      const outerCorrelationId2 = correlator.getId();
      expect(outerCorrelationId2).toMatch(uuidMatcher);
      expect(outerCorrelationId2).toEqual(outerCorrelationId1);
    });

    await outerBoundFunction();
  });

  it("forwards arguments", async () => {
    expect.assertions(1);

    const testId = "id-1";

    const boundFunction = correlator.bindId(testId, async (...args) => {
      await pause(1);
      expect(args).toEqual(["firstArg", "secondArg"]);
    });

    await boundFunction("firstArg", "secondArg");
  });

  it("throws if work parameter is missing", () => {
    expect.assertions(1);

    try {
      correlator.bindId();
    } catch (ex) {
      expect(ex).toEqual(new Error("Missing work parameter"));
    }
  });
});

describe("getId", () => {
  it("returns undefined if no correlator has been set", () => {
    expect(correlator.getId()).toBeUndefined();
  });
});
