/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  isEmpty,
  includes,
  compact,
  map,
  has,
  pick,
  keys,
  extend,
  get
} from "lodash";
import { Dashboard, collectDashboardFilters } from "../../../api/dashboard";
import {
  editableMappingsToParameterMappings,
  synchronizeWidgetTitles
} from "../parameter_component/ParameterMappingInput";
import { useTranslation } from "react-i18next";
import AddWidgetDialog from "../../../components/Redash/Dashboard/dashboard-widget/AddWidgetDialog";
import TextboxDialog from "../../../components/Redash/Dashboard/dashboard-widget/TextboxDialog";
import recordEvent from "../../../api/record_event";
import notification from "../../../api/notification";
import useRefreshRateHandler from "./useRefreshRateHandler";
import useEditModeHandler from "./useEditModeHandler";

export { DashboardStatusEnum } from "./useEditModeHandler";

function getAffectedWidgets(widgets, updatedParameters = []) {
  return !isEmpty(updatedParameters)
    ? widgets.filter((widget) =>
        Object.values(widget.getParameterMappings())
          .filter(({ type }) => type === "dashboard-level")
          .some(({ mapTo }) =>
            includes(
              updatedParameters.map((p) => p.name),
              mapTo
            )
          )
      )
    : widgets;
}

function useDashboard(dashboardData, isEdit, queryParams) {
  const [dashboard, setDashboard] = useState(dashboardData);
  const [filters, setFilters] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [gridDisabled, setGridDisabled] = useState(false);
  const globalParameters = useMemo(
    () => dashboard.getParametersDefs(queryParams),
    [dashboard]
  );
  const canEditDashboard = !dashboard.is_archived && dashboard.can_edit;
  const isDashboardOwnerOrAdmin = useMemo(
    () => !dashboard.is_archived && has(dashboard, "user.id"),
    [dashboard]
  );
  const { t } = useTranslation();

  const updateDashboard = useCallback(
    (data, includeVersion = true) => {
      setDashboard((currentDashboard) => extend({}, currentDashboard, data));
      // for some reason the request uses the id as slug
      data = { ...data, slug: dashboard.id };
      if (includeVersion) {
        data = { ...data, version: dashboard.version };
      }
      return Dashboard.save(data)
        .then((updatedDashboard) =>
          setDashboard((currentDashboard) =>
            extend(
              {},
              currentDashboard,
              pick(updatedDashboard.data, keys(data))
            )
          )
        )
        .catch((error) => {
          const status = get(error, "response.status");
          if (status === 403) {
            notification.error(t("query:user_dashboard.upadtedashboard_error"));
          } else if (status === 409) {
            notification.error(t("query:user_dashboard.dashboard_error"), {
              duration: null
            });
          }
        });
    },
    [dashboard]
  );

  const togglePublished = useCallback(() => {
    recordEvent("toggle_published", "dashboard", dashboard.id);
    updateDashboard({ is_draft: !dashboard.is_draft }, false);
  }, [dashboard, updateDashboard]);

  const loadWidget = useCallback((widget, forceRefresh = false) => {
    widget.getParametersDefs(); // Force widget to read parameters values from URL
    setDashboard((currentDashboard) => extend({}, currentDashboard));
    return widget
      .load(forceRefresh)
      .finally(() =>
        setDashboard((currentDashboard) => extend({}, currentDashboard))
      );
  }, []);

  const refreshWidget = useCallback(
    (widget) => loadWidget(widget, true),
    [loadWidget]
  );

  const removeWidget = useCallback((widgetId) => {
    setDashboard((currentDashboard) =>
      extend({}, currentDashboard, {
        widgets: currentDashboard.widgets.filter(
          (widget) => widget.id !== undefined && widget.id !== widgetId
        )
      })
    );
  }, []);

  const dashboardRef = useRef();
  dashboardRef.current = dashboard;

  const loadDashboard = useCallback(
    (forceRefresh = false, updatedParameters = []) => {
      const affectedWidgets = getAffectedWidgets(
        dashboardRef.current.widgets,
        updatedParameters
      );
      const loadWidgetPromises = compact(
        affectedWidgets.map((widget) =>
          loadWidget(widget, forceRefresh).catch((error) => error)
        )
      );

      return Promise.all(loadWidgetPromises).then(() => {
        const queryResults = compact(
          map(dashboardRef.current.widgets, (widget) => widget.getQueryResult())
        );
        const updatedFilters = collectDashboardFilters(
          dashboardRef.current,
          queryResults,
          queryParams
        );
        setFilters(updatedFilters);
      });
    },
    [loadWidget]
  );

  const refreshDashboard = useCallback(
    (updatedParameters) => {
      if (!refreshing) {
        setRefreshing(true);
        loadDashboard(true, updatedParameters).finally(() =>
          setRefreshing(false)
        );
      }
    },
    [refreshing, loadDashboard]
  );

  const archiveDashboard = useCallback(() => {
    recordEvent("archive", "dashboard", dashboard.id);
    Dashboard.delete(dashboard).then((updatedDashboard) =>
      setDashboard((currentDashboard) =>
        extend({}, currentDashboard, pick(updatedDashboard, ["is_archived"]))
      )
    );
  }, [dashboard]);

  const showAddTextboxDialog = useCallback(() => {
    TextboxDialog.showModal({
      isNew: true
    }).onClose((text) =>
      dashboard
        .addWidget(text)
        .then(() =>
          setDashboard((currentDashboard) => extend({}, currentDashboard))
        )
    );
  }, [dashboard]);

  const showAddWidgetDialog = useCallback(() => {
    AddWidgetDialog.showModal({
      dashboard
    }).onClose(({ visualization, parameterMappings }) =>
      dashboard
        .addWidget(visualization, {
          parameterMappings:
            editableMappingsToParameterMappings(parameterMappings)
        })
        .then((widget) => {
          const widgetsToSave = [
            widget,
            ...synchronizeWidgetTitles(
              widget.options.parameterMappings,
              dashboard.widgets
            )
          ];
          return Promise.all(widgetsToSave.map((w) => w.save())).then(() =>
            setDashboard((currentDashboard) => extend({}, currentDashboard))
          );
        })
    );
  }, [dashboard]);

  const [refreshRate, setRefreshRate, disableRefreshRate] =
    useRefreshRateHandler(refreshDashboard);
  const editModeHandler = useEditModeHandler(
    !gridDisabled && canEditDashboard,
    dashboard.widgets,
    isEdit
  );

  useEffect(() => {
    setDashboard(dashboardData);
    loadDashboard();
  }, [dashboardData]); // eslint-disable-line react-hooks/exhaustive-deps

  // reload dashboard when filter option changes
  useEffect(() => {
    loadDashboard();
  }, [dashboard.dashboard_filters_enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    dashboard,
    globalParameters,
    refreshing,
    filters,
    setFilters,
    loadDashboard,
    refreshDashboard,
    updateDashboard,
    togglePublished,
    archiveDashboard,
    loadWidget,
    refreshWidget,
    removeWidget,
    canEditDashboard,
    isDashboardOwnerOrAdmin,
    refreshRate,
    setRefreshRate,
    disableRefreshRate,
    ...editModeHandler,
    gridDisabled,
    setGridDisabled,
    showAddTextboxDialog,
    showAddWidgetDialog
  };
}

export default useDashboard;
