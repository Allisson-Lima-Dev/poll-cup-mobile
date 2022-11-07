import { useCallback, useEffect, useState } from "react";
import { VStack, Icon, Spinner, FlatList } from "native-base";
import { Octicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { api } from "../../services/api";
import { PoolCard, PoolPros } from "../../components/PoolCard";
import { EmptyPoolList } from "../../components/EmptyPoolList";

export function Polls() {
  const [loading, setLoading] = useState(false);
  const [polls, setPolls] = useState<PoolPros[]>([]);
  const { navigate } = useNavigation();

  async function getPolls() {
    setLoading(true);
    try {
      const { data } = await api.get("/polls");
      setPolls(data.polls);
    } catch (error) {
      console.log();
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getPolls();
    }, [])
  );
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus Bolões" />
      <VStack
        mt={7}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={3}
        mb={3}
      >
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size="md" />
          }
          onPress={() => navigate("findPoll")}
        />
      </VStack>
      {loading ? (
        <VStack flex={1} alignItems="center" justifyContent="center">
          <Spinner />
        </VStack>
      ) : (
        <VStack flex={1} mx={5} mb={5}>
          <FlatList
            data={polls}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PoolCard
                data={item}
                onPress={() =>
                  navigate("details", {
                    id: item.id,
                  })
                }
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{
              pb: 12,
            }}
            ListEmptyComponent={() => <EmptyPoolList />}
          />
        </VStack>
      )}
    </VStack>
  );
}
