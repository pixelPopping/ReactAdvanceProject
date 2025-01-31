import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
import DetailCard from "../components/DetailCard";
import EditDetailButton from "../components/ui/EditDetailButton";
import DeleteButton from "../components/ui/DeleteButton";
import BackButton from "../components/ui/BackButton";
import "./EventDetail.css";

export const loader = async ({ params }) => {
  const { eventId } = params;

  const eventResponse = await fetch(`http://localhost:3000/events/${eventId}`);
  const categoriesResponse = await fetch("http://localhost:3000/categories");
  const usersResponse = await fetch("http://localhost:3000/users");

  if (!eventResponse.ok || !categoriesResponse.ok || !usersResponse.ok) {
    throw new Error("Failed to fetch event, categories, or users");
  }

  const event = await eventResponse.json();
  const categories = await categoriesResponse.json();
  const users = await usersResponse.json();

  return { event, categories, users };
};

const EventDetails = ({ refetchEvents }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const [eventResponse, categoriesResponse, usersResponse] =
          await Promise.all([
            fetch(`http://localhost:3000/events/${eventId}`),
            fetch("http://localhost:3000/categories"),
            fetch("http://localhost:3000/users"),
          ]);

        if (!eventResponse.ok || !categoriesResponse.ok || !usersResponse.ok) {
          throw new Error("Failed to fetch event, categories, or users data");
        }

        setEvent(await eventResponse.json());
        setCategories(await categoriesResponse.json());
        setUsers(await usersResponse.json());
      } catch (err) {
        setError(err.message);
        toast.error("Failed to fetch event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  const handleSave = async (updatedEvent) => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        throw new Error("Failed to update the event");
      }

      setEvent(updatedEvent);
      if (refetchEvents) refetchEvents();

      // Show success toast after saving
      toast.success("Event updated successfully!");

      navigate("/");
    } catch (err) {
      setError(err.message);
      toast.error("Error updating event: " + err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the event");
      }

      // Optionally refetch events list in the parent component
      if (refetchEvents) refetchEvents();

      // Show success toast after deletion
      toast.success("Event deleted successfully!");

      navigate("/");
    } catch (err) {
      setError(err.message);
      // Show error toast in red when there is a deletion error
      toast.error("Error deleting event: " + err.message); // This will show a red toast if error occurs
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const createdByUser = users.find(
    (user) => user.id === String(event?.createdBy)
  );

  return (
    <div className="event-details-container">
      <BackButton onClick={() => navigate(-1)} />
      <DetailCard
        event={event}
        categories={categories}
        createdByUser={createdByUser}
      />
      <div className="event-actions">
        <EditDetailButton
          event={event}
          categories={categories}
          createdByUser={createdByUser}
          onSave={handleSave}
        />
        <DeleteButton eventId={eventId} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default EventDetails;
