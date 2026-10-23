export function withId<R>(id: string, work: () => R): R;
export function withId<R>(work: () => R): R;
export function bindId<A extends unknown[], R>(
  id: string,
  work: (...args: A) => R
): (...args: A) => R;
export function bindId<A extends unknown[], R>(
  work: (...args: A) => R
): (...args: A) => R;
export function getId(): string | undefined;
export function setId(id: string): void;
