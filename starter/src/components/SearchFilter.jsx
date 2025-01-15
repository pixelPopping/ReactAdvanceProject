import React, { useState } from "react";
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack,
  Text,
  HStack,
} from "@chakra-ui/react";
import { SearchIcon, ChevronDownIcon } from "@chakra-ui/icons";

export const SearchFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase()); // Convert search term to lowercase
    onSearch(event.target.value.toLowerCase());
  };

  const handleCategorySelect = (categoryId) => {
    onCategoryChange(categoryId);
    setIsMenuOpen(false); // Close the menu after selection
  };

  return (
    <Box
      className="search-filter"
      p={4}
      bg="gray.900"
      borderRadius="lg"
      boxShadow="lg"
      maxW="md"
      mx="auto"
      mt={4}
      borderColor="yellow.400"
      borderWidth={2}
    >
      <Text
        fontSize="lg"
        color="yellow.500"
        fontWeight="bold"
        mb={2}
        textTransform="lowercase" // Ensure label text is lowercase
      >
        search events
      </Text>
      <InputGroup>
        {/* Search Input */}
        <Input
          placeholder="search events..."
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label="Search Events"
          bg="gray.800"
          borderColor="yellow.400"
          color="white"
          fontWeight="bold"
          _hover={{
            borderColor: "yellow.500",
          }}
          _focus={{
            borderColor: "yellow.500",
          }}
          size="lg"
          px={4}
          py={2}
          textTransform="lowercase" // Ensure placeholder text and input value are lowercase
        />
        <InputRightElement>
          <IconButton
            aria-label="Search"
            icon={<SearchIcon />}
            bg="yellow.500"
            _hover={{ bg: "yellow.400" }}
            color="gray.800"
          />
        </InputRightElement>
      </InputGroup>

      {/* Dropdown Menu */}
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <MenuButton
          as={IconButton}
          icon={<ChevronDownIcon />}
          size="lg"
          aria-label="Select Category"
          mt={3}
          w="full"
          textAlign="left"
          bg="gray.800"
          color="yellow.500"
          borderColor="yellow.400"
          _hover={{
            bg: "gray.700",
          }}
          _expanded={{
            bg: "gray.700",
          }}
          textTransform="lowercase" // Ensure button text is lowercase
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {categories
            .find((cat) => cat.id === selectedCategory)
            ?.name.toLowerCase() || "all categories"}
        </MenuButton>
        <MenuList bg="gray.800" borderColor="yellow.500" zIndex="dropdown">
          <VStack align="start" spacing={1}>
            {/* "All Categories" Option */}
            <MenuItem
              onClick={() => handleCategorySelect("")}
              bg="gray.800"
              _hover={{ bg: "gray.700", color: "yellow.400" }}
              color="white"
              textTransform="lowercase" // Ensure menu item text is lowercase
            >
              <Text>all categories</Text>
            </MenuItem>
            {/* Render Categories */}
            {categories.map((category) => (
              <MenuItem
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                bg="gray.800"
                _hover={{ bg: "gray.700", color: "yellow.400" }}
                color="white"
                textTransform="lowercase" // Ensure menu item text is lowercase
              >
                <HStack>
                  <Text>{category.name.toLowerCase()}</Text>
                </HStack>
              </MenuItem>
            ))}
          </VStack>
        </MenuList>
      </Menu>
    </Box>
  );
};
