import { isFunction, extend, get } from "lodash";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Query } from "../../../api/queries";
import notification from "../../../api/notification";

export default function useFormatQuery(query, syntax, onChange) {
  const onChangeRef = useRef();
  const { t } = useTranslation();
  onChangeRef.current = isFunction(onChange) ? onChange : () => {};

  return useCallback(() => {
    Query.format(syntax || "sql", query.query)
      .then((queryText) => {
        onChangeRef.current(extend(query.clone(), { query: queryText }));
      })
      .catch((error) =>
        notification.error(
          get(error, t("query:format_query.formatquery_error"))
        )
      );
  }, [query, syntax]);
}
