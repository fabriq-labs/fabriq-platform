/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import PropTypes from "prop-types";
import { VisualizationType } from "@redash/viz/lib";
import { useTranslation } from "react-i18next";
import VisualizationName from "./VisualizationName";
import { Query } from "../../api/queries";
import { navigate } from "@reach/router";
import notification from "../../api/notification";
function QueryLink({
  query,
  visualization,
  readOnly,
  updateQueryActiveMenu,
  updateQuery,
  updateQueryObj,
  updateActiveTab
}) {
  const { t } = useTranslation();
  const getUrl = () => {
    Query.get({ id: query.id })
      .then((query) => {
        const { data } = query;
        const user = data.user;
        const email = localStorage.getItem("user_email");
        if (user && user.email === email) {
          updateQueryActiveMenu("myquery");
          updateQuery(false);
          updateActiveTab("explore");
        } else {
          updateQueryActiveMenu("sharedqueries");
          updateQuery(true);
          updateActiveTab("explore");
        }

        localStorage.setItem("visualizationId", visualization.id);
        navigate(`/queries/${data.id}`);
      })
      .catch((err) => {
        notification.error(t("redash:querylink.querylist_error"), err.message);
      });
  };

  return (
    <div onClick={readOnly ? null : getUrl} className="query-link">
      <span>{query.name} :: </span>
      <VisualizationName visualization={visualization} />{" "}
    </div>
  );
}

QueryLink.propTypes = {
  query: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  visualization: VisualizationType,
  readOnly: PropTypes.bool
};

QueryLink.defaultProps = {
  visualization: null,
  readOnly: false
};

export default QueryLink;
