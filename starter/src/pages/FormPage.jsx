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
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";

export const FormPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    image: "",
    categoryIds: [],
    createdBy: 3, // Assuming logged-in user ID is 3
  });
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories");
        const categoriesData = await response.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  // Handle category checkbox change
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    const categoryId = Number(value);

    setNewEvent((prevEvent) => {
      let updatedCategoryIds = [...prevEvent.categoryIds];

      if (checked) {
        updatedCategoryIds.push(categoryId);
      } else {
        updatedCategoryIds = updatedCategoryIds.filter(
          (id) => id !== categoryId
        );
      }

      return { ...prevEvent, categoryIds: updatedCategoryIds };
    });
  };

  // Show success toast
  const showSuccessToast = () => {
    toast({
      position: "top",
      render: () => (
        <Box
          bg="yellow.400"
          color="black"
          p={4}
          borderRadius="md"
          boxShadow="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
          animation="slideInDown 1s ease-out"
        >
          <img
            src="https://media.giphy.com/media/l3vR1t6I4vbe9tO7q/giphy.gif"
            alt="Pacman"
            width={40}
            height={40}
            style={{ marginRight: "15px" }}
          />
          <span style={{ fontWeight: "bold", fontSize: "18px" }}>
            Event Created Successfully!
          </span>
        </Box>
      ),
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle form submission to create a new event
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate start and end time
    const start = new Date(newEvent.startTime);
    const end = new Date(newEvent.endTime);

    if (start >= end) {
      toast({
        title: "Invalid Time",
        description: "Start time must be earlier than end time.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const eventToCreate = {
      ...newEvent,
      categoryIds: newEvent.categoryIds,
    };

    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        body: JSON.stringify(eventToCreate),
        headers: { "Content-Type": "application/json;charset=utf-8" },
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      const createdEvent = await response.json();
      setEvents((prevEvents) => [...prevEvents, createdEvent]);

      showSuccessToast();

      // Reset form after submission
      setNewEvent({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        image: "",
        categoryIds: [],
        createdBy: 3,
      });

      // Close the modal
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating the event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      p={5}
      bg="yellow.300"
      borderRadius="xl"
      maxW="lg"
      mx="auto"
      boxShadow="xl"
      minH="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Heading
        mb={5}
        size="lg"
        textAlign="center"
        color="yellow.700"
        fontFamily="Pacifico, sans-serif"
      >
        Create a New Event
      </Heading>

      <Button colorScheme="yellow" onClick={onOpen}>
        Open Event Form
      </Button>

      {/* Modal to create event */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                {/* Event Title */}
                <FormControl id="title" isRequired>
                  <FormLabel color="yellow.800" fontWeight="bold">
                    Event Title
                  </FormLabel>
                  <Input
                    type="text"
                    name="title"
                    value={newEvent.title}
                    onChange={handleChange}
                    placeholder="Enter event title"
                    borderColor="yellow.400"
                    _hover={{ borderColor: "yellow.500" }}
                    bg="yellow.100"
                    fontWeight="bold"
                    borderRadius="xl"
                    fontSize="lg"
                  />
                </FormControl>

                {/* Event Description */}
                <FormControl id="description" isRequired>
                  <FormLabel color="yellow.800" fontWeight="bold">
                    Event Description
                  </FormLabel>
                  <Textarea
                    name="description"
                    value={newEvent.description}
                    onChange={handleChange}
                    placeholder="Enter event description"
                    size="md"
                    borderColor="yellow.400"
                    _hover={{ borderColor: "yellow.500" }}
                    bg="yellow.100"
                    fontWeight="bold"
                    borderRadius="xl"
                    fontSize="lg"
                  />
                </FormControl>

                {/* Event Start Time */}
                <FormControl id="startTime" isRequired>
                  <FormLabel color="yellow.800" fontWeight="bold">
                    Start Time
                  </FormLabel>
                  <Input
                    type="datetime-local"
                    name="startTime"
                    value={newEvent.startTime}
                    onChange={handleChange}
                    borderColor="yellow.400"
                    _hover={{ borderColor: "yellow.500" }}
                    bg="yellow.100"
                    fontWeight="bold"
                    borderRadius="xl"
                    fontSize="lg"
                  />
                </FormControl>

                {/* Event End Time */}
                <FormControl id="endTime" isRequired>
                  <FormLabel color="yellow.800" fontWeight="bold">
                    End Time
                  </FormLabel>
                  <Input
                    type="datetime-local"
                    name="endTime"
                    value={newEvent.endTime}
                    onChange={handleChange}
                    borderColor="yellow.400"
                    _hover={{ borderColor: "yellow.500" }}
                    bg="yellow.100"
                    fontWeight="bold"
                    borderRadius="xl"
                    fontSize="lg"
                  />
                </FormControl>

                {/* Category Checkboxes */}
                <FormControl id="categoryIds" isRequired>
                  <FormLabel color="yellow.800" fontWeight="bold">
                    Select Categories
                  </FormLabel>
                  <VStack align="start">
                    {categories.map((category) => (
                      <Checkbox
                        key={category.id}
                        value={category.id}
                        isChecked={newEvent.categoryIds.includes(category.id)}
                        onChange={handleCategoryChange}
                        colorScheme="yellow"
                      >
                        {category.name}
                      </Checkbox>
                    ))}
                  </VStack>
                </FormControl>

                <ModalFooter>
                  <Button colorScheme="yellow" type="submit">
                    Create Event
                  </Button>
                </ModalFooter>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Heading
        size="md"
        mt={10}
        color="yellow.700"
        fontFamily="Pacifico, sans-serif"
      >
        Events List
      </Heading>

      <VStack mt={4} spacing={4} align="stretch">
        {events.map((event) => (
          <Button
            key={event.id}
            variant="outline"
            colorScheme="yellow"
            width="full"
            fontWeight="bold"
            boxShadow="md"
            borderRadius="xl"
            _hover={{
              bg: "yellow.400",
              color: "white",
            }}
          >
            {event.title}
          </Button>
        ))}
      </VStack>
    </Box>
  );
};

export default FormPage;
