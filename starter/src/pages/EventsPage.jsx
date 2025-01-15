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
              <Box
                key={event.id}
                bg="gray.900"
                border="2px solid"
                borderColor="yellow.400"
                padding={8}
                borderRadius="md"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                maxWidth="400px"
                mx="auto"
                _hover={{
                  transform: "scale(1.05)",
                  transition: "0.3s ease-in-out",
                  bg: "yellow.500",
                  boxShadow: "0 0 15px rgba(255, 204, 0, 0.8)",
                }}
              >
                {/* Link to Event Details */}
                <Link to={`/event/${event.id}`}>
                  {/* Event Image */}
                  <Box
                    width="100%"
                    height="200px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mb={4}
                    overflow="hidden"
                    borderRadius="md"
                  >
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Text color="gray.300">No Image Available</Text>
                    )}
                  </Box>

                  <Heading as="h2" size="sm" color="white" noOfLines={2}>
                    {event.title}
                  </Heading>
                </Link>
                <Text mt={2} fontSize="sm" color="gray.300" noOfLines={3}>
                  {event.description}
                </Text>

                {/* Event Categories */}
                <Box mt={4} textAlign="center">
                  <Heading as="h3" size="xs" color="yellow.300">
                    Categories:
                  </Heading>
                  <Flex flexWrap="wrap" mt={2} justify="center">
                    {eventCategories.map((category) => (
                      <Box
                        key={category.id}
                        bg="yellow.400"
                        borderRadius="full"
                        px={3}
                        py={1}
                        m={1}
                        fontSize="xs"
                        color="black"
                      >
                        {category.name}
                      </Box>
                    ))}
                  </Flex>
                </Box>
              </Box>
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

      {/* Modal to Add New Event */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleAddEventSubmit}>
              <FormControl id="title" mb={4} isRequired>
                <FormLabel>Event Title</FormLabel>
                <Input
                  type="text"
                  name="title"
                  value={newEventData.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                />
              </FormControl>
              <FormControl id="description" mb={4} isRequired>
                <FormLabel>Event Description</FormLabel>
                <Input
                  type="text"
                  name="description"
                  value={newEventData.description}
                  onChange={handleInputChange}
                  placeholder="Enter event description"
                />
              </FormControl>
              <FormControl id="date" mb={4} isRequired>
                <FormLabel>Event Date</FormLabel>
                <Input
                  type="date"
                  name="date"
                  value={newEventData.date}
                  onChange={handleInputChange}
                  placeholder="Select event date"
                />
              </FormControl>
              <FormControl id="time" mb={4} isRequired>
                <FormLabel>Event Time</FormLabel>
                <Input
                  type="time"
                  name="time"
                  value={newEventData.time}
                  onChange={handleInputChange}
                  placeholder="Select event time"
                />
              </FormControl>
              <FormControl id="categories" mb={4} isRequired>
                <FormLabel>Select Categories</FormLabel>
                <Select
                  name="categoryIds"
                  multiple
                  value={newEventData.categoryIds}
                  onChange={handleCategorySelect}
                  placeholder="Select categories"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <ModalFooter>
                <ChakraButton
                  variant="outline"
                  mr={3}
                  onClick={handleCloseModal}
                >
                  Cancel
                </ChakraButton>
                <ChakraButton colorScheme="yellow" type="submit">
                  Add Event
                </ChakraButton>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EventsPage;
