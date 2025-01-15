import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define custom Pac-Man style for the toast
const pacmanToastStyle = {
  backgroundColor: "#FFEB3B", // Yellow color for Pac-Man
  color: "#000", // Black text for contrast
  borderRadius: "50px", // Rounded shape for Pac-Man
  fontWeight: "bold",
  fontSize: "18px",
  padding: "15px 30px",
  transition: "all 0.3s ease-in-out",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
};

const ToastNotification = () => {
  const notify = () => {
    toast("Pac-Man Styled Toast!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: pacmanToastStyle, // Apply Pac-Man style to the toast
    });
  };

  return (
    <div>
      <button onClick={notify}>Show Pac-Man Toast</button>
      {/* ToastContainer handles showing toasts */}
      <ToastContainer />
    </div>
  );
};

export default ToastNotification;
