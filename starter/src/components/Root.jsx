import React from "react";
import { Outlet } from "react-router-dom";
import { Navigation } from "./NavBar/NavBar";
import { Box } from "@chakra-ui/react";

export const Root = () => {
  return (
    <Box>
      <Navigation />
      <Outlet />
    </Box>
  );
};
