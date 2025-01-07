import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Text,
  Button,
  Input,
  Textarea,
  Select,
  Image,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Avatar,
  SimpleGrid,
} from "@chakra-ui/react";
import { BackButton } from "../components/ui/BackButton"; // Assuming this is a custom component

const Toaster = () => {
  return <ToastContainer />;
};

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
  const { event: initialEvent, categories, users } = useLoaderData();
  const [editedEvent, setEditedEvent] = useState({
    ...initialEvent,
    categoryIds: initialEvent.categoryIds || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prev) => ({
      ...prev,
      [name]:
        name === "categoryIds"
          ? value
              .split(",")
              .map((id) => Number(id.trim()))
              .filter(Boolean)
          : value,
    }));
  };

  if (!categories || !users || !initialEvent) {
    return <Text>Loading...</Text>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedEvent = {
      ...editedEvent,
      categoryIds: editedEvent.categoryIds.filter(Boolean),
    };

    if (!editedEvent.title || !editedEvent.description) {
      return toast.error("Title and description are required.");
    }

    if (new Date(editedEvent.startTime) >= new Date(editedEvent.endTime)) {
      return toast.error("Start time must be before end time.");
    }

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
    }
  };

  return (
    <Box
      padding="8"
      boxShadow="sm"
      borderRadius="lg"
      bg="white"
      width="80%"
      margin="auto"
    >
      <Toaster />
      <Text
        fontSize="3xl"
        fontWeight="bold"
        mb="6"
        textAlign="center"
        color="gray.900"
      >
        Event Details
      </Text>

      <Box mb="6" boxShadow="md" borderRadius="md">
        <Image
          src={initialEvent.image}
          alt={initialEvent.title}
          borderRadius="md"
          width="100%"
        />
      </Box>

      <VStack align="flex-start" spacing={6} mb="6">
        <Text fontSize="2xl" fontWeight="bold" color="gray.900">
          {initialEvent.title}
        </Text>
        <Text fontSize="lg" color="gray.700">
          {initialEvent.description}
        </Text>

        <SimpleGrid columns={2} spacing={6} w="full">
          <HStack spacing={4} align="center">
            <Avatar
              size="sm"
              src={
                users.find((user) => user.id === String(initialEvent.createdBy))
                  ?.image
              }
              name={
                users.find((user) => user.id === String(initialEvent.createdBy))
                  ?.name
              }
            />
            <Text fontSize="md" color="gray.600">
              Created by:{" "}
              <strong>
                {
                  users.find(
                    (user) => user.id === String(initialEvent.createdBy)
                  )?.name
                }
              </strong>
            </Text>
          </HStack>

          <VStack align="flex-start" spacing={2}>
            <Text fontSize="md" color="gray.600">
              Location: <strong>{initialEvent.location}</strong>
            </Text>
            <Text fontSize="sm" color="gray.500">
              Start Time:{" "}
              <strong>
                {new Date(initialEvent.startTime).toLocaleString()}
              </strong>
            </Text>
            <Text fontSize="sm" color="gray.500">
              End Time:{" "}
              <strong>{new Date(initialEvent.endTime).toLocaleString()}</strong>
            </Text>
          </VStack>
        </SimpleGrid>
      </VStack>

      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel>Event Title</FormLabel>
            <Input
              type="text"
              name="title"
              value={editedEvent.title}
              onChange={handleChange}
              placeholder="Event Title"
              borderRadius="md"
              boxShadow="sm"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Event Description</FormLabel>
            <Textarea
              name="description"
              value={editedEvent.description}
              onChange={handleChange}
              placeholder="Event Description"
              borderRadius="md"
              boxShadow="sm"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Start Time</FormLabel>
            <Input
              type="datetime-local"
              name="startTime"
              value={editedEvent.startTime}
              onChange={handleChange}
              borderRadius="md"
              boxShadow="sm"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>End Time</FormLabel>
            <Input
              type="datetime-local"
              name="endTime"
              value={editedEvent.endTime}
              onChange={handleChange}
              borderRadius="md"
              boxShadow="sm"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Event Image URL</FormLabel>
            <Input
              type="text"
              name="image"
              value={editedEvent.image}
              onChange={handleChange}
              placeholder="Image URL"
              borderRadius="md"
              boxShadow="sm"
            />
            {editedEvent.image && (
              <Image
                src={editedEvent.image}
                alt="Preview"
                boxSize="200px"
                mt="2"
              />
            )}
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Categories</FormLabel>
            <Select
              name="categoryIds"
              multiple
              value={editedEvent.categoryIds.map(String)} // Ensure correct value mapping
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
              borderRadius="md"
              boxShadow="sm"
            >
              {categories.map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            borderRadius="md"
            boxShadow="md"
          >
            Save Changes
          </Button>
        </VStack>
      </form>

      <Button
        onClick={handleDelete}
        colorScheme="red"
        width="full"
        mt="6"
        borderRadius="md"
        boxShadow="md"
      >
        Delete Event
      </Button>

      <Box mt="6">
        <BackButton>View More Events</BackButton>
      </Box>
    </Box>
  );
};

export default EventDetails;
