import React, { useState, useEffect, useCallback } from "react";
import { useLoaderData, useLocation, Link } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Flex,
  useToast,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button as ChakraButton,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { TextInput } from "../components/ui/TextInput";
import Button from "../components/ui/Button";
import EventCard from "../components/EventCard";

// Loader for initial data fetching
export const loader = async () => {
  const eventsResponse = await fetch("http://localhost:3000/events");
  const categoriesResponse = await fetch("http://localhost:3000/categories");

  if (!eventsResponse.ok || !categoriesResponse.ok) {
    throw new Error("Failed to fetch events or categories");
  }

  const events = await eventsResponse.json();
  const categories = await categoriesResponse.json();

  return { events, categories };
};

export const EventsPage = () => {
  const { events: initialEvents, categories: initialCategories } =
    useLoaderData();
  const location = useLocation();
  const toast = useToast();

  const [events, setEvents] = useState(initialEvents);
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: "",
    description: "",
    image: "",
    categoryIds: [],
    date: "",
    time: "",
  });

  // Function to fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const eventsResponse = await fetch("http://localhost:3000/events");
      const categoriesResponse = await fetch(
        "http://localhost:3000/categories"
      );

      if (!eventsResponse.ok || !categoriesResponse.ok) {
        throw new Error("Failed to fetch events or categories");
      }

      const eventsData = await eventsResponse.json();
      const categoriesData = await categoriesResponse.json();

      setEvents(eventsData);
      setCategories(categoriesData);

      toast({
        title: "Data Loaded!",
        description: "Events and categories have been successfully loaded.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load events or categories.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on location change
  useEffect(() => {
    fetchData();
  }, [location]);

  // Memoized function to handle search query change
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setSelectedCategory(e.target.value);
  }, []);

  // Filtered events based on search query and selected category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      (Array.isArray(event.categoryIds) &&
        event.categoryIds.includes(Number(selectedCategory)));

    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategorySelect = (e) => {
    const selectedCategoryIds = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value)
    );
    setNewEventData((prevData) => ({
      ...prevData,
      categoryIds: selectedCategoryIds,
    }));
  };

  const handleAddEventSubmit = async (e) => {
    e.preventDefault();

    // Check if required fields are filled before submitting
    if (
      !newEventData.title ||
      !newEventData.description ||
      !newEventData.date ||
      !newEventData.time
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEventData),
      });

      if (!response.ok) {
        throw new Error("Failed to add event");
      }

      const addedEvent = await response.json();
      setEvents((prevEvents) => [...prevEvents, addedEvent]);
      toast({
        title: "Event Added!",
        description: "New event has been successfully added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setNewEventData({
        title: "",
        description: "",
        image: "",
        categoryIds: [],
        date: "",
        time: "",
      });
      handleCloseModal();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add event.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="black" color="white" minHeight="100vh" padding={5}>
      <Heading as="h1" size="xl" mb={6} textAlign="center" color="yellow.400">
        Pac-Man Style Events
      </Heading>

      <Flex direction="column" align="stretch" mb={6}>
        {/* Search Input */}
        <TextInput
          value={searchQuery}
          changeFn={handleSearchChange}
          placeholder="Search for events..."
          bg="black"
          borderColor="white"
          focusBorderColor="yellow.400"
          color="white"
        />

        {/* Categories Dropdown */}
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          bg="black"
          borderColor="white"
          focusBorderColor="yellow.400"
          color="white"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </Flex>

      {/* Display Loading Spinner while fetching data */}
      {loading ? (
        <Flex justify="center" align="center" height="50vh">
          <Spinner size="xl" color="yellow.400" />
        </Flex>
      ) : filteredEvents.length === 0 ? (
        <Text textAlign="center" color="white">
          No events found. Try adjusting your search or category filter.
        </Text>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
          gap={6}
        >
          {filteredEvents.map((event) => {
            const categoryIds = Array.isArray(event.categoryIds)
              ? event.categoryIds
              : [];
            const eventCategories = categoryIds
              .map((categoryId) => {
                const category = categories.find(
                  (cat) => Number(cat.id) === categoryId
                );
                return category;
              })
              .filter(Boolean);

            return (
              <EventCard
                key={event.id}
                event={event}
                categories={eventCategories}
              />
            );
          })}
        </Box>
      )}

      {/* Button to Open Modal */}
      <Flex justify="center" mt={6}>
        <ChakraButton
          colorScheme="yellow"
          size="lg"
          onClick={handleOpenModal}
          _hover={{
            bg: "yellow.600",
            color: "black",
          }}
        >
          Add Event
        </ChakraButton>
      </Flex>

      {/* Modal to Add Event */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Event Title</FormLabel>
              <Input
                name="title"
                value={newEventData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                mb={4}
                bg="gray.700"
                color="white"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Event Description</FormLabel>
              <Input
                name="description"
                value={newEventData.description}
                onChange={handleInputChange}
                placeholder="Enter event description"
                mb={4}
                bg="gray.700"
                color="white"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Event Image URL</FormLabel>
              <Input
                name="image"
                value={newEventData.image}
                onChange={handleInputChange}
                placeholder="Enter event image URL"
                mb={4}
                bg="gray.700"
                color="white"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Event Categories</FormLabel>
              <Select
                value={newEventData.categoryIds}
                onChange={handleCategorySelect}
                multiple
                mb={4}
                bg="gray.700"
                color="white"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Event Date</FormLabel>
              <Input
                name="date"
                type="date"
                value={newEventData.date}
                onChange={handleInputChange}
                mb={4}
                bg="gray.700"
                color="white"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Event Time</FormLabel>
              <Input
                name="time"
                type="time"
                value={newEventData.time}
                onChange={handleInputChange}
                mb={4}
                bg="gray.700"
                color="white"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <ChakraButton
              colorScheme="yellow"
              onClick={handleAddEventSubmit}
              isLoading={loading}
            >
              Add Event
            </ChakraButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
