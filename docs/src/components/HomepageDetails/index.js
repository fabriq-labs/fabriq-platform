import React from "react";
import clsx from "clsx";
import Styles from "./styles.modules.css";

// Logo
import GithubLogo from "../../images/github_logo.png";
import SlackLogo from "../../images/slack.png";
import RoadMapLogo from "../../images/route.png";

const DetailsContainer = (props) => {
  const { title, logo, description, link } = props;
  return (
    <a href={link} target="_blank" className={Styles.containerblock}>
      <div className={Styles.imageblock}>
        <div className={Styles.imagediv}>
          {" "}
          <img src={logo} alt="logo" width="24" height="24" />
        </div>
      </div>
      <div className={Styles.detailsblock}>
        <div className={Styles.subtitle}>{title}</div>
        <p className={Styles.paragraph}>{description}</p>
      </div>
    </a>
  );
};

export default function HomepageDetails() {
  return (
    <div className={clsx(Styles.detailswrapper, "container")}>
      <h1 className={clsx(Styles.contentTitle, Styles.fadeinonscroll)}>
        Secure and <span className={Styles.highlight}>open source</span>{" "}
      </h1>
      <div className={Styles.detailscontainer}>
        <DetailsContainer
          logo={GithubLogo}
          title="Github"
          description="Open issues, PRs, and submit feature requests."
          link="https://github.com/fabriq-labs/fabriq-platform"
        />
        <DetailsContainer
          logo={SlackLogo}
          title="Slack"
          description="Join our community to learn more and ask questions."
          link="https://app.slack.com/"
        />
        <DetailsContainer
          logo={RoadMapLogo}
          title="Roadmap"
          description="See our plans in upcoming weeks and months."
          link="https://app.clickup.com/"
        />
      </div>
    </div>
  );
}
