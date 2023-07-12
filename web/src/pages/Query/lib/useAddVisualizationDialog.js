import { useState, useCallback, useEffect } from "react";
import useQueryFlags from "./useQueryFlag";
import useEditVisualizationDialog from "./useEditVisualizationDialog";

export default function useAddVisualizationDialog(
  query,
  queryResult,
  saveQuery,
  onChange
) {
  const queryFlags = useQueryFlags(query);
  const [shouldOpenDialog, setShouldOpenDialog] = useState(false);
  const editVisualization = useEditVisualizationDialog(
    query,
    queryResult,
    onChange
  );

  useEffect(() => {
    if (!queryFlags.isNew && shouldOpenDialog) {
      setShouldOpenDialog(false);
      editVisualization();
    }
  }, [queryFlags.isNew, shouldOpenDialog, editVisualization]);

  return useCallback(() => {
    if (queryFlags.isNew) {
      setShouldOpenDialog(true);
      saveQuery();
    } else {
      editVisualization();
    }
  }, [queryFlags.isNew, saveQuery, editVisualization]);
}
