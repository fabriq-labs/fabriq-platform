import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

// Logos

import FlowImage from "../../images/flow_update_new.png";

export default function HomepageFeatures(props) {
  const { width } = props;
  return (
    <div className={styles.homepageContent}>
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p className={styles.contentHeading}>What can you do with fabriq?</p>
        <h1 className={styles.contentTitle}>
          Understand your audience for
          <span className={styles.highlight}>actionable</span>
          <br />
          insights on editorial decisions, growth and revenue
        </h1>

        <p className={styles.contentDescription}>
          fabriq is a suite of tools to collect all kinds of data about
          engagement and monetization
        </p>
        <div className={styles.flowLogo}>
          <img src={FlowImage} alt="Flow" />
        </div>
      </div>
    </div>
  );
}
