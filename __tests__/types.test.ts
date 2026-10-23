// Type-level tests for index.d.ts, checked with `yarn test:types` (not executed).
import { withId, bindId, getId, setId } from "../index.js";

const syncResult: number = withId("id", () => 1);
const generatedIdResult: number = withId(() => 1);
const asyncResult: Promise<string> = withId(async () => "result");

// @ts-expect-error work is required
withId("id");
// @ts-expect-error id must be a string
withId(123, () => 1);
// @ts-expect-error return type is preserved
const wrongResult: string = withId(() => 1);

const bound = bindId((a: number, b: string) => a + b.length);
const boundResult: number = bound(1, "ab");
const boundWithId = bindId("id", async (a: number) => a);
const boundAsyncResult: Promise<number> = boundWithId(1);
const explicit = bindId<[number], number>((a) => a * 2);

// @ts-expect-error argument types are preserved
bound("1", "ab");
// @ts-expect-error argument count is preserved
bound(1);
// @ts-expect-error work is required
bindId("id");

const id: string | undefined = getId();
setId("id");
// @ts-expect-error id must be a string
setId(123);

export {
  syncResult,
  generatedIdResult,
  asyncResult,
  wrongResult,
  boundResult,
  boundAsyncResult,
  explicit,
  id,
};
