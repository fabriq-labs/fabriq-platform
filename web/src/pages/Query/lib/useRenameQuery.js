import { useCallback } from "react";
import recordEvent from "../../../api/record_event";
import useUpdateQuery from "./useUpdateQuery";

export default function useRenameQuery(query, onChange) {
  const updateQuery = useUpdateQuery(query, onChange);

  return useCallback(
    (name) => {
      recordEvent("edit_name", "query", query.id);
      const changes = { name };
      const options = {};

      if (query.is_draft && name !== "New Query") {
        changes.is_draft = false;
        options.successMessage = "Query saved and published";
      }

      updateQuery(changes, options);
    },
    [query.id, query.is_draft, updateQuery]
  );
}
