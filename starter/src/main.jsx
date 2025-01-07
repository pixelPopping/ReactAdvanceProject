import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { EventsPage } from "./pages/EventsPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./components/Root";
import { FormPage } from "./pages/FormPage";
import { loader } from "./pages/EventsPage";

import EventDetails, {
  loader as eventDetailsLoader,
} from "./pages/EventDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <EventsPage />,
        loader: loader,
      },
      {
        path: "/event/:eventId",
        element: <EventDetails />,
        loader: eventDetailsLoader,

        // action: addComment,
      },
      {
        path: "/FormPage",
        element: <FormPage />,
      },
    ],
  },
]);
// @ts-ignore
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
