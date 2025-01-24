import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // React Router for routing
import { EventsPage } from "./pages/EventsPage"; // Events page component
import { Root } from "./components/Root"; // Root component (common layout or structure)
import { FormPage } from "./pages/FormPage"; // Form page component for adding/editing events
import EventDetails, {
  loader as eventDetailsLoader,
} from "./pages/EventDetails"; // Event details page with loader for specific event
import { loader as eventsPageLoader } from "./pages/EventsPage"; // Loader for events data
import { ChakraProvider } from "@chakra-ui/react"; // Corrected ChakraProvider import

// Create the router with routes
const router = createBrowserRouter([
  {
    path: "/", // Root path
    element: <Root />, // Root component for common layout or navigation
    children: [
      {
        path: "/", // Default path for events page
        element: <EventsPage />, // Events page component
        loader: eventsPageLoader, // Load events data for the EventsPage
      },
      {
        path: "/event/:eventId", // Dynamic route for event details
        element: <EventDetails />, // Event details component
        loader: eventDetailsLoader, // Loader for fetching specific event details
      },
      {
        path: "/FormPage", // Path for the form to add or edit events
        element: <FormPage />, // FormPage component
      },
    ],
    errorElement: (
      <div>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
      </div>
    ), // Error message for unhandled routes
  },
]);

// Render the app to the root element
ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    {/* Wrap the app with ChakraProvider for styling and components */}
    <React.StrictMode>
      <RouterProvider router={router} />{" "}
      {/* Provide the router configuration to the app */}
    </React.StrictMode>
  </ChakraProvider>
);
