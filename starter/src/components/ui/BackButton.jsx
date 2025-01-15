import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const pacmanButtonStyle = {
  backgroundColor: "#FFEB3B", // Yellow (Pac-Man)
  borderRadius: "50%", // Circular button
  color: "#000", // Black text
  fontWeight: "bold",
  fontSize: "18px",
  padding: "12px 30px",
  transition: "all 0.3s ease",
  _hover: {
    backgroundColor: "#FFCA28", // Slightly darker yellow on hover
    transform: "scale(1.05)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
};

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
    <Button onClick={goBack} {...pacmanButtonStyle}>
      {children}
    </Button>
  );
};

export default BackButton;
