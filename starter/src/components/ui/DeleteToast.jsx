import React, { useState, useEffect } from "react";
import "./DeleteToast.css"; // Import the CSS file for the toast styling

export const DeleteToast = ({ status, message, description }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status && message) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 3000); // The toast will disappear after 3 seconds
    }
  }, [status, message]);

  if (!visible) return null;

  return (
    <div className={`toast ${status}`}>
      <strong>{message}</strong>
      <p>{description}</p>
    </div>
  );
};

export default DeleteToast;
