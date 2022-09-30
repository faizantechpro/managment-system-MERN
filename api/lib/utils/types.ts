/**
 * Makes a key required from the given object.
 */
export type RequireKeys<T extends object, K extends keyof T> = Required<
  Pick<T, K>
> &
  Omit<T, K>;

/**
 * Makes a key optional from the given object
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Makes provided key optional and only returns a type with the partial keys
 */
export type PartialSet<T, K extends keyof T> = PartialBy<Pick<T, K>, K>;

/**
 * Excludes a key from the given object
 */
export type ExcludeKey<T, U extends string> = Exclude<
  {
    [K in keyof T]: K extends U ? never : K;
  }[keyof T],
  null | undefined
>;
type RequiredNotNull<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};
export type Ensure<T extends object, K extends keyof T> = T &
  RequiredNotNull<Pick<RequireKeys<T, K>, K>>;

export type PickNullable<T> = {
  [K in keyof T as null extends T[K] ? K : never]: T[K];
};
type PickNotNullable<T> = {
  [K in keyof T as null extends T[K] ? never : K]: T[K];
};
export type PickNotUndefined<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};
export type OptionalNullable<T> = {
  [K in keyof PickNullable<T>]?: T[K];
} & {
  [K in keyof PickNotNullable<T>]: T[K];
};
