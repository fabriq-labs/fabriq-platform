/* eslint-disable camelcase */
// UsePublishQuery
import { useCallback } from "react";
import recordEvent from "../../../api/record_event";
import useUpdateQuery from "./useUpdateQuery";

export default function useIsTeamEditable(query, onChange, is_team_editable) {
  const updateQuery = useUpdateQuery(query, onChange);

  return useCallback(() => {
    recordEvent("team_editable_update", "query", query.id);
    updateQuery({ is_draft: is_team_editable, is_team_editable });
  }, [query.id, updateQuery]);
}
