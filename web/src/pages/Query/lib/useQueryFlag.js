/* eslint-disable no-param-reassign */
import { isNil, isEmpty } from "lodash";
import { useMemo } from "react";

export default function useQueryFlags(query, dataSource = null) {
  dataSource = dataSource || { view_only: true };

  return useMemo(
    () => ({
      // state flags
      isNew: isNil(query && query.id),
      isDraft: query.is_draft,
      isArchived: query.is_archived,
      is_team_editable: query.is_team_editable,

      // permissions flags
      canCreate: true,
      canView: true,
      canEdit: true,
      canViewSource: true,
      canExecute:
        !isEmpty(query.query) && (query.is_safe || !dataSource.view_only)
    }),
    [query, dataSource.view_only]
  );
}
