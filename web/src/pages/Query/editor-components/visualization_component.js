import React from "react";
import { pick } from "lodash";
import {
  Renderer as VisRenderer,
  Editor as VisEditor,
  updateVisualizationsSettings
} from "@redash/viz/lib";
import countriesDataUrl from "@redash/viz/lib/visualizations/choropleth/maps/countries.geo.json";
import subdivJapanDataUrl from "@redash/viz/lib/visualizations/choropleth/maps/japan.prefectures.geo.json";
import HelpTrigger from "./helptrigger";

function wrapComponentWithSettings(WrappedComponent) {
  return function VisualizationComponent(props) {
    updateVisualizationsSettings({
      HelpTriggerComponent: HelpTrigger,
      choroplethAvailableMaps: {
        countries: {
          name: "Countries",
          url: countriesDataUrl
        },
        subdiv_japan: {
          name: "Japan/Prefectures",
          url: subdivJapanDataUrl
        }
      },
      ...pick({}, [
        "dateFormat",
        "dateTimeFormat",
        "integerFormat",
        "floatFormat",
        "booleanValues",
        "tableCellMaxJSONSize",
        "allowCustomJSVisualization",
        "hidePlotlyModeBar"
      ])
    });

    return <WrappedComponent {...props} />;
  };
}

export const Renderer = wrapComponentWithSettings(VisRenderer);
export const Editor = wrapComponentWithSettings(VisEditor);
