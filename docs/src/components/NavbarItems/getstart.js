import React from "react";
import clsx from "clsx";
import "./getstart.css";

export default function GetStartButton() {
  return (
    <div className={clsx("button button--primary button--lg", "get-button")}>
      Get Started
    </div>
  );
}
