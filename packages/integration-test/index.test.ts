import { describeEach } from '@testduet/describe-each';
import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';

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

  after(() => {
    assert.deepEqual(values, [1, 2, 3]);
  });
});
