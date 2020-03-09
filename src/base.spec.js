import {constant, identity, unary} from "./base";

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
    expect(identity("::value::")).toEqual("::value::")
  })
  it("works well for a map and filter", () => {
    expect(["a", "b"].map(identity)).toEqual(["a", "b"]);
    expect(["Hey", null, "there", undefined].filter(identity)).toEqual(["Hey", "there"])
  })
})


describe(constant, () => {
  it("creates a thunk for a value", () => {
    expect(constant(10)()).toEqual(10);
  })
})
