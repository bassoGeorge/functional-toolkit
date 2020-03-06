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
