/* eslint-disable no-shadow */
// Explore Component
import React, { useEffect } from "react";
import isEqual from "react-fast-compare";
import { navigate } from "@reach/router";

// Main Component
const ExplorePage = (props) => {
  const { refreshActiveMenu } = props;

  useEffect(() => {
    refreshActiveMenu();
    navigate("/explore/queries");
  }, []);

  return null;
};

export default React.memo(ExplorePage, isEqual);
