/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import { reduce, has } from "lodash";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import axios from "./axios";
import notification from "./notification";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchSchema(item, refresh = false) {
  const params = {};

  if (refresh) {
    params.refresh = true;
  }

  return axios.get(`api/data_sources/${item.id}/schema`, { params });
}

const fetchSchemaFromJob = (item) =>
  axios.get(`api/jobs/${item.job.id}`).then((res) => {
    const { data } = res;
    if (data.job.status < 3) {
      return sleep(1000).then(() => fetchSchemaFromJob(data));
    }
    if (data.job.status === 3) {
      return data.job.result;
    }
    if (data.job.status === 4 && data.job.error.code === 1) {
      return [];
    }
    return Promise.reject(new Error(data.job.error));
  });

function getSchema(dataSource, refresh = undefined) {
  if (!dataSource) {
    return Promise.resolve([]);
  }

  return fetchSchema(dataSource, refresh)
    .then((res) => {
      const { data } = res;
      if (has(data, "job")) {
        return fetchSchemaFromJob(data);
      }
      return has(data, "schema") ? data.schema : Promise.reject();
    })
    .catch((err) => {
      notification.error("Schema refresh failed.", "Please try again later.");
      return Promise.resolve(err);
    });
}

function prepareSchema(schema) {
  schema.tokensCount = reduce(
    schema,
    (totalLength, table) => totalLength + table.columns.length,
    0
  );
  return schema;
}

export default function useDataSourceSchema(dataSource) {
  const [schema, setSchema] = useState(prepareSchema([]));
  const [loadingSchema, setLoadingSchema] = useState(true);
  const refreshSchemaTokenRef = useRef(null);

  const reloadSchema = useCallback(
    (refresh = undefined) => {
      const refreshToken = Math.random().toString(36).substr(2);
      refreshSchemaTokenRef.current = refreshToken;
      setLoadingSchema(true)
      getSchema(dataSource, refresh).then((data) => {
        if (refreshSchemaTokenRef.current === refreshToken) {
          setSchema(prepareSchema(data));
          setLoadingSchema(false);
        }
      });
    },
    [dataSource]
  );

  useEffect(() => {
    reloadSchema();
  }, [reloadSchema]);

  useEffect(
    () => () => {
      // cancel pending operations
      refreshSchemaTokenRef.current = null;
    },
    []
  );

  return useMemo(() => [schema, reloadSchema, loadingSchema], [schema, reloadSchema, loadingSchema]);
}
