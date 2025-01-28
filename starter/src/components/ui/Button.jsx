import React from "react";
import "./Button.css"; // Make sure to import the CSS file
import { Link } from "react-router-dom"; // Import Link for routing

export const Button = () => {
  return (
    <div>
      <Link to="/FormPage">
        <button className="add-event-button">Create Event</button>
      </Link>
    </div>
  );
};

export default Button;
