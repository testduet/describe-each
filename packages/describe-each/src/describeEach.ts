/// <reference types="node" />

import { describe } from 'node:test';
import { format } from 'node:util';

type DescribeCallback = (...args: ReadonlyArray<unknown>) => void;
type DescribeFunction = (name: string, fn: () => void) => unknown;

// Adapted from Jest's `each` array-table overloads.
interface Each {
  <T extends Record<string, unknown>>(table: ReadonlyArray<T>): (name: string, fn: (arg: T) => void) => void;
  <T extends readonly [unknown, ...Array<unknown>]>(
    table: ReadonlyArray<T>
  ): (name: string, fn: (...args: [...T]) => void) => void;
  <T extends ReadonlyArray<unknown>>(table: ReadonlyArray<T>): (name: string, fn: (...args: T) => void) => void;
  <T>(table: ReadonlyArray<T>): (name: string, fn: (arg: T) => void) => void;
}

interface DescribeEach extends Each {
  only: Each;
  skip: Each;
  todo: Each;
}

function describe_(describeFn: DescribeFunction, rows: ReadonlyArray<unknown>) {
  return (message: string, fn: DescribeCallback) => {
    for (const row of rows) {
      const args = Array.isArray(row) ? row : [row];
      const countFormatting = message.replaceAll('%%', '').split('%').length - 1;

      describeFn(format(message, ...args.slice(0, countFormatting)), () => fn(...args));
    }
  };
}

const describeEach: DescribeEach = Object.assign(
  ((rows: ReadonlyArray<unknown>) => describe_(describe, rows)) as Each,
  {
    only: ((rows: ReadonlyArray<unknown>) => describe_(describe.only, rows)) as Each,
    skip: ((rows: ReadonlyArray<unknown>) => describe_(describe.skip, rows)) as Each,
    todo: ((rows: ReadonlyArray<unknown>) => describe_(describe.todo, rows)) as Each
  }
);

export default describeEach;
