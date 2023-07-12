// Helper
import HelpTrigger from "../../../components/Redash/HelpTrigger";
import _ from "lodash";

const filterTypes = ["filter", "multi-filter", "multiFilter"];

function getColumnNameWithoutType(column) {
  let typeSplit;
  if (column.indexOf("::") !== -1) {
    typeSplit = "::";
  } else if (column.indexOf("__") !== -1) {
    typeSplit = "__";
  } else {
    return column;
  }

  const parts = column.split(typeSplit);
  if (parts[0] === "" && parts.length === 2) {
    return parts[1];
  }

  if (!_.includes(filterTypes, parts[1])) {
    return column;
  }

  return parts[0];
}

function getColumnContentAlignment(type) {
  return ["integer", "float", "boolean", "date", "datetime"].indexOf(type) >= 0
    ? "right"
    : "left";
}

let visualizationsSettings = {
  HelpTriggerComponent: HelpTrigger,
  dateFormat: "DD/MM/YYYY",
  dateTimeFormat: "DD/MM/YYYY HH:mm",
  integetFormat: "0,0",
  floatFormat: "0,0.00",
  booleanValues: ["false", "true"],
  tableCellMaxJSONSize: 50000,
  allowCustomJSVisualization: false,
  hidePlotlyModeBar: false,
  choroplethAvailableMaps: {}
};

const displayAs = {
  integer: "number",
  float: "number",
  boolean: "boolean",
  date: "datetime",
  datetime: "datetime"
};

export function getDefaultFormatOptions(column, index) {
  let dateTimeFormat = {
    date: visualizationsSettings.dateFormat || "DD/MM/YYYY",
    datetime: visualizationsSettings.dateTimeFormat || "DD/MM/YYYY HH:mm"
  };
  let numberFormat = {
    integer: visualizationsSettings.integerFormat || "0,0",
    float: visualizationsSettings.floatFormat || "0,0.00"
  };
  return {
    dateTimeFormat: dateTimeFormat[column.type],
    numberFormat: numberFormat[column.type],
    booleanValues: visualizationsSettings.booleanValues || ["false", "true"],
    // `image` cell options
    imageUrlTemplate: "{{ @ }}",
    imageTitleTemplate: "{{ @ }}",
    imageWidth: "",
    imageHeight: "",
    // `link` cell options
    linkUrlTemplate: "{{ @ }}",
    linkTextTemplate: "{{ @ }}",
    linkTitleTemplate: "{{ @ }}",
    linkOpenInNewTab: true,
    name: column.name,
    type: column.type,
    displayAs: displayAs[column.type] || "string",
    visible: true,
    order: 100000 + index,
    title: getColumnNameWithoutType(column.name),
    allowSearch: false,
    alignContent: getColumnContentAlignment(column.type),
    // `string` cell options
    allowHTML: true,
    highlightLinks: false
  };
}
