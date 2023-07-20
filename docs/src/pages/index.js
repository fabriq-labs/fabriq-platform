import React, { useRef } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import styles from "./index.module.css";
import FlowImage from "../images/data_modal_new.png";
import ExtractDataImage from "../images/extract_data.jpg";
import LoadDataImage from "../images/load_data.jpg";
import DataAnalytics from "../images/data-analytics.jpg";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero", styles.heroBanner)}>
      <div className="container">
        <h1 className={styles.heroTitle}>Open Source Data Warehouse</h1>
        <p className={styles.heroDescription}>
          Empowering Data-Driven Decision Making with Centralized Data
          Integration and Automation
        </p>
        <div className={styles.buttons}>
          <Link
            className={clsx(
              "button button--primary button--lg",
              styles.heroButton
            )}
            to="/docs/quickstart/start_fabriq"
            style={{ marginRight: 10 }}
          >
            Get Started
          </Link>
          <Link
            className={clsx(
              "button button--primary button--lg",
              styles.heroButton
            )}
            to="https://github.com/fabriq-labs/fabriq-platform"
            style={{ marginRight: 10 }}
          >
            Github
          </Link>
        </div>
      </div>
    </header>
  );
}

function HomepageContent() {
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
        <h1 className={styles.contentTitle}>
          Empowering Data-Driven Decision Making with Centralized Data
          Integration and Automation
        </h1>

        <p className={styles.contentDescription}>
          Unleash data's power with Fabriq! Connect, consolidate, and explore
          insights seamlessly. Automate flow for actionable decisions.
        </p>
        <div className={styles.flowLogo}>
          <img src={FlowImage} alt="Flow" />
        </div>
        <div className={styles.homepageDetails}>
          <h1 className={styles.contentTitle}>
            Your Data's Single Source of Truth for Integration, Collaboration, &
            Actionable Insights.
          </h1>
          <p className={styles.contentDescription}>
            Empower seamless end-to-end data pipelines, orchestrating raw data
            integration to catalyzing decisive business actions - all through a
            user-friendly interface
          </p>
          <div className={styles.contentFlow}>
            <div className={styles.connectcontainer}>
              <div className={styles.contentspace}>
                <div className={styles.contentpara}>
                  <h3 className={styles.contentHeading}>
                    Extract data from anywhere
                  </h3>
                  <p className={styles.contentDescriptionPage}>
                    Your Gateway to Seamless Data Integration and a Unified
                    Single Source of Truth. Unlock the power of connectivity as
                    Fabriq effortlessly bridges the gap between your diverse
                    software applications, channeling all your valuable data
                    into one centralized hub. Say goodbye to data silos and
                    welcome a new era of data-driven decision making with Fabriq
                    by your side.
                  </p>
                </div>
              </div>
              <div className={styles.imagespace}>
                <img
                  src={ExtractDataImage}
                  alt="Extract data"
                  width="1000px"
                  height="250"
                />
              </div>
            </div>
            <div className={styles.connectcontainer}>
              <div className={styles.imagespace}>
                <img
                  src={LoadDataImage}
                  alt="Load data"
                  width="1300"
                  height="250"
                />
              </div>
              <div className={styles.contentspacedata}>
                <div className={styles.contentpara}>
                  <h3 className={styles.contentHeading}>
                    Load data how you need
                  </h3>
                  <p className={styles.contentDescriptionPage}>
                    Experience rapid data integration with our cutting-edge
                    solution. Ingest data seamlessly in near real-time, taking
                    full control of its landing. Benefit from smart preload
                    transformations, automated schema mapping, and continuous
                    data updates for actionable insights. Empower your team with
                    advanced analytics tools, making data-driven decisions
                    faster and more effectively.
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.connectcontainer}>
              <div className={styles.contentspace}>
                <div className={styles.contentpara}>
                  <h3 className={styles.contentHeading}>
                    Transform data for analytics
                  </h3>
                  <p className={styles.contentDescriptionPage}>
                    Effortlessly optimize your data for analytics as it
                    seamlessly enters the warehouse through our robust data
                    models and synchronized workflows. Experience a competitive
                    advantage with our user-friendly platform that simplifies
                    the data preparation process, empowering your team to make
                    well-informed decisions with precision and efficiency.
                  </p>
                </div>
              </div>
              <div className={styles.imagespace}>
                <img
                  src={DataAnalytics}
                  alt="Data Analytics"
                  width="1000px"
                  height="250"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const howItWorksRef = useRef(null);
  const featuresRef = useRef(null);
  const useCasesRef = useRef(null);

  const scrollToSection = (ref) => {
    const container = ref.current;
    const containerRect = container.getBoundingClientRect();
    const offsetTop = containerRect.top + window.pageYOffset - window.innerHeight / 2;

    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    });
  };
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <div ref={howItWorksRef} id="how-it-works" >
      <HomepageHeader />
      </div>
      <main ref={featuresRef} id="features" className={styles.mainFeature}>
        <HomepageFeatures />
      </main>
      <div ref={useCasesRef} id="use-cases">
        <HomepageContent />
      </div>
    </Layout>
  );
}
