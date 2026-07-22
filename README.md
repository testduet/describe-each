# `@testduet/describe-each`

> Parameterized test suites for the Node.js test runner.

Run the same `describe()` block with multiple rows of data.

## Background

Jest has an excellent [`describe.each()`
function](https://jestjs.io/docs/api#describeeachtablename-fn-timeout). It makes parameterized test suites concise and readable. However, the built-in Node.js test runner does not provide an equivalent function.

This package brings the array-table form of `describe.each()` to [`node:test`](https://nodejs.org/api/test.html):

- Written in TypeScript with row-aware type inference
- Supports tuple, array, object, and scalar rows
- Supports `only`, `skip`, and `todo`
- Formats suite names using [`node:util`'s `format()`](https://nodejs.org/api/util.html#utilformatformat-args)

## How to use

Install the package as a development dependency:

```sh
npm install --save-dev @testduet/describe-each
```

Pass a table to `describeEach()`, followed by the suite name and callback:

```ts
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { describeEach } from '@testduet/describe-each';

describeEach([
  [1, 2, 3],
  [2, 3, 5],
  [3, 5, 8]
])('%d + %d = %d', (left, right, expected) => {
  test('adds both numbers', () => {
    assert.equal(left + right, expected);
  });
});
```

Scalar rows are passed to the callback one at a time:

```ts
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { describeEach } from '@testduet/describe-each';

describeEach([1, 2, 3])('value: %d', value => {
  test('is positive', () => {
    assert.ok(value > 0);
  });
});
```

## Behaviors

### How are suite names formatted?

Suite names are formatted by `node:util`'s `format()`. Values consumed by placeholders such as `%s`, `%d`, `%i`, `%f`, `%j`, `%o`, and `%O` are taken from the beginning of each row. Use `%%` for a literal percent sign.

```ts
describeEach([['Alice', 3]])('%s has %d tasks', (name, count) => {
  // Creates the suite "Alice has 3 tasks".
});
```

All values in a row are passed to the callback, including values that are not consumed while formatting the suite name.

### How do `only`, `skip`, and `todo` work?

The modifiers delegate to the corresponding `node:test` suite functions:

```ts
describeEach.only([[1]])('only: %d', value => {});
describeEach.skip([[1]])('skip: %d', value => {});
describeEach.todo([[1]])('todo: %d', value => {});
```

`describeEach.todo()` creates one todo suite per row without invoking its callback.

### What are the differences from Jest's `describe.each()`?

- This package creates suites with `node:test` rather than Jest
- Array tables are supported; tagged-template tables are not supported
- Jest-specific name interpolation such as `$variable` is not supported
- Suite names use the formatting behavior of `node:util`'s `format()`

## Contributions

Like this? [Star](https://github.com/testduet/describe-each/stargazers) the repo.

Want to make it better? [File](https://github.com/testduet/describe-each/issues) an issue.

Don't like something you see? [Submit](https://github.com/testduet/describe-each/pulls) a pull request.
