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
  };
}

/**
 * an adapter for functions which accept positional args, but we want to pass array
 */
export function spreadArgs(fn) {
  return function spreadFn(argsArr) {
    return fn(...argsArr);
  };
}

/**
 * an adapter for functions which accept an array, but we want to pass in spread out
 */
export function gatherArgs(fn) {
  return function gatherFn(...args) {
    return fn(args);
  };
}

/**
 * creates a partially applied function which has the initial presets in place
 */
export function partial(fn, ...presetArgs) {
  return function partiallyApplied(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

export function partialRight(fn, ...presetArgs) {
  return function partiallyApplied(...laterArgs) {
    return fn(...laterArgs, ...presetArgs);
  };
}

export function reverseArgs(fn) {
  return function reveredFn(...args) {
    return fn(...args.reverse());
  };
}

export function curry(fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    // This function always returns a new function, which might recursively call this or else call fn() based on the
    // situation with the arguments

    return function curried(nextArg) {
      const args = [...prevArgs, nextArg];
      if (args.length >= arity) {
        return fn(...args);
      } else {
        return nextCurried(args);
      }
    };
  })([]);
}
