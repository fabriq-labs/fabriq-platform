/* eslint-disable no-mixed-spaces-and-tabs */
import { useState, useMemo } from "react";
import useUpdateQuery from "./useUpdateQuery";

export default function useQuery(originalQuery) {
  const [queryObj, setQuery] = useState(originalQuery);
  const [originalQuerySource, setOriginalQuerySource] = useState(
    originalQuery.query
  );

  const updateQuery = useUpdateQuery(queryObj, (updatedQuery) => {
    // It's important to update URL first, and only then update state
    if (updatedQuery.id !== queryObj.id) {
      // Don't reload page when saving new query
    }
    setQuery(updatedQuery);
    setOriginalQuerySource(updatedQuery.query);
  });

  return useMemo(
    () => ({
      queryObj,
      setQuery,
      isDirty: queryObj.query !== originalQuerySource,
      saveQuery: () => updateQuery()
    }),
    [queryObj, originalQuerySource, updateQuery]
  );
}
