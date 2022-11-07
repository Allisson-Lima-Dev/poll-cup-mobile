import React, { useState } from "react";
import {
  Heading,
  Box,
  Alert,
  useToast,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
  Text,
} from "native-base";
import { useNavigation } from "@react-navigation/native";

import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { api } from "../../services/api";

export function FindPoll() {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  const { navigate } = useNavigation();

  const toast = useToast();
  const toastIdRef = React.useRef();

  function close() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  async function getFindPoll() {
    if (!code.trim()) {
      toastIdRef.current = toast.show({
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
                      😅 Ops, Informe o código do Bolão!
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
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/polls/join", {
        code,
      });
      console.log(data);

      toast.show({
        placement: "top",
        render: () => {
          return (
            <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
              Bolão encontrado 🤩!
            </Box>
          );
        },
      });
      navigate("polls");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error?.response?.data?.message === "Poll not found.") {
        return toast.show({
          title: "Não foi possível encontrar o Bolão 😟",
          placement: "top",
          bgColor: "red.500",
        });
      }
      if (error?.response?.data?.message === "You already joined this poll.") {
        return toast.show({
          title: "Você Já está nesse Bolão 🥳",
          placement: "top",
          bgColor: "red.500",
        });
      }
    }
  }

  return (
    <Box flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />
      <Box alignItems="center" px={5}>
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Encontrar um bolão através de {"\n"}
          seu código único.
        </Heading>
        <Input
          mb={3}
          placeholder="Qual é o código do Bolão?"
          onChangeText={setCode}
          value={code}
          autoCapitalize="characters"
        />
        <Button
          title="BUSCAR BOLÃO"
          onPress={getFindPoll}
          isLoading={loading}
        />
      </Box>
    </Box>
  );
}
