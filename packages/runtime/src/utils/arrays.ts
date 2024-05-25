import { EqualFn, ArrayWithOriginalIndices } from './ArrayWithOriginalIndices';

export function withoutNulls(arr: any[]): any[] {
  return arr.filter((item) => item != null);
}

interface IArrayDiff {
  added: unknown[];
  removed: unknown[];
}

export function arraysDiff(
  oldArray: unknown[],
  newArray: unknown[]
): IArrayDiff {
  return {
    added: newArray.filter((newItem) => !oldArray.includes(newItem)),
    removed: oldArray.filter((oldItem) => !newArray.includes(oldItem))
  };
}

export function arraysDiffSequence(
  oldArray: unknown[],
  newArray: unknown[],
  equalsFn: EqualFn = (a, b) => a === b
) {
  const sequence = [];

  const array = new ArrayWithOriginalIndices<unknown>(oldArray, equalsFn);

  for (let index = 0; index < newArray.length; index++) {
    if (array.isRemoval(index, newArray)) {
      sequence.push(array.removeItem(index));
      index--;
      continue;
    }

    if (array.isNoop(index, newArray)) {
      sequence.push(array.noopItem(index));
      continue;
    }

    const item = newArray[index];

    if (array.isAddition(item, index)) {
      sequence.push(array.addItem(item, index));
      continue;
    }

    sequence.push(array.moveItem(item, index));
  }

  sequence.push(...array.removeItemsAfter(newArray.length));

  return sequence;
}
