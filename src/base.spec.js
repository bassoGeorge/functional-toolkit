import {
  constant,
  curry,
  gatherArgs,
  identity, looseCurry,
  partial,
  partialRight,
  reverseArgs,
  spreadArgs,
  unary
} from "./base";

describe(unary, () => {
  it("forces only one argument through to the given function", () => {
    const target = jest.fn();
    unary(target)("firstArg", "secondArg");

    expect(target).toBeCalledWith("firstArg");
  });

  it("works beautifully with a mapping over parseInt", () => {
    const arr = ["10", "10", "20"];

    // Because map passes the second argument which is the index of the item to parseInt,
    // but parseInt uses its second argument as the base of the number
    expect(arr.map(parseInt)).not.toEqual([10, 10, 20]);

    expect(arr.map(unary(parseInt))).toEqual([10, 10, 20]);
  });
});

describe(identity, () => {
  it("returns the sold argument", () => {
    expect(identity("::value::")).toEqual("::value::");
  });
  it("works well for a map and filter", () => {
    expect(["a", "b"].map(identity)).toEqual(["a", "b"]);
    expect(["Hey", null, "there", undefined].filter(identity)).toEqual([
      "Hey",
      "there"
    ]);
  });
});

describe(constant, () => {
  it("creates a thunk for a value", () => {
    expect(constant(10)()).toEqual(10);
  });
});

describe(spreadArgs, () => {
  it("creates a function which spreads the given array input and passes it to the function", () => {
    const target = jest.fn(),
      adapted = spreadArgs(target);

    adapted([1, 2, 3]);

    expect(target).toBeCalledWith(1, 2, 3);
  });
});

describe(gatherArgs, () => {
  it("creates a function which gathers the spread arguments into an array and passes it to the function", () => {
    const target = jest.fn(),
      adapted = gatherArgs(target);

    adapted(1, 2, 3, 4);

    expect(target).toBeCalledWith([1, 2, 3, 4]);
  });

  it("works especially well in reduce kind of situations", () => {
    function sum([v1, v2]) {
      return v1 + v2;
    }

    const total = [1, 2, 3].reduce(gatherArgs(sum));
    expect(total).toEqual(6);
  });
});

describe(partial, () => {
  it("allows partial application by providing a set of arguments upfront", () => {
    const target = jest.fn().mockReturnValue("return");

    const partiallyApplied = partial(target, "a", "b");
    expect(target).not.toBeCalled();

    const result = partiallyApplied("c", "d");

    expect(target).toBeCalledWith("a", "b", "c", "d");
    expect(result).toEqual("return");
  });

  it("works with gatherArgs utility", () => {
    function add([a, b]) {
      return a + b;
    }

    const add2 = partial(gatherArgs(add), 2);
    expect(add2(10)).toEqual(12);
  });

  it("is useful in real life situations", () => {
    const ajax = jest.fn().mockImplementation((url, data, callback) => null);
    const callback = jest.fn();

    const getPerson = partial(ajax, "/api/person");
    getPerson({ userId: 100 }, callback);
    expect(ajax).toBeCalledWith("/api/person", { userId: 100 }, callback);

    const getCurrentUser = partial(getPerson, { userId: 1 });
    getCurrentUser(callback);
    expect(ajax).toBeCalledWith("/api/person", { userId: 1 }, callback);
  });
});

describe(partialRight, () => {
  it("works like partial, except allowing you to specify the right hand arguments first", () => {
    const target = jest.fn().mockReturnValue("return");
    const partiallyApplied = partialRight(target, "a", "b");

    expect(target).not.toBeCalled();

    const result = partiallyApplied("c", "d");
    expect(result).toEqual("return");
    expect(target).toBeCalledWith("c", "d", "a", "b");
  });
});

describe(reverseArgs, () => {
  it("creates a function with reversed arguments", () => {
    const target = (a, b) => "" + a + " | " + b;

    const reversed = reverseArgs(target);

    const result = reversed("First", "Second");
    expect(result).toEqual("Second | First");
  });

  it("works well with the gatherArgs utility", () => {
    const target = ([a, b]) => "" + a + " | " + b;

    const reversed = reverseArgs(gatherArgs(target));

    const result = reversed("First", "Second");
    expect(result).toEqual("Second | First");
  });
});

describe(curry, () => {
  it("creates a curried version of the given function by figuring out its arity on its own", () => {
    function sum(a, b) {
      return a + b;
    }

    const curriedSum = curry(sum);
    expect(curriedSum(1)(2)).toEqual(3);
  });

  it("creates a curried version of the given function by allowing us to specify the arity", () => {
    function sum(...items) {
      return items.reduce((a, b) => a + b);
    }

    const curriedSum = curry(sum, 2);
    expect(curriedSum(1)(2)).toEqual(3);
  });
});

describe(looseCurry, () => {
  it("creates a curried version of the given function by figuring out its arity on its own", () => {
    function sum(...items) {
      return items.reduce((a, b) => a + b) ;
    }

    const curriedSum = looseCurry(sum, 5);
    expect(curriedSum(1)(2, 3)(4)(5)).toEqual(15);
  });
});
