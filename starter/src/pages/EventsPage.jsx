import { useState, useEffect } from "react";
import { useLoaderData, Link } from "react-router-dom";
import { Box, Heading, Text, Flex, VStack, Spinner } from "@chakra-ui/react";
import { SearchFilter } from "../components/SearchFilter";
import { TextInput } from "../components/ui/TextInput";
import Button from "../components/ui/Button";

// Loader for fetching data
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
  const { events, categories } = useLoaderData();

  // States for search and category filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Updates the search query state
  };

  // Handle category filter change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value); // Updates the category filter state
  };

  // Filter events based on search query and selected category
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

  // Use effect to simulate loading state during filtering
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500); // Simulate a delay when filtering

    return () => clearTimeout(timer); // Cleanup on component unmount or when the search/filtering changes
  }, [searchQuery, selectedCategory]);

  return (
    <Box padding={5}>
      {/* Search input */}
      <VStack spacing={4} align="stretch" mb={6}>
        <TextInput
          value={searchQuery}
          changeFn={handleSearchChange}
          placeholder="Search for events..."
        />
        <SearchFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </VStack>

      {/* Heading */}
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        List of Events
      </Heading>

      {loading ? (
        <Flex justify="center" align="center" height="50vh">
          <Spinner size="xl" />
        </Flex>
      ) : filteredEvents.length === 0 ? (
        <Text textAlign="center">
          No events found. Try adjusting your search or category filter.
        </Text>
      ) : (
        filteredEvents.map((event) => {
          const categoryIds = Array.isArray(event.categoryIds)
            ? event.categoryIds
            : [];

          // Match categoryIds with categories
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
              bg="white"
              boxShadow="lg"
              borderRadius="md"
              p={5}
              mb={6}
              _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
            >
              <Link to={`/event/${event.id}`}>
                <Heading as="h2" size="md" color="blue.600">
                  {event.title}
                </Heading>
              </Link>
              <Text mt={2} color="gray.700">
                {event.description}
              </Text>
              <Text mt={2} fontSize="sm" color="gray.500">
                Start Time: {new Date(event.startTime).toLocaleString()}
              </Text>
              <Text mt={2} fontSize="sm" color="gray.500">
                End Time: {new Date(event.endTime).toLocaleString()}
              </Text>
              <Box mt={4}>
                <img src={event.image} alt={event.title} width="100%" />
              </Box>
              <Box mt={4}>
                <Heading as="h3" size="sm">
                  Categories:
                </Heading>
                {eventCategories.length > 0 ? (
                  <Flex flexWrap="wrap" mt={2}>
                    {eventCategories.map((category) => (
                      <Box
                        key={category.id}
                        bg="blue.100"
                        borderRadius="md"
                        px={3}
                        py={1}
                        m={1}
                        color="blue.600"
                      >
                        {category.name}
                      </Box>
                    ))}
                  </Flex>
                ) : (
                  <Text>No categories found for this event</Text>
                )}
              </Box>
            </Box>
          );
        })
      )}

      <Flex justify="center" mt={6}>
        <Link to="/events">
          <Button colorScheme="blue" size="lg">
            View More Events
          </Button>
        </Link>
      </Flex>
    </Box>
  );
};
