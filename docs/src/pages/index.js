import React, { useRef, useEffect, useState } from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "../components/HomepageFeatures";
import HomepageDetails from "../components/HomepageDetails";

import styles from "./index.module.css";

import ExtractDataImage from "../images/extract_data.jpg";
import LoadDataImage from "../images/load_data.jpg";
import DataAnalytics from "../images/data-analytics.jpg";
import PopupContent from "../components/NavbarItems/PopupContent";

// Logos
import Rightarrow from "../images/arrow_right.png";
import HeroBanner from "../images/connect.jpg";

const myStyle = {
  mixBlendMode: "multiply",
  filter: "url(#dropshadow-1)",
};

function HomepageHeader(props) {
  const { width, togglePopup } = props;
  return (
    <header
      className={clsx("hero", styles.heroBanner)}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div className="container">
        <h1 className={styles.heroTitle}>
          Content analytics with your{" "}
          <span className={styles.highlight}> own data</span>
        </h1>
        <p className={styles.heroDescription}>
          The open source data stack that can be setup on top of your own
          data-warehouse
        </p>
        <div className={styles.buttons}>
          <button
            className={clsx(
              "button button--primary button--lg",
              styles.heroButton
            )}
            style={{ marginRight: 10 }}
            onClick={() => togglePopup()}
          >
            Meet us at ONA
          </button>
          <button
            className={clsx(
              "button button--primary button--lg",
              styles.readDocsButton
            )}
            style={{ marginRight: 10, background: "transparent !important" }}
            onClick={() => {
              window.location.href = "/docs/introduction";
            }}
          >
            Read docs
          </button>
        </div>
      </div>
      <section className={styles.features}>
        <div className={styles.containerImages}>
          <div className={styles.herobrowser}>
            <img src={HeroBanner} alt="Hero Banner" />
          </div>
        </div>
      </section>
    </header>
  );
}

function HomepageContent(props) {
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
        <div className={styles.homepagecontentdetails}>
          <h1 className={clsx(styles.contentTitle, styles.fadeinonscroll)}>
            We have chosen the best tools to build your{" "}
            <span className={styles.highlight}>Modern Data Stack </span>
          </h1>
          <p className={clsx(styles.contentDescription, styles.fadeinonscroll)}>
            From creating first party content engagement data to collecting data
            from third party tools like paid media, fabriq has opinionated ways
            to generate insights by bringing them together
          </p>
          <div className={styles.contentFlow}>
            <div
              className={clsx(styles.connectcontainer, styles.slideinonscroll)}
            >
              <div className={styles.contentspace}>
                <div className={styles.contentpara}>
                  <div className={styles.contentsubheading}>Managed syncs</div>
                  <h3 className={styles.contentHeading}>
                    Extract data from anywhere
                  </h3>
                  {width < 800 && (
                    <div className={styles.imagespace}>
                      <img src={ExtractDataImage} alt="Extract data" />
                    </div>
                  )}
                  <p className={styles.contentDescriptionPage}>
                    With the explosion of SaaS and specialized tools that are
                    part of the content workflow, data is present in multiple
                    silos. Continuously sync data from hundreds of tools to your
                    data-warehouse, where you can analyze them alongside your
                    first party engagement data.
                  </p>
                  <div
                    className={styles.learnmore}
                    onClick={() => {
                      window.location.href = "/docs/introduction";
                    }}
                  >
                    <div className={styles.learnmoretitle}>Learn more</div>
                    <img
                      src={Rightarrow}
                      alt="arrow"
                      style={{ width: "0.75rem", height: "0.95rem" }}
                    />
                  </div>
                </div>
              </div>
              {width > 800 && (
                <div className={styles.imagespace}>
                  <img src={ExtractDataImage} alt="Extract data" />
                </div>
              )}
            </div>
            <div className={styles.connectcontainer}>
              {width > 800 && (
                <div className={styles.contentspace}>
                  <img
                    src={LoadDataImage}
                    alt="Load data"
                    style={{
                      width: "100% !important",
                    }}
                  />
                </div>
              )}
              <div className={styles.contentspacedataright}>
                <div className={styles.contentpara}>
                  <div className={styles.contentsubheading}>
                    Audience Engagement
                  </div>
                  <h3 className={styles.contentHeading}>
                    Collect first-party data
                  </h3>
                  {width < 800 && (
                    <div className={styles.contentspace}>
                      <img
                        src={LoadDataImage}
                        alt="Load data"
                        style={{
                          width: "100% !important",
                        }}
                      />
                    </div>
                  )}
                  <p className={styles.contentDescriptionPage}>
                    Collect first-party data across your content delivery
                    systems and stream them to your own data-warehouse. Get
                    complete visibility in to the audience journey in real time.
                  </p>
                  <div
                    className={styles.learnmore}
                    onClick={() => {
                      window.location.href = "/docs/introduction";
                    }}
                  >
                    <div className={styles.learnmoretitle}>Learn more</div>
                    <img
                      src={Rightarrow}
                      alt="arrow"
                      style={{ width: "0.75rem", height: "0.95rem" }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.connectcontainer}>
              <div className={styles.contentspace}>
                <div className={styles.contentsubheading}>Analytics</div>
                <div className={styles.contentpara}>
                  <h3 className={styles.contentHeading}>
                    Transform data for analytics
                  </h3>
                  {width < 800 && (
                    <div className={styles.imagespace}>
                      <img src={DataAnalytics} alt="Data Analytics" />
                    </div>
                  )}
                  <p className={styles.contentDescriptionPage}>
                    fabriq comes with rich canonical data models for content
                    engagement that can accessed through pre-built dashboards.
                    Since the event level data is available in the
                    data-warehouse, you can build for specific use-cases on top
                    of them and/or customize the pre-built models.
                  </p>
                  <div
                    className={styles.learnmore}
                    onClick={() => {
                      window.location.href = "/docs/introduction";
                    }}
                  >
                    <div className={styles.learnmoretitle}>Learn more</div>
                    <img
                      src={Rightarrow}
                      alt="arrow"
                      style={{ width: "0.75rem", height: "0.95rem" }}
                    />
                  </div>
                </div>
              </div>
              {width > 800 && (
                <div className={styles.imagespace}>
                  <img src={DataAnalytics} alt="Data Analytics" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Updated FadeInSection with Intersection Observer
const FadeInSection = ({ children, id }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-on-scroll");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.3, // Adjust this threshold value to control when the fade-in happens
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div id={id} ref={sectionRef} className={styles.fadeInSection}>
      {children}
    </div>
  );
};

const Home = () => {
  const { siteConfig } = useDocusaurusContext();
  const [windowWidth, setWindowWidth] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    // Function to handle window resize event
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener for window resize
    // Check if we're in the browser before accessing the window object
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      // Get initial window width
      setWindowWidth(window.innerWidth);
    }

    // Clean up the event listener when the component is unmounted
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <FadeInSection>
        <HomepageHeader width={windowWidth} togglePopup={togglePopup} />
      </FadeInSection>
      <FadeInSection id="how-it-works">
        <HomepageFeatures width={windowWidth} />
      </FadeInSection>
      <FadeInSection id="features">
        <HomepageContent width={windowWidth} />
      </FadeInSection>
      <div>
        <HomepageDetails />
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <PopupContent togglePopup={togglePopup} />
        </div>
      )}
    </Layout>
  );
};

export default Home;
