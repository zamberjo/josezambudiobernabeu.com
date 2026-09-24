/**
 * Errors are values here: every port and use case returns a Result, so the
 * failure modes are part of the signature and the compiler makes callers look
 * at them. Kept to the handful of combinators the code actually uses.
 */
export type Ok<T> = { readonly ok: true; readonly value: T };
export type Err<E> = { readonly ok: false; readonly error: E };
export type Result<T, E> = Ok<T> | Err<E>;

export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
export const err = <E>(error: E): Err<E> => ({ ok: false, error });

export const map = <T, U, E>(result: Result<T, E>, f: (value: T) => U): Result<U, E> =>
	result.ok ? ok(f(result.value)) : result;

export const mapErr = <T, E, F>(result: Result<T, E>, f: (error: E) => F): Result<T, F> =>
	result.ok ? result : err(f(result.error));

export const andThen = <T, U, E, F>(
	result: Result<T, E>,
	f: (value: T) => Result<U, F>
): Result<U, E | F> => (result.ok ? f(result.value) : result);

/** The first error wins; otherwise every value, in order. */
export const all = <T, E>(results: readonly Result<T, E>[]): Result<T[], E> => {
	const values: T[] = [];
	for (const result of results) {
		if (!result.ok) return result;
		values.push(result.value);
	}
	return ok(values);
};

/** For composition roots, where a failure should stop the build loudly. */
export const unwrap = <T, E>(result: Result<T, E>, describe: (error: E) => string): T => {
	if (result.ok) return result.value;
	throw new Error(describe(result.error));
};
