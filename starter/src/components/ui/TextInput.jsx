import React from "react";
import { Input, Box } from "@chakra-ui/react";

export const TextInput = ({ id, value, changeFn, placeholder }) => (
  <Box mb={4}>
    <Input
      id={id}
      type="text"
      value={value}
      onChange={changeFn}
      placeholder={placeholder}
      bg="white"
      borderColor="yellow.400"
      color="gray.800"
      fontWeight="bold"
      borderRadius="md"
      _hover={{
        borderColor: "yellow.500",
      }}
      _focus={{
        borderColor: "yellow.500",
        boxShadow: "0 0 0 1px #f7e500", // Adding glow effect on focus
      }}
      size="lg"
      px={4}
      py={3}
    />
  </Box>
);

export default TextInput;
