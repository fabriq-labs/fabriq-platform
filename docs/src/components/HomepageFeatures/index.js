import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

// Logos

import FlowImage from "../../images/data_modal_new.png";

export default function HomepageFeatures() {
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
          Empowering Data-Driven Decision Making with Centralized
          <span className={styles.highlight}>Data Integration</span>
          and Automation
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
