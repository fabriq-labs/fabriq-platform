import { useState, useEffect, useMemo } from "react";
import { first, orderBy, find } from "lodash";
import location from "../../../api/location";

export default function useVisualizationTabHandler(visualizations) {
  const visualizationId = localStorage.getItem("visualizationId");
  const id = parseInt(visualizationId);

  const firstVisualization = useMemo(
    () => first(orderBy(visualizations, ["id"])) || {},
    [visualizations]
  );
  const [selectedTab, setSelectedTab] = useState(id || firstVisualization.id);

  useEffect(() => {
    const hashValue =
      selectedTab !== firstVisualization.id ? `${selectedTab}` : null;
    const unlisten = location.listen(() => {
      if (id !== hashValue) {
        setSelectedTab(id || firstVisualization.id);
      }
    });
    return unlisten;
  }, [firstVisualization.id, selectedTab]);

  // make sure selectedTab is in visualizations
  useEffect(() => {
    if (!find(visualizations, { id: selectedTab })) {
      setSelectedTab(firstVisualization.id);
    }
  }, [firstVisualization.id, selectedTab, visualizations]);

  return useMemo(() => [selectedTab, setSelectedTab], [selectedTab]);
}
