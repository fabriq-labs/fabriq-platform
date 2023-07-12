// HelmetComponent

import React from "react";
import Helmet from "react-helmet";
import isEqual from "react-fast-compare";

const HelmetComponent = ({ title }) => {
  var defaultTitle = "Fabriq";
  return (
    <Helmet>
      <title>{title ? `${title} | ${defaultTitle}` : defaultTitle}</title>
    </Helmet>
  );
};

export default React.memo(HelmetComponent, isEqual);
