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
          fabriq is an opinionated framework that brings together the right tool
          for every layer of themodern
          {width > 800 ? (
            <span className={styles.highlight}>data stack</span>
          ) : (
            <div className={styles.highlight}>data stack</div>
          )}
        </h1>

        <p className={styles.contentDescription}>
          Unleash data's power with Fabriq! Connect, consolidate, and explore
          insights seamlessly. Automate flow for actionable decisions.
        </p>
        <div className={styles.flowLogo}>
          <img src={FlowImage} alt="Flow" />
        </div>
      </div>
    </div>
  );
}
