import React from "react";
import { useToast } from "@chakra-ui/react";

export const DeleteToast = ({ status, message, description }) => {
  const toast = useToast();

  // Show the toast notification when props change
  React.useEffect(() => {
    if (status && message) {
      toast({
        title: message,
        description: description,
        status: status,
        duration: 3000,
        isClosable: true,
      });
    }
  }, [status, message, description, toast]);

  return null; // This component doesn't render anything visually, just triggers the toast
};

export default DeleteToast;
