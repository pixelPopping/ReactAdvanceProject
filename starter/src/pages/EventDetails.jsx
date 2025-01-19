import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Checkbox,
  CheckboxGroup,
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
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import BackButton from "../components/ui/BackButton";
import DeleteToast from "../components/ui/DeleteToast"; // Import DeleteToast component

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
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the Edit Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for Delete Confirmation Modal
  const [deleteToastData, setDeleteToastData] = useState(null); // For triggering DeleteToast
  const [error, setError] = useState(null);

  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalCategoryIds, setModalCategoryIds] = useState([]);
  const [modalDateTime, setModalDateTime] = useState("");

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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  const handleEditModalSave = async () => {
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

      setIsModalOpen(false); // Close edit modal
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

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the event");
      }

      setDeleteToastData({
        status: "success",
        message: "Event deleted successfully!",
        description: "Your event has been successfully deleted.",
      });

      navigate("/"); // Redirect to the events page after deletion
    } catch (err) {
      setDeleteToastData({
        status: "error",
        message: "Error deleting event",
        description: err.message,
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
      <BackButton to="/events" />
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Event Title</FormLabel>
          <Text>{event.title}</Text>
        </FormControl>
        <FormControl>
          <img src={event.image}></img>
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
          onClick={() => {
            setIsModalOpen(true);
            setModalTitle(event.title);
            setModalDescription(event.description);
            setModalCategoryIds(event.categoryIds);
            setModalDateTime(event.dateTime);
          }}
          size="lg"
          mt={4}
          {...pacmanButtonStyle}
        >
          Edit Details
        </Button>
      </VStack>

      <Button
        onClick={() => setIsDeleteModalOpen(true)} // Open delete confirmation modal
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

      {/* Edit Event Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                value={modalTitle}
                onChange={(e) => setModalTitle(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={modalDescription}
                onChange={(e) => setModalDescription(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Date and Time</FormLabel>
              <Input
                type="datetime-local"
                value={modalDateTime}
                onChange={(e) => setModalDateTime(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Categories</FormLabel>
              <CheckboxGroup
                value={modalCategoryIds}
                onChange={setModalCategoryIds}
              >
                <HStack spacing={4}>
                  {categories.map((category) => (
                    <Checkbox key={category.id} value={category.id}>
                      {category.name}
                    </Checkbox>
                  ))}
                </HStack>
              </CheckboxGroup>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="yellow" onClick={handleEditModalSave}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you 100% sure you want to delete this event?</Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              No
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                handleDelete();
                setIsDeleteModalOpen(false);
              }}
            >
              Yes, Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Render DeleteToast if deleteToastData is set */}
      {deleteToastData && (
        <DeleteToast
          status={deleteToastData.status}
          message={deleteToastData.message}
          description={deleteToastData.description}
        />
      )}
    </Box>
  );
};

export default EventDetails;
