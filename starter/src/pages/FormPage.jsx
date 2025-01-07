import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  useToast,
} from "@chakra-ui/react";
import EventDetails from "./EventDetails";

export const FormPage = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    image: "",
    categoryIds: "",
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const toast = useToast();

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/events");
        const events = await response.json();
        setEvents(events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  // Handle form submission to create a new event
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert categoryIds string to an array of numbers
    const categoryIdsArray = newEvent.categoryIds
      .split(",")
      .map((id) => Number(id.trim()));

    const eventToCreate = {
      ...newEvent,
      categoryIds: categoryIdsArray,
    };

    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        body: JSON.stringify(eventToCreate),
        headers: { "Content-Type": "application/json;charset=utf-8" },
      });
      const createdEvent = await response.json();
      setEvents((prevEvents) => [...prevEvents, createdEvent]);

      // Show success toast
      toast({
        title: "Event Created",
        description: "Your event has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form after submission
      setNewEvent({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        image: "",
        categoryIds: "",
      });

      // Clear selected event
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error creating event:", error);

      // Show error toast
      toast({
        title: "Error",
        description: "There was an error creating the event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle event update
  const handleEventUpdate = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
    );
    setSelectedEvent(updatedEvent); // Update selected event after modification
  };

  return (
    <Box p={5}>
      <Heading mb={5} size="lg" textAlign="center">
        Create a New Event
      </Heading>

      <Box
        maxW="lg"
        mx="auto"
        p={5}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="md"
      >
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl id="title" isRequired>
              <FormLabel>Event Title</FormLabel>
              <Input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleChange}
                placeholder="Enter event title"
              />
            </FormControl>

            <FormControl id="description" isRequired>
              <FormLabel>Event Description</FormLabel>
              <Textarea
                name="description"
                value={newEvent.description}
                onChange={handleChange}
                placeholder="Enter event description"
                size="md"
              />
            </FormControl>

            <FormControl id="startTime" isRequired>
              <FormLabel>Start Time</FormLabel>
              <Input
                type="datetime-local"
                name="startTime"
                value={newEvent.startTime}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="endTime" isRequired>
              <FormLabel>End Time</FormLabel>
              <Input
                type="datetime-local"
                name="endTime"
                value={newEvent.endTime}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="image" isRequired>
              <FormLabel>Image URL</FormLabel>
              <Input
                type="text"
                name="image"
                value={newEvent.image}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
            </FormControl>

            <FormControl id="categoryIds" isRequired>
              <FormLabel>Category IDs (comma separated)</FormLabel>
              <Input
                type="text"
                name="categoryIds"
                value={newEvent.categoryIds}
                onChange={handleChange}
                placeholder="Enter category IDs"
              />
            </FormControl>

            <Button type="submit" colorScheme="blue" width="full">
              Create Event
            </Button>
          </VStack>
        </form>
      </Box>

      <Heading size="md" mt={10}>
        Events List
      </Heading>

      <VStack mt={4} spacing={4} align="stretch">
        {events.map((event) => (
          <Button
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            variant="outline"
            width="full"
          >
            {event.title}
          </Button>
        ))}
      </VStack>

      {/* Render EventDetails if selectedEvent is not null */}
      {selectedEvent && (
        <EventDetails event={selectedEvent} onUpdateEvent={handleEventUpdate} />
      )}
    </Box>
  );
};

export default FormPage;
