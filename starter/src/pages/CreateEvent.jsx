import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import CreateCard from "./CreateCard"; // Import CreateCard component

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [image, setImage] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      title,
      description,
      dateTime,
      categoryIds: selectedCategoryIds,
      image,
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
    <CreateCard
      title={title}
      description={description}
      dateTime={dateTime}
      selectedCategoryIds={selectedCategoryIds}
      image={image}
      setTitle={setTitle}
      setDescription={setDescription}
      setDateTime={setDateTime}
      setSelectedCategoryIds={setSelectedCategoryIds}
      setImage={setImage}
      handleSubmit={handleSubmit}
    />
  );
};

export default CreateEvent;
