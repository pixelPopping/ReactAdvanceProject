import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Importing toast
import "react-toastify/dist/ReactToastify.css"; // Required styles for toast
import { BackButton } from "../components/ui/BackButton";

// Toaster component to show notifications
const Toaster = () => {
  return <ToastContainer />;
};

export const loader = async ({ params }) => {
  const { eventId } = params;

  console.log("Fetching event details for eventId:", eventId); // Debug: Log the eventId

  const eventResponse = await fetch(`http://localhost:3000/events/${eventId}`);
  const categoriesResponse = await fetch("http://localhost:3000/categories");

  if (!eventResponse.ok || !categoriesResponse.ok) {
    console.error("Failed to fetch event or categories"); // Debug: Log fetch errors
    throw new Error("Failed to fetch event or categories");
  }

  const event = await eventResponse.json();
  const categories = await categoriesResponse.json();

  console.log("Fetched event data:", event); // Debug: Log the fetched event data
  console.log("Fetched categories data:", categories); // Debug: Log the fetched categories

  return { event, categories };
};

const EventDetails = () => {
  const { event: initialEvent, categories } = useLoaderData();
  const [editedEvent, setEditedEvent] = useState({
    ...initialEvent,
    categoryIds: initialEvent.categoryIds || [], // Default to empty array if undefined
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prev) => ({
      ...prev,
      [name]:
        name === "categoryIds"
          ? value
              .split(",")
              .map((id) => Number(id.trim())) // Ensure `categoryIds` are numbers
              .filter(Boolean)
          : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedEvent = {
      ...editedEvent,
      categoryIds: editedEvent.categoryIds.filter(Boolean),
    };

    // Basic validation
    if (!editedEvent.title || !editedEvent.description) {
      return toast.error("Title and description are required.");
    }

    if (new Date(editedEvent.startTime) >= new Date(editedEvent.endTime)) {
      return toast.error("Start time must be before end time.");
    }

    // Display the loading toast and capture its ID for later updates
    const loadingId = toast.loading("Saving changes, please wait...");

    try {
      const response = await fetch(
        `http://localhost:3000/events/${initialEvent.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedEvent),
        }
      );

      if (response.ok) {
        toast.update(loadingId, {
          render: "Event updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        const errorText = await response.text();
        toast.update(loadingId, {
          render: `Failed to update event: ${errorText || response.statusText}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.update(loadingId, {
        render: "An error occurred while updating the event.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Error updating event:", error);
    }
  };

  // Handle event deletion
  const handleDelete = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmation) return;

    const loadingId = toast.loading("Deleting event, please wait...");

    try {
      const response = await fetch(
        `http://localhost:3000/events/${initialEvent.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.update(loadingId, {
          render: "Event deleted successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        const errorText = await response.text();
        toast.update(loadingId, {
          render: `Failed to delete event: ${errorText || response.statusText}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.update(loadingId, {
        render: "An error occurred while deleting the event.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div>
      <Toaster />{" "}
      {/* Add the Toaster component to display toast notifications */}
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={editedEvent.title}
          onChange={handleChange}
          placeholder="Event Title"
        />
        <textarea
          name="description"
          value={editedEvent.description}
          onChange={handleChange}
          placeholder="Event Description"
        />
        <input
          type="datetime-local"
          name="startTime"
          value={editedEvent.startTime}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="endTime"
          value={editedEvent.endTime}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          value={editedEvent.image}
          onChange={handleChange}
          placeholder="Image URL"
        />
        {editedEvent.image && <img src={editedEvent.image} alt="Preview" />}

        {/* Category IDs input as text */}
        <input
          type="text"
          name="categoryIds"
          value={editedEvent.categoryIds}
          onChange={handleChange}
          placeholder="Category IDs (comma-separated)"
        />

        {/* Category selection dropdown */}
        <h3>Categories</h3>
        <select
          name="categoryIds"
          multiple
          value={editedEvent.categoryIds} // Convert to string for the select element
          onChange={(e) =>
            handleChange({
              target: {
                name: "categoryIds",
                value: Array.from(e.target.selectedOptions)
                  .map((opt) => opt.value)
                  .join(", "),
              },
            })
          }
        >
          {categories.map((category) => (
            <option key={category.id} value={String(category.id)}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Submit Button */}
        <button type="submit">Save Changes</button>
      </form>
      {/* Delete Event Button */}
      <button
        onClick={handleDelete}
        style={{ marginTop: "20px", backgroundColor: "red", color: "white" }}
      >
        Delete Event
      </button>
      <div className="button">
        <BackButton>View More Events</BackButton>
      </div>
    </div>
  );
};

export default EventDetails;
