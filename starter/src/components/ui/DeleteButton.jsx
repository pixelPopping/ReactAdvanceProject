import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
import "./DeleteButton.css";

const DeleteButton = ({ eventId }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });

      // Log the response for debugging purposes
      console.log("Delete response:", response);

      if (!response.ok) {
        throw new Error("Failed to delete the event");
      }

      // Show success toast
      toast.success("Event deleted successfully!");

      // Redirect to the events page after successful deletion
      navigate("/"); // Or use navigate("/events") based on your app structure
    } catch (err) {
      // Log any errors that occur during the delete process
      console.error("Error deleting event:", err.message);
      // Show error toast
      toast.error("Error deleting event: " + err.message);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmModal(true)}
        className="delete-button"
      >
        Delete Event
      </button>

      {showConfirmModal && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-modal-content">
            <h3>Are you sure you want to delete this event?</h3>
            <div className="modal-actions">
              <button onClick={handleDelete} className="confirm-button">
                Yes
              </button>
              <button onClick={cancelDelete} className="cancel-button">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButton;
