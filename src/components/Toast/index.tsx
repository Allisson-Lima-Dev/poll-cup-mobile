import React, { useState } from "react";

import {
  Center,
  Text,
  Icon,
  Heading,
  Flex,
  Box,
  Alert,
  useToast,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
} from "native-base";

interface IToastProps {
  //   type: "success" | "error" | "info" | "warning";
  title: string;
}

export function Toast({ title }: IToastProps) {
  const toast = useToast();
  const toastIdRef = React.useRef();

  function close() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  return (toastIdRef.current = toast.show({
    placement: "top",
    bgColor: "red.500",
    render: () => {
      return (
        <Alert w="100%" status="error">
          <VStack space={2} flexShrink={1} w="100%">
            <HStack flexShrink={1} space={2} justifyContent="space-between">
              <HStack space={2} flexShrink={1}>
                <Alert.Icon mt="1" />
                <Text fontSize="md" color="coolGray.800">
                  {title}
                </Text>
              </HStack>
              <IconButton
                variant="unstyled"
                _focus={{
                  borderWidth: 0,
                }}
                icon={<CloseIcon size="3" />}
                _icon={{
                  color: "coolGray.600",
                }}
                onPress={close}
              />
            </HStack>
          </VStack>
        </Alert>
      );
    },
  }));
}
