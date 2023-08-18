import React from 'react';

const PopupContent = ({ togglePopup }) => {
  return (
    <div className="popup-container">
      <div onClick={() =>togglePopup()} class="cancel-button">x</div>
      <iframe
        src={"https://calendly.com/madhan-9ui/product-demo-and-onboarding"}
        height="600"
        frameBorder="0"
        title="Calendly Popup"
        className='iframe-calendly-popup'
      ></iframe>
    </div>
  );
};

export default PopupContent;
