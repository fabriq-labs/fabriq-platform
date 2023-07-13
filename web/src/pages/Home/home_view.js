// Page Base Component
import React, { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import { navigate } from "@reach/router";

import { Skeleton } from "../../components/Skeleton";
import Datasource from "../../api/datasource";

// Main Component
const PageBase = ({ updateDestinations, updateActiveTab }) => {
  const [Loading, setLoading] = useState(true);
  useEffect(() => {
    Datasource.query().then((res) => {
      setLoading(false);
      if (res?.data?.length > 0) {
        navigate("/content/overview");
        updateActiveTab("overview");
        updateDestinations(res?.data);
      } else {
        navigate("/onboarding");
        updateDestinations([]);
      }
    });
  }, []);

  if (Loading) {
    return <Skeleton />;
  }

  return null;
};

export default React.memo(PageBase, isEqual);
