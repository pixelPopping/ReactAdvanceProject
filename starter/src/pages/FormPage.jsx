import React from "react";
import { Box, Heading, Text, Image } from "@chakra-ui/react";

// Placeholder for fetching data (users, events, and categories)
const users = []; // Your array of users will go here
const events = []; // Your array of events will go here
const categories = []; // Your array of categories will go here

// Simulate the logged-in user (you can replace this logic with your actual login logic)
const loggedInUserId = ""; // Replace with actual logged-in user ID

export const FormPage = () => {
  // Find the event you want to display (you can fetch a specific event from the events array)
  const event = events[0]; // Replace this with logic to fetch the specific event

  // Find the user who created the event
  const createdByUser = users.find(
    (user) => user.id === String(event.createdBy)
  ); // Convert createdBy to string for comparison

  // Get category names based on categoryIds
  const eventCategories = event.categoryIds.map((id) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : "Unknown category";
  });

  // Check if the logged-in user is the creator of the event
  const isCreator = loggedInUserId === String(event.createdBy); // Ensure both sides are strings

  // Find the logged-in user details
  const loggedInUser = users.find((user) => user.id === loggedInUserId);

  return (
    <Box p={5}>
      <Heading as="h2">{event.title}</Heading>
      <Text fontSize="md" mt={2}>
        {event.description}
      </Text>

      <Box mt={4}>
        <Text fontWeight="bold">Created by:</Text>
        <Box display="flex" alignItems="center">
          {/* If the logged-in user is the creator, display their info */}
          <Image
            src={isCreator ? loggedInUser?.image : createdByUser?.image}
            alt={isCreator ? loggedInUser?.name : createdByUser?.name}
            boxSize="40px"
            borderRadius="full"
            mr={2}
          />
          <Text>{isCreator ? loggedInUser?.name : createdByUser?.name}</Text>
        </Box>
      </Box>

      <Box mt={4}>
        <Text fontWeight="bold">Categories:</Text>
        <Text>{eventCategories.join(", ")}</Text>
      </Box>

      <Box mt={4}>
        <Text fontWeight="bold">Location:</Text>
        <Text>{event.location}</Text>
      </Box>

      <Box mt={4}>
        <Text fontWeight="bold">Event Time:</Text>
        <Text>
          {new Date(event.startTime).toLocaleString()} to{" "}
          {new Date(event.endTime).toLocaleString()}
        </Text>
      </Box>

      {event.image && (
        <Box mt={4}>
          <Image src={event.image} alt={event.title} maxWidth="100%" />
        </Box>
      )}
    </Box>
  );
};

export default FormPage;
