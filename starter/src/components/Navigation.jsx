import React from "react";
import { NavLink } from "react-router-dom";
import { Box, HStack, Text, useBreakpointValue } from "@chakra-ui/react";

export const Navigation = () => {
  return (
    <Box as="nav" p={4} bg="white" boxShadow="md" borderRadius="md">
      <HStack spacing={8} justify="center" align="center">
        <NavLink to="/" exact>
          {({ isActive }) => (
            <Text
              as="span"
              fontSize={useBreakpointValue({ base: "md", md: "lg" })}
              fontWeight="bold"
              color={isActive ? "yellow.500" : "gray.700"}
              _hover={{ color: "yellow.400" }}
              transition="color 0.3s ease"
              _active={{ color: "yellow.600" }}
            >
              Events
            </Text>
          )}
        </NavLink>

        <NavLink to="/event/1">
          {({ isActive }) => (
            <Text
              as="span"
              fontSize={useBreakpointValue({ base: "md", md: "lg" })}
              fontWeight="bold"
              color={isActive ? "yellow.500" : "gray.700"}
              _hover={{ color: "yellow.400" }}
              transition="color 0.3s ease"
              _active={{ color: "yellow.600" }}
            >
              Event
            </Text>
          )}
        </NavLink>
      </HStack>
    </Box>
  );
};
