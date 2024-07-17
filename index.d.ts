export function withId<R>(id: string, work: () => R): R;
export function withId<R>(work: () => R): R;
export function bindId<R, W extends Function>(id: string, work: W): W;
export function bindId<R, W extends Function>(work: W): W;
export function getId(): string | undefined;
export function setId(id: string): undefined;
