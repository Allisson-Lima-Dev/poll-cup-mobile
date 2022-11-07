import { VStack, Text, useToast, HStack } from "native-base";
import { useRoute } from "@react-navigation/native";

import { Header } from "../../components/Header";
import { api } from "../../services/api";
import { useEffect, useState } from "react";
import { Loading } from "../../components";
import { PoolPros } from "../../components/PoolCard";
import { PoolHeader } from "../../components/PoolHeader";
import { EmptyMyPoolList } from "../../components/EmptyMyPoolList";
import { Option } from "../../components/Option";
import { Share } from "react-native";
import { Guesses } from "../../components/Guesses";

interface RouteParams {
  id: string;
}

export function Details() {
  const [loading, setLoading] = useState(false);
  const [optionSelected, setOptionSelected] = useState<"guesses" | "ranking">(
    "guesses"
  );
  const [pollDetails, setPollDetails] = useState<PoolPros>({} as PoolPros);
  const toast = useToast();
  const route = useRoute();
  const { id } = route.params as RouteParams;

  async function getDetailsPoll() {
    setLoading(true);
    try {
      const { data } = await api.get(`/polls/${id}`);
      setPollDetails(data.polls);
      console.log(data);
    } catch (error) {
      toast.show({
        title: "Não foi possível carregar os detalhes Bolão 😟",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: pollDetails.code,
    });
  }

  useEffect(() => {
    getDetailsPoll();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={pollDetails?.title}
        onShare={handleCodeShare}
        showBackButton
        showShareButton
      />
      {pollDetails._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={pollDetails} />
          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus Palpites"
              isSelected={optionSelected === "guesses"}
              onPress={() => setOptionSelected("guesses")}
            />
            <Option
              title="Ranking do Grupo"
              isSelected={optionSelected === "ranking"}
              onPress={() => setOptionSelected("ranking")}
            />
          </HStack>
          <Guesses pollId={pollDetails.id} code={pollDetails.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={pollDetails.code} />
      )}
    </VStack>
  );
}
