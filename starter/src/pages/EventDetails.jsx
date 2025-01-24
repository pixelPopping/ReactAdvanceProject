import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const EventDetails = () => {
  const { eventId } = useParams(); // Get eventId from the URL
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch event, categories, and user data
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventResponse = await fetch(
          `http://localhost:3000/events/${eventId}`
        );
        const categoriesResponse = await fetch(
          "http://localhost:3000/categories"
        );
        const usersResponse = await fetch("http://localhost:3000/users");

        if (!eventResponse.ok || !categoriesResponse.ok || !usersResponse.ok) {
          throw new Error("Failed to fetch event, categories, or users data");
        }

        const eventData = await eventResponse.json();
        const categoriesData = await categoriesResponse.json();
        const usersData = await usersResponse.json();

        setEvent(eventData);
        setCategories(categoriesData);
        setUsers(usersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  // Handle saving an updated event
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

      setEvent(updatedEvent); // Update local state
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  // Handle event deletion
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the event");
      }

      navigate("/"); // Redirect to events page after successful deletion
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const createdByUser = users.find(
    (user) => user.id === String(event?.createdBy)
  );

  return (
    <div className="event-details-container">
      {/* BackButton at the top */}
      <BackButton onClick={() => navigate(-1)} />

      {/* Display event details using DetailCard */}
      <DetailCard
        event={event}
        categories={categories}
        createdByUser={createdByUser}
      />

      {/* Edit and Delete Buttons */}
      <div className="event-actions">
        <EditDetailButton
          event={event}
          categories={categories}
          createdByUser={createdByUser}
          onSave={handleSave}
        />

        {/* Pass the eventId to the DeleteButton */}
        <DeleteButton eventId={eventId} />
      </div>
    </div>
  );
};

export default EventDetails;
