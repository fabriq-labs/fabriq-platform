import { useRef } from "react";

const deepEquals = function (x, y) {
  if (x === y) {
    return true;
  } else if (
    typeof x == "object" &&
    x != null &&
    typeof y == "object" &&
    y != null
  ) {
    if (Object.keys(x).length !== Object.keys(y).length) return false;

    for (var prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEquals(x[prop], y[prop])) return false;
      } else return false;
    }

    return true;
  } else return false;
};

export function useDeepDependencies(dependencies) {
  const memo = useRef();
  if (!deepEquals(memo.current, dependencies)) {
    memo.current = dependencies;
  }
  return memo.current;
}
