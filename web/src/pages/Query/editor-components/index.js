/* eslint-disable import/prefer-default-export */
import SchemaBrowser from "../schema_browser";

import {
  registerEditorComponent,
  getEditorComponents,
  QueryEditorComponents
} from "./editorComponents";

// default
registerEditorComponent(QueryEditorComponents.SCHEMA_BROWSER, SchemaBrowser);

export { getEditorComponents };
