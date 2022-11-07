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

import Logo from "../../assets/logo.svg";

import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { api } from "../../services/api";

export function NewPoll() {
  const [titlePoll, setTitlePoll] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const toastIdRef = React.useRef();

  function close() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  async function handlePollCreate() {
    if (!titlePoll.trim()) {
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
                      🙄 Opa! Informe o título!
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
      const { data } = await api.post("/polls", {
        title: titlePoll.toLocaleUpperCase(),
      });
      toast.show({
        placement: "top",
        render: () => {
          return (
            <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
              {`Bolão de código ${data.code} criado!`}
            </Box>
          );
        },
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box flex={1} bgColor="gray.900">
      <Header title="Criar Novo Bolão" />
      <Box mt={8} alignItems="center" px={5}>
        <Logo />
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Crie seu próprio bolão da copa {"\n"} e compartilhe entre amigos!
        </Heading>

        <Input
          mb={2}
          placeholder="Qual nome do seu Bolão?"
          onChangeText={setTitlePoll}
          value={titlePoll}
        />
        <Button
          title="Criar meu bolão"
          onPress={handlePollCreate}
          isLoading={loading}
        />
        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          Após criar seu Bolão, você receberá um código único que poderá usar
          para convidar outras pessoas.
        </Text>
      </Box>
    </Box>
  );
}
