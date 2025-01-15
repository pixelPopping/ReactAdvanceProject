import React from "react";
import { Button as ChakraButton } from "@chakra-ui/react"; // Import Chakra's Button

export const Button = () => {
  return (
    <div>
      <ChakraButton
        colorScheme="yellow" // Pac-Man theme color
        variant="solid" // Solid color for the button
        size="lg" // Larger button size for emphasis
        onClick={() => (window.location.href = "/FormPage/")}
        borderRadius="full" // Rounded corners to match the Pac-Man aesthetic
        boxShadow="lg" // Adds a shadow for a "popping" effect
        _hover={{
          bg: "yellow.400", // Hover effect color
          boxShadow: "xl", // Bigger shadow on hover
        }}
        _active={{
          bg: "yellow.500", // Active state color
        }}
      >
        Add Event
      </ChakraButton>
    </div>
  );
};

export default Button;
