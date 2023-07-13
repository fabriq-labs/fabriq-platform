import { isFunction, map } from "lodash";
import { useCallback, useRef } from "react";
import EditParameterSettingsDialog from "../editor-components/parameter_setting_dialog";
import { createParameter } from "../../../api/parameters/index";

export default function useAddNewParameterDialog(query, onParameterAdded) {
  const onParameterAddedRef = useRef();
  onParameterAddedRef.current = isFunction(onParameterAdded)
    ? onParameterAdded
    : () => {};

  return useCallback(() => {
    EditParameterSettingsDialog.showModal({
      parameter: {
        title: null,
        name: "",
        type: "text",
        value: null
      },
      existingParams: map(query.options.parameters, (p) => p.name)
    }).onClose((param) => {
      const newQuery = query;
      newQuery.options.parameters = newQuery.options.parameters.filter(
        (p) => p.name !== param.name
      ); // eslint-disable-line
      param = createParameter(param);
      newQuery.options.parameters.push(param);

      onParameterAddedRef.current(newQuery, param);
    });
  }, [query]);
}
