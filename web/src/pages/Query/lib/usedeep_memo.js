/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import { useDeepDependencies } from "./deep_dependencies";

export default function useDeepMemo(callback, dependencies) {
  const memoizedDependencies = useDeepDependencies(dependencies);
  return useMemo(callback, memoizedDependencies);
}
