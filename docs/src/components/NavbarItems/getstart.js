import React, { useState } from "react";
import clsx from "clsx";
import "./getstart.css";
import PopupContent from "./PopupContent";

export default function GetStartButton() {
  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  return (
    <>
      <div
        className={clsx("button button--primary button--lg", "get-button")}
        onClick={() => togglePopup()}
      >
        Get Started
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <PopupContent togglePopup={togglePopup} />
        </div>
      )}
    </>
  );
}
