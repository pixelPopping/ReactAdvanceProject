import React from "react";
import { Box, Heading, Text, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const EventCard = ({ event, categories }) => {
  const formatTime = (time) => {
    if (!time) return "";
    const date = new Date(time);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <Box
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
      <Link to={`/event/${event.id}`}>
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
                objectFit: "cover", // Ensures the image covers the area without distortion
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

      {/* Display Start Time, End Time, and Location */}
      <Box mt={4} textAlign="center">
        {event.startTime && (
          <Text fontSize="sm" color="white">
            Start Time: {formatTime(event.startTime)}
          </Text>
        )}
        {event.endTime && (
          <Text fontSize="sm" color="white" mt={1}>
            End Time: {formatTime(event.endTime)}
          </Text>
        )}
        {event.location && (
          <Text fontSize="sm" color="white" mt={1}>
            Location: {event.location}
          </Text>
        )}
      </Box>

      {/* Display Categories */}
      <Box mt={4} textAlign="center">
        <Heading as="h3" size="xs" color="yellow.300">
          Categories:
        </Heading>
        <Flex flexWrap="wrap" mt={2} justify="center">
          {categories.map((category) => (
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
};

export default EventCard;
