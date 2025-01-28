import React from "react";
import { useNavigate } from "react-router-dom";
import "./BackButton.css"; // Import the CSS file for styling

export const BackButton = ({ children }) => {
  const navigate = useNavigate(); // React Router's navigate hook

  const goBack = () => {
    // If history is empty or invalid, navigate to events page directly
    if (window.history.length > 1) {
      navigate(-1); // Go back to the previous page in history
    } else {
      navigate("/events"); // Redirect to the events page if no history
    }
  };

  return (
    <button onClick={goBack} className="back-button">
      {children || "Go back to events"}{" "}
      {/* Default text if no children passed */}
    </button>
  );
};

export default BackButton;
