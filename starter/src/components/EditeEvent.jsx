import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  CheckboxGroup,
  Checkbox,
  FormControl,
  FormLabel,
  VStack,
} from "@chakra-ui/react";

export const EditEvent = ({ isOpen, onClose, event, categories, onSave }) => {
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalCategoryIds, setModalCategoryIds] = useState([]);
  const [modalDateTime, setModalDateTime] = useState("");

  useEffect(() => {
    if (isOpen && event) {
      setModalTitle(event.title);
      setModalDescription(event.description);
      setModalCategoryIds(event.categoryIds);
      setModalDateTime(event.dateTime);
    }
  }, [isOpen, event]);

  const handleCategoryChange = (selectedValues) => {
    setModalCategoryIds(selectedValues);
  };

  const handleSave = () => {
    const updatedEvent = {
      ...event,
      title: modalTitle,
      description: modalDescription,
      categoryIds: modalCategoryIds.map(Number),
      dateTime: modalDateTime,
    };

    onSave(updatedEvent); // Send the updated event back to EventDetails
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Event Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Event Title</FormLabel>
            <Input
              value={modalTitle}
              onChange={(e) => setModalTitle(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Event Description</FormLabel>
            <Textarea
              value={modalDescription}
              onChange={(e) => setModalDescription(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Categories</FormLabel>
            <CheckboxGroup
              value={modalCategoryIds}
              onChange={handleCategoryChange}
            >
              <VStack align="start">
                {categories.map((category) => (
                  <Checkbox key={category.id} value={category.id}>
                    {category.name}
                  </Checkbox>
                ))}
              </VStack>
            </CheckboxGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Date and Time</FormLabel>
            <Input
              type="datetime-local"
              value={modalDateTime}
              onChange={(e) => setModalDateTime(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="yellow" onClick={handleSave}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditEvent;
