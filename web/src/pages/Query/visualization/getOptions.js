/* eslint-disable no-loop-func */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getOptions;

let _lodash = require("lodash");
let HelpTrigger = require("../../../components/Redash/HelpTrigger");

let DEFAULT_OPTIONS = {
  itemsPerPage: 25,
  paginationSize: "default" // not editable through Editor
};
let filterTypes = ["filter", "multi-filter", "multiFilter"];

function ownKeys(object, enumerableOnly) {
  let keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    let symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (let i = 1; i < arguments.length; i++) {
    let source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        );
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function wereColumnsReordered(queryColumns, visualizationColumns) {
  queryColumns = _lodash.map(queryColumns, (col) => col.name);
  visualizationColumns = _lodash.map(visualizationColumns, (col) => col.name); // Some columns may be removed - so skip them (but keep original order)

  visualizationColumns = _lodash.filter(visualizationColumns, (col) =>
    _lodash.includes(queryColumns, col)
  ); // Pick query columns that were previously saved with viz (but keep order too)

  queryColumns = _lodash.filter(queryColumns, (col) =>
    _lodash.includes(visualizationColumns, col)
  ); // Both array now have the same size as they both contains only common columns
  // (in fact, it was an intersection, that kept order of items on both arrays).
  // Now check for equality item-by-item; if common columns are in the same order -
  // they were not reordered in editor

  for (let i = 0; i < queryColumns.length; i += 1) {
    if (visualizationColumns[i] !== queryColumns[i]) {
      return true;
    }
  }

  return false;
}

function getColumnNameWithoutType(column) {
  let typeSplit;

  if (column.indexOf("::") !== -1) {
    typeSplit = "::";
  } else if (column.indexOf("__") !== -1) {
    typeSplit = "__";
  } else {
    return column;
  }

  let parts = column.split(typeSplit);

  if (parts[0] === "" && parts.length === 2) {
    return parts[1];
  }

  if (!_lodash.includes(filterTypes, parts[1])) {
    return column;
  }

  return parts[0];
}

function getColumnContentAlignment(type) {
  return ["integer", "float", "boolean", "date", "datetime"].indexOf(type) >= 0
    ? "right"
    : "left";
}

function getDefaultColumnsOptions(columns, content) {
  let displayAs = {
    integer: "number",
    float: "number",
    boolean: "boolean",
    date: "datetime",
    datetime: "datetime"
  };
  return _lodash.map(columns, (col, index) => ({
    name: col.name,
    type: col.type,
    displayAs:
      col.name === content.title ? "link" : displayAs[col.type] || "string",
    visible: true,
    order: 100000 + index,
    title: getColumnNameWithoutType(col.name),
    allowSearch: false,
    alignContent: getColumnContentAlignment(col.type),
    // `string` cell options
    allowHTML: true,
    highlightLinks: false
  }));
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

function getDefaultFormatOptions(column) {
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
    linkOpenInNewTab: true
  };
}

function getColumnsOptions(columns, visualizationColumns, content) {
  let options = getDefaultColumnsOptions(columns, content);
  if (wereColumnsReordered(columns, visualizationColumns)) {
    visualizationColumns = _lodash.fromPairs(
      _lodash.map(visualizationColumns, (col, index) => [
        col.name,
        _lodash.extend({}, col, {
          order: index
        })
      ])
    );
  } else {
    visualizationColumns = _lodash.fromPairs(
      _lodash.map(visualizationColumns, (col) => [
        col.name,
        _lodash.omit(col, "order")
      ])
    );
  }

  visualizationColumns[content.name].linkUrlTemplate =
    content.linkUrlTemplate === "" ? "{{ @ }}" : content.linkUrlTemplate;

  _lodash.each(options, (col) =>
    _lodash.extend(col, visualizationColumns[col.name])
  );

  return _lodash.sortBy(options, "order");
}

function getOptions(options, _ref, content) {
  let columns = _ref.columns;
  options = _objectSpread({}, DEFAULT_OPTIONS, {}, options);
  options.columns = _lodash.map(
    getColumnsOptions(columns, options.columns, content),
    (col) => _objectSpread({}, getDefaultFormatOptions(col), {}, col)
  );
  return options;
}
