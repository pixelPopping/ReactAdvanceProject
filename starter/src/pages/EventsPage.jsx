import { useState } from "react";
import { useLoaderData, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { SearchFilter } from "../components/SearchFilter";
import { TextInput } from "../components/ui/TextInput";

export const loader = async () => {
  const eventsResponse = await fetch("http://localhost:3000/events");
  const categoriesResponse = await fetch("http://localhost:3000/categories");

  if (!eventsResponse.ok || !categoriesResponse.ok) {
    throw new Error("Failed to fetch events or categories");
  }

  const events = await eventsResponse.json();
  const categories = await categoriesResponse.json();

  return {
    events,
    categories,
  };
};

export const EventsPage = () => {
  const { events, categories } = useLoaderData();

  // States for search and category filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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

  return (
    <div className="event-list">
      {/* Search input */}
      <TextInput
        id="search-input"
        value={searchQuery}
        changeFn={handleSearchChange}
        placeholder="Search for events..."
      />

      {/* Category filter */}
      <SearchFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <h1>List of Events</h1>
      {filteredEvents.length === 0 ? (
        <p>No events available.</p>
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
            <div key={event.id} className="event">
              <Link to={`/event/${event.id}`}>
                <h2>{event.title}</h2>
              </Link>
              <p>{event.description}</p>
              <p>Start Time: {new Date(event.startTime).toLocaleString()}</p>
              <p>End Time: {new Date(event.endTime).toLocaleString()}</p>
              <img src={event.image} alt={event.title || "Event image"} />

              <div className="categories">
                <h3>Categories:</h3>
                {eventCategories.length > 0 ? (
                  <ul>
                    {eventCategories.map((category) => (
                      <li key={category.id}>{category.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No categories found for this event</p>
                )}
              </div>
            </div>
          );
        })
      )}

      <div className="action-button">
        <Button>View More Events</Button>
      </div>
    </div>
  );
};
