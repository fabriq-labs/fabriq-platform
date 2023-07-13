// UsePublishQuery
import { useCallback } from "react";
import recordEvent from "../../../api/record_event";
import useUpdateQuery from "./useUpdateQuery";

export default function usePublishQuery(query, onChange) {
  const updateQuery = useUpdateQuery(query, onChange);

  return useCallback(() => {
    recordEvent("toggle_published", "query", query.id);
    updateQuery({ is_draft: true });
  }, [query.id, updateQuery]);
}
