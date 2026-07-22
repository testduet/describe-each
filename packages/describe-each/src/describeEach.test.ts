import assert from 'node:assert/strict';
import { after, before, describe, mock, test } from 'node:test';
import describeEach from './describeEach.ts';

describe('describeEach with array rows', () => {
  let values: number[];

  before(() => {
    values = [];
  });

  describeEach([[1], [2], [3]])('array row: %d', value => {
    test('iterate', () => {
      values.push(value);
    });
  });

  test('calls each value', () => {
    assert.deepEqual(values, [1, 2, 3]);
  });
});

describe('describeEach with scalar rows', () => {
  let values: number[];

  before(() => {
    values = [];
  });

  describeEach([1, 2, 3])('scalar row: %d', value => {
    test('iterate', () => {
      values.push(value);
    });
  });

  test('calls each value', () => {
    assert.deepEqual(values, [1, 2, 3]);
  });
});

describe('describeEach.only', () => {
  let callCount: number;
  let restore: () => void;

  before(() => {
    const only = mock.method(describe, 'only', (_name: string, fn: () => void) => fn());

    restore = () => only.mock.restore();

    describeEach.only([[1]])('only: %d', value => {
      assert.equal(value, 1);
    });

    callCount = only.mock.callCount();
  });

  test('should have called describe.only() once', () => {
    assert.equal(callCount, 1);
  });

  after(() => restore());
});

describe('describeEach.skip', () => {
  let callCount: number;
  let restore: () => void;

  before(() => {
    const skip = mock.method(describe, 'skip', () => {});

    restore = () => skip.mock.restore();

    describeEach.skip([[1]])('skip: %d', () => {
      assert.fail('A skipped suite must not invoke its callback.');
    });

    callCount = skip.mock.callCount();
  });

  test('should have called describe.skip() once', () => {
    assert.equal(callCount, 1);
  });

  after(() => restore());
});

describe('describeEach.todo', () => {
  let callCount: number;
  let restore: () => void;

  before(() => {
    const todo = mock.method(describe, 'todo', (_name: string, fn: () => void) => fn());

    restore = () => todo.mock.restore();

    describeEach.todo([[1]])('todo: %d', value => {
      assert.equal(value, 1);
    });

    callCount = todo.mock.callCount();
  });

  test('should have called describe.todo() once', () => {
    assert.equal(callCount, 1);
  });

  after(() => restore());
});
