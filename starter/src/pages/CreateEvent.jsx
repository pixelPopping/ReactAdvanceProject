import { useState, useEffect } from "react";
import {
  Box,
  Button,
  VStack,
  Heading,
  useToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import FormPage from "./FormPage";
import EventDetails from "./EventDetails";

const CreateEvent = () => {
  const [events, setEvents] = useState([]);
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

  // Function to create a new event
  const createEvent = async (newEvent) => {
    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        body: JSON.stringify(newEvent),
        headers: { "Content-Type": "application/json;charset=utf-8" },
      });
      const createdEvent = await response.json();
      setEvents((prevEvents) => [...prevEvents, createdEvent]);

      toast({
        title: "Event Created",
        description: "Your event has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error creating event:", error);

      toast({
        title: "Error",
        description: "There was an error creating the event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Adjust styles for responsive design
  const boxWidth = useBreakpointValue({
    base: "90%",
    sm: "80%",
    md: "70%",
    lg: "60%",
  });
  const headingFontSize = useBreakpointValue({
    base: "2xl",
    sm: "3xl",
    md: "4xl",
  });
  const buttonFontSize = useBreakpointValue({ base: "md", sm: "lg", md: "xl" });

  return (
    <Box
      p={5}
      bg="yellow.400"
      borderRadius="lg"
      maxW={boxWidth}
      mx="auto"
      boxShadow="xl"
      textAlign="center"
    >
      <Heading
        mb={5}
        size="lg"
        color="black"
        fontFamily="Pacifico, sans-serif"
        fontSize={headingFontSize}
        letterSpacing="wide"
      >
        Create a New Event (Pac-Man Style!)
      </Heading>

      <FormPage createEvent={createEvent} />

      <Heading
        size="md"
        mt={10}
        color="yellow.600"
        fontFamily="Pacifico, sans-serif"
      >
        Events List
      </Heading>

      <VStack mt={4} spacing={4} align="stretch">
        {events.map((event) => (
          <Button
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            variant="solid"
            colorScheme="yellow"
            borderRadius="full"
            width="full"
            fontWeight="bold"
            boxShadow="lg"
            fontSize={buttonFontSize}
            py={{ base: 3, sm: 4 }} // Padding adjustment for responsiveness
            _hover={{
              bg: "yellow.500",
              transform: "scale(1.1)",
              transition: "transform 0.3s ease",
            }}
            _active={{
              transform: "scale(0.95)",
              transition: "transform 0.1s ease",
            }}
          >
            {event.title}
          </Button>
        ))}
      </VStack>

      {selectedEvent && <EventDetails event={selectedEvent} />}
    </Box>
  );
};

export default CreateEvent;
