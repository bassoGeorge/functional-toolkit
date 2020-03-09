/*
	Very basic functions used for other stuff
 */

/**
 * Creates a function which forces only one argument through to the given function
 */
export function unary(fn) {
  return function onlyOneArg(arg) {
    return fn(arg);
  };
}

/**
 * Returns the sole argument
 */
export function identity(v) {
  return v;
}

/**
 * Sometimes apis require functions but we have a value in place
 * This helper creates a thunk which returns a constant.
 * Shorter way is () => v but that relies on closure on the outside
 */
export function constant(v) {
  return function value() {
    return v;
  }
}
