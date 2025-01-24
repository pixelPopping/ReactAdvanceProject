import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { EventCard } from "../components/EventCard";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [image, setImage] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]); // To store users
  const toast = useToast();
  const navigate = useNavigate();

  // Log state changes for debugging
  useEffect(() => {
    console.log("[CreateEvent] Component mounted.");
    console.log("[CreateEvent] Initial state:", {
      title,
      description,
      dateTime,
      image,
      selectedCategoryIds,
      categories,
      users,
    });
  }, []);

  useEffect(() => {
    console.log("[CreateEvent] Categories updated:", categories);
  }, [categories]);

  useEffect(() => {
    console.log(
      "[CreateEvent] Selected Category IDs updated:",
      selectedCategoryIds
    );
  }, [selectedCategoryIds]);

  useEffect(() => {
    console.log("[CreateEvent] Users updated:", users);
  }, [users]);

  // Fetch categories and users on mount
  useEffect(() => {
    const fetchData = async () => {
      console.log("[CreateEvent] Fetching categories and users...");
      try {
        const [categoryResponse, userResponse] = await Promise.all([
          fetch("http://localhost:3000/categories"),
          fetch("http://localhost:3000/users"),
        ]);

        if (!categoryResponse.ok || !userResponse.ok) {
          throw new Error("Failed to fetch categories or users");
        }

        const categoriesData = await categoryResponse.json();
        const usersData = await userResponse.json();

        setCategories(categoriesData);
        setUsers(usersData);
        console.log("[CreateEvent] Fetched categories and users successfully.");
      } catch (error) {
        console.error("[CreateEvent] Error fetching data:", error.message);
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[CreateEvent] Form submitted with data:", {
      title,
      description,
      dateTime,
      categoryIds: selectedCategoryIds,
      image,
      createdBy: "", // Replace this with the logged-in user ID if available
    });

    const newEvent = {
      title,
      description,
      dateTime,
      categoryIds: selectedCategoryIds,
      image,
      createdBy: "", // Adding createdBy field, replace with the logged-in user's ID
    };

    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        console.log("[CreateEvent] Event created successfully.");
        toast({
          title: "Event created successfully!",
          description: "Your event has been created.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/events");
      } else {
        throw new Error("Failed to create event");
      }
    } catch (error) {
      console.error("[CreateEvent] Error creating event:", error.message);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <EventCard
      title={title}
      description={description}
      dateTime={dateTime}
      selectedCategoryIds={selectedCategoryIds}
      image={image}
      setTitle={(value) => {
        console.log("[CreateEvent] Title updated:", value);
        setTitle(value);
      }}
      setDescription={(value) => {
        console.log("[CreateEvent] Description updated:", value);
        setDescription(value);
      }}
      setDateTime={(value) => {
        console.log("[CreateEvent] DateTime updated:", value);
        setDateTime(value);
      }}
      setSelectedCategoryIds={(value) => {
        console.log("[CreateEvent] Selected categories updated:", value);
        setSelectedCategoryIds(value);
      }}
      setImage={(value) => {
        console.log("[CreateEvent] Image URL updated:", value);
        setImage(value);
      }}
      categories={categories}
      handleSubmit={handleSubmit}
    />
  );
};

export default CreateEvent;
