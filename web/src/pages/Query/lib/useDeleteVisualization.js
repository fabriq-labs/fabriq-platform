// Use Delete Visualization

import { extend, filter, isFunction } from "lodash";
import { useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Visualization from "../../../api/visualization";
import notification from "../../../api/notification";

export default function useDeleteVisualization(query, onChange) {
  const onChangeRef = useRef();
  const { t } = useTranslation();
  onChangeRef.current = isFunction(onChange) ? onChange : () => {};

  return useCallback(
    (visualizationId) =>
      Visualization.delete({ id: visualizationId })
        .then(() => {
          const filteredVisualizations = filter(
            query.visualizations,
            (v) => v.id !== visualizationId
          ); // eslint-disable-line
          onChangeRef.current(
            extend(query.clone(), { visualizations: filteredVisualizations })
          );
        })
        .catch(() => {
          notification.error(
            t("query:useDelete_visualization.deleteVisualization_error")
          );
        }),
    [query]
  );
}
