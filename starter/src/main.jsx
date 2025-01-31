import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { EventsPage } from "./pages/EventsPage";
import { Root } from "./components/Root";
import { FormPage } from "./pages/FormPage";
import EventDetails, {
  loader as eventDetailsLoader,
} from "./pages/EventDetails";
import { loader as eventsPageLoader } from "./pages/EventsPage";
import ErrorPage from "./pages/ErrorPage"; // Custom error component
import { ChakraProvider } from "@chakra-ui/react";
import { EventsProvider } from "./components/EventContext";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />, // Error fallback for the root
    children: [
      {
        path: "/",
        element: <EventsPage />,
        loader: eventsPageLoader,
        errorElement: <ErrorPage />, // Error fallback for this route
      },
      {
        path: "/event/:eventId",
        element: <EventDetails />,
        loader: eventDetailsLoader,
        errorElement: <ErrorPage />, // Error fallback for event details
      },
      {
        path: "/formPage",
        element: <FormPage />,
        errorElement: <ErrorPage />, // Error fallback for form page
      },
    ],
  },
]);

// Render the app
ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    <EventsProvider>
      {/* Remove StrictMode for development to avoid double-rendering issues */}
      <RouterProvider router={router} />
      {/* ToastContainer is now added globally */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />
    </EventsProvider>
  </ChakraProvider>
);
