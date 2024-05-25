interface IObjectDiff {
  added: string[];
  removed: string[];
  updated: string[];
}

type RawUnknownObject = Record<string, unknown>;

export function objectsDiff(
  oldObj: RawUnknownObject,
  newObj: RawUnknownObject
): IObjectDiff {
  const oldKeys = Object.keys(oldObj);
  const newKeys = Object.keys(newObj);

  return {
    added: newKeys.filter((key) => !(key in oldObj)),
    removed: oldKeys.filter((key) => !(key in newObj)),
    updated: newKeys.filter(
      (key) => key in oldObj && oldObj[key] !== newObj[key]
    )
  };
}
