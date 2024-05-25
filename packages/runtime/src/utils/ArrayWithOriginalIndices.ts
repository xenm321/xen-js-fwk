export type EqualFn = (a: unknown, b: unknown) => boolean;

export enum ArrayDiffOperationType {
  ADD = 'add',
  REMOVE = 'remove',
  MOVE = 'move',
  NOOP = 'noop'
}

export interface ArrayDiffOperation {
  op: ArrayDiffOperationType;
  index: number;
  originalIndex?: number;
  from?: number;
  item: unknown;
}

export class ArrayWithOriginalIndices<T = unknown> {
  readonly #array: T[] = [];
  readonly #originalIndices: number[] = [];
  readonly #equalsFn: EqualFn;

  constructor(array: T[], equalsFn: EqualFn) {
    this.#array = [...array];
    this.#originalIndices = array.map((_, i) => i);
    this.#equalsFn = equalsFn;
  }

  get length() {
    return this.#array.length;
  }

  originalIndexAt(index: number): number {
    return this.#originalIndices[index];
  }

  isRemoval(index: number, newArray: unknown[]): boolean {
    if (index >= this.length) {
      return false;
    }

    const item = this.#array[index];
    const indexInNewArray = newArray.findIndex((newItem) =>
      this.#equalsFn(item, newItem)
    );

    return indexInNewArray === -1;
  }

  removeItem(index: number): ArrayDiffOperation {
    const operation: ArrayDiffOperation = {
      op: ArrayDiffOperationType.REMOVE,
      index,
      item: this.#array[index]
    };

    this.#array.splice(index, 1);
    this.#originalIndices.splice(index, 1);

    return operation;
  }

  isNoop(index: number, newArray: unknown[]): boolean {
    if (index >= this.length) {
      return false;
    }
    const item = this.#array[index];
    const newItem = newArray[index];

    return this.#equalsFn(item, newItem);
  }

  noopItem(index: number): ArrayDiffOperation {
    return {
      op: ArrayDiffOperationType.NOOP,
      originalIndex: this.originalIndexAt(index),
      index,
      item: this.#array[index]
    } as ArrayDiffOperation;
  }

  isAddition(item: T, fromIdx: number): boolean {
    return this.findIndexFrom(item, fromIdx) === -1;
  }

  findIndexFrom(item: T, fromIndex: number): number {
    for (let i = fromIndex; i < this.length; i++) {
      if (this.#equalsFn(item, this.#array[i])) {
        return i;
      }
    }
    return -1;
  }

  addItem(item: T, index: number): ArrayDiffOperation {
    const operation: ArrayDiffOperation = {
      op: ArrayDiffOperationType.ADD,
      index,
      item
    };
    this.#array.splice(index, 0, item);
    this.#originalIndices.splice(index, 0, -1);
    return operation;
  }

  moveItem(item: T, toIndex: number): ArrayDiffOperation {
    const fromIndex = this.findIndexFrom(item, toIndex);

    const operation: ArrayDiffOperation = {
      op: ArrayDiffOperationType.MOVE,
      originalIndex: this.originalIndexAt(fromIndex),
      from: fromIndex,
      index: toIndex,
      item: this.#array[fromIndex]
    };

    const [_item] = this.#array.splice(fromIndex, 1);
    this.#array.splice(toIndex, 0, _item);

    const [originalIndex] = this.#originalIndices.splice(fromIndex, 1);
    this.#originalIndices.splice(toIndex, 0, originalIndex);

    return operation;
  }

  removeItemsAfter(index: number): ArrayDiffOperation[] {
    const operations = [];

    while (this.length > index) {
      operations.push(this.removeItem(index));
    }

    return operations;
  }
}
