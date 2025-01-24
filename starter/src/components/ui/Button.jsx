import React from "react";
import "./Button.css"; // Make sure to import the CSS file

export const Button = () => {
  return (
    <div>
      <button
        className="custom-button"
        onClick={() => (window.location.href = "/FormPage/")}
      >
        Add Event
      </button>
    </div>
  );
};

export default Button;
