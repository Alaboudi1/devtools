// Test the objects produced by console.log() calls and by evaluating various
// expressions in the console after time warping.
(async function() {
  await Test.selectConsole();

  await Test.waitForMessage("Array(20) [ 0, 1, 2, 3, 4, 5,");
  await Test.waitForMessage("Uint8Array(20) [ 0, 1, 2, 3, 4, 5,");
  await Test.waitForMessage("Set(22) [ {…}, {…}, 0, 1, 2, 3, 4, 5,");
  await Test.waitForMessage(
    "Map(21) { {…} → {…}, 0 → 1, 1 → 2, 2 → 3, 3 → 4, 4 → 5,"
  );
  await Test.waitForMessage("WeakSet(20) [ {…}, {…}, {…},");
  await Test.waitForMessage("WeakMap(20) { {…} → {…}, {…} → {…},");
  await Test.waitForMessage(
    "Object { a: 0, a0: 0, a1: 1, a2: 2, a3: 3, a4: 4,"
  );
  await Test.waitForMessage("/abc/gi");
  await Test.waitForMessage("Date");

  await Test.checkMessageStack('RangeError: "foo"', [32, 52]);
  await Test.waitForMessage('<div id="foo" class="bar" style="visibility: visible" blahblah="">');

  msg = await Test.waitForMessage("function bar()");
  Test.checkJumpIcon(msg);

  await Test.waitForMessage('Array(6) [ undefined, true, 3, null, "z", 40n ]');

  await Test.warpToMessage("Done");

  await Test.executeInConsole("Error('helo')");
  await Test.checkMessageStack('Error: "helo"', [1, 49, 52]);

  await Test.executeInConsole(
    `
function f() {
  throw Error("there");
}
f();
`
  );
  // FIXME the first line in this stack isn't right.
  await Test.checkMessageStack('Error: "there"', [2/*3*/, 5, 49, 52]);

  Test.executeInConsole("Array(1, 2, 3)");
  msg = await Test.waitForMessage("Array(3) [ 1, 2, 3 ]");
  await Test.checkMessageObjectContents(msg, ["0: 1", "1: 2", "2: 3", "length: 3"]);

  await Test.executeInConsole("new Uint8Array([1, 2, 3, 4])");
  msg = await Test.waitForMessage("Uint8Array(4) [ 1, 2, 3, 4 ]");
  await Test.checkMessageObjectContents(msg, [
    "0: 1",
    "1: 2",
    "2: 3",
    "3: 4",
    "length: 4",
  ]);

  await Test.executeInConsole(`RegExp("abd", "g")`);
  msg = await Test.waitForMessage("/abd/g");
  await Test.checkMessageObjectContents(msg, ["global: true", `source: "abd"`]);

  await Test.executeInConsole("new Set([1, 2, 3])");
  msg = await Test.waitForMessage("Set(3) [ 1, 2, 3 ]");
  await Test.checkMessageObjectContents(
    msg,
    ["0: 1", "1: 2", "2: 3", "size: 3"],
    ["<entries>"]
  );

  await Test.executeInConsole("new Map([[1, {a:1}], [2, {b:2}]])");
  msg = await Test.waitForMessage("Map { 1 → {…}, 2 → {…} }");
  await Test.checkMessageObjectContents(
    msg,
    ["0: 1 → Object { a: 1 }", "1: 2 → Object { b: 2 }", "size: 2"],
    ["<entries>"]
  );

  await Test.executeInConsole("new WeakSet([{a:1}, {b:2}])");
  msg = await Test.waitForMessage("WeakSet(2) [ {…}, {…} ]");
  await Test.checkMessageObjectContents(
    msg,
    ["Object { a: 1 }", "Object { b: 2 }"],
    ["<entries>"]
  );

  await Test.executeInConsole("new WeakMap([[{a:1},{b:1}], [{a:2},{b:2}]])");
  msg = await Test.waitForMessage("WeakMap { {…} → {…}, {…} → {…} }");
  await Test.checkMessageObjectContents(
    msg,
    ["Object { a: 1 } → Object { b: 1 }", "Object { a: 2 } → Object { b: 2 }"],
    ["<entries>"]
  );

  await Test.executeInConsole("baz");
  msg = await Test.waitForMessage("function baz()");
  Test.checkJumpIcon(msg);

  Test.finish();
})();
