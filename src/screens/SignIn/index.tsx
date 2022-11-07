import { Center, Text, Icon } from "native-base";
import { Fontisto } from "@expo/vector-icons";
import Logo from "../../assets/logo.svg";
import { Button } from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";

export function SignIn() {
  const { signIn, user, isUseLoading } = useAuth();

  return (
    <Center flex={1} bg="gray.900" px={10}>
      <Logo width={212} height={40} />
      <Button
        type="secondary"
        title="Entrar com o Google"
        leftIcon={<Icon as={Fontisto} name="google" color="white" size="md" />}
        mt={10}
        onPress={() => signIn()}
        isLoading={isUseLoading}
        _loading={{
          _spinner: {
            color: "white",
          },
        }}
      />
      <Text color="white" textAlign="center" mt={4}>
        Não utilizamos nenhuma informação além {"\n"} do seu e-mail para criação
        de sua conta.
      </Text>
    </Center>
  );
}
