import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import {
  Box,
  Heading,
  Input,
  Textarea,
  Button,
  VStack,
  useToast,
  FormControl,
  FormLabel,
  HStack,
  Avatar,
  Spinner,
  Center,
  CheckboxGroup,
  Checkbox,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

const pacmanButtonStyle = {
  backgroundColor: "#FFEB3B",
  borderRadius: "30px",
  color: "#FFF",
  fontWeight: "bold",
  fontSize: { base: "16px", md: "18px" },
  padding: "12px 40px",
  transition: "all 0.3s ease",
  _hover: {
    backgroundColor: "#FFCA28",
    transform: "scale(1.05)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
};

const pacmanDeleteButtonStyle = {
  backgroundColor: "#F44336",
  borderRadius: "30px",
  color: "#FFF",
  fontWeight: "bold",
  fontSize: { base: "16px", md: "18px" },
  padding: "12px 40px",
  transition: "all 0.3s ease",
  _hover: {
    backgroundColor: "#E53935",
    transform: "scale(1.05)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
};

const pacmanInputStyle = {
  borderRadius: "20px",
  borderColor: "#FFEB3B",
  _hover: {
    borderColor: "#FFCA28",
  },
  focusBorderColor: "#FFCA28",
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

export const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [initialData, setInitialData] = useState(null);

  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalCategoryIds, setModalCategoryIds] = useState([]);
  const [modalDateTime, setModalDateTime] = useState("");

  const location = useLocation(); // Used for conditional rendering of the link

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

        const normalizedEvent = {
          ...eventData,
          categoryIds: eventData.categoryIds.map((id) => String(id)),
        };

        setEvent(normalizedEvent);
        setCategories(categoriesData);
        setUsers(usersData);
        setSelectedCategoryIds(normalizedEvent.categoryIds);
        setInitialData(normalizedEvent);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  useEffect(() => {
    if (isModalOpen && initialData) {
      setModalTitle(initialData.title);
      setModalDescription(initialData.description);
      setModalCategoryIds(initialData.categoryIds);
      setModalDateTime(initialData.dateTime);
    }
  }, [isModalOpen, initialData]);

  const handleCategoryChange = (selectedValues) => {
    setModalCategoryIds(selectedValues);
  };

  const handleModalSave = async () => {
    const updatedEvent = {
      ...event,
      title: modalTitle,
      description: modalDescription,
      categoryIds: modalCategoryIds.map(Number),
      dateTime: modalDateTime,
    };

    setEvent(updatedEvent);
    setSelectedCategoryIds(modalCategoryIds);

    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        throw new Error("Failed to update the event");
      }

      toast({
        title: "Event updated successfully!",
        description: "Your event has been updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setIsModalOpen(false); // Close the modal after saving
    } catch (err) {
      toast({
        title: "Error updating event.",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the event");
      }

      toast({
        title: "Event deleted successfully!",
        description: "Your event has been deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/"); // Redirect to the events page after deletion
    } catch (err) {
      toast({
        title: "Error deleting event.",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const createdByUser = users.find(
    (user) => user.id === String(event?.createdBy)
  );

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
        <Text mt={4}>Loading event details...</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={6}>
        <Text color="red.500">{`Error: ${error}`}</Text>
      </Box>
    );
  }

  return (
    <Box
      maxW="600px"
      mx="auto"
      p={5}
      fontFamily="'Press Start 2P', cursive"
      border="1px solid #FFEB3B"
      borderRadius="md"
    >
      <Heading as="h1" size="lg" mb={6} color="#FFEB3B" textAlign="center">
        Event Details
      </Heading>

      {/* Conditional rendering for the link */}
      <Link to="/events">
        <Button variant="link" color="#FFEB3B" fontSize="xl" mt={6}>
          Back to Events Page
        </Button>
      </Link>

      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Event Title</FormLabel>
          <Text>{event.title}</Text>
        </FormControl>

        <FormControl>
          <FormLabel>Event Description</FormLabel>
          <Text>{event.description}</Text>
        </FormControl>

        <FormControl>
          <FormLabel>Date and Time</FormLabel>
          <Text>{event.dateTime}</Text>
        </FormControl>

        <FormControl>
          <FormLabel>Categories</FormLabel>
          <Text>
            {categories
              .filter((category) => event.categoryIds.includes(category.id))
              .map((category) => category.name)
              .join(", ")}
          </Text>
        </FormControl>

        <Button
          onClick={() => setIsModalOpen(true)}
          size="lg"
          mt={4}
          {...pacmanButtonStyle}
        >
          Edit Details
        </Button>
      </VStack>

      <Button
        onClick={handleDelete}
        size="lg"
        mt={4}
        {...pacmanDeleteButtonStyle}
      >
        Delete Event
      </Button>

      {createdByUser && (
        <HStack spacing={4} align="center" mt={6}>
          <Avatar size="lg" src={createdByUser.image} />
          <Box>
            <Text fontWeight="bold" fontSize="lg" color="#FFEB3B">
              Created by: {createdByUser.name}
            </Text>
          </Box>
        </HStack>
      )}

      {/* Modal for editing */}
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={(e) => e.preventDefault()}>
              <FormControl isRequired>
                <FormLabel>Event Title</FormLabel>
                <Input
                  value={modalTitle || ""}
                  onChange={(e) => setModalTitle(e.target.value)}
                  {...pacmanInputStyle}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Event Description</FormLabel>
                <Textarea
                  value={modalDescription || ""}
                  onChange={(e) => setModalDescription(e.target.value)}
                  {...pacmanInputStyle}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Categories</FormLabel>
                <CheckboxGroup
                  value={modalCategoryIds || []}
                  onChange={handleCategoryChange}
                >
                  <VStack align="start">
                    {categories.map((category) => (
                      <Checkbox
                        key={category.id}
                        value={String(category.id)}
                        colorScheme="yellow"
                      >
                        {category.name}
                      </Checkbox>
                    ))}
                  </VStack>
                </CheckboxGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Date and Time</FormLabel>
                <Input
                  type="datetime-local"
                  value={modalDateTime || ""}
                  onChange={(e) => setModalDateTime(e.target.value)}
                  {...pacmanInputStyle}
                />
              </FormControl>

              <ModalFooter>
                <Button onClick={handleModalSave} {...pacmanButtonStyle}>
                  Save Changes
                </Button>
                <Button onClick={handleModalClose} ml={3}>
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EventDetails;
