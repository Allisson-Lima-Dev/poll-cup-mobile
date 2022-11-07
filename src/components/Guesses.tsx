import { Box, FlatList, useToast } from "native-base";
import { useEffect, useState } from "react";
import { Share } from "react-native";
import { api } from "../services/api";
import { EmptyMyPoolList } from "./EmptyMyPoolList";
import { Game, GameProps } from "./Game";
import { Loading } from "./Loading";

interface Props {
  pollId: string;
  code?: string;
}

export function Guesses({ pollId, code }: Props) {
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");

  const toast = useToast();
  async function getGuesses() {
    setLoading(true);
    try {
      const { data } = await api.get(`/polls/games/${pollId}`);
      setGames(data.games);
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

  async function handleGuessesConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: "Informe o Placar do Palpite 😟",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post(`/polls/${pollId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.show({
        placement: "top",
        render: () => {
          return (
            <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
              Palpite realizado com sucesso 🥳!
            </Box>
          );
        },
      });

      getGuesses();
    } catch (error) {
      console.log(error);

      toast.show({
        title:
          error?.response?.data?.message ||
          "Não foi possível enviar o palpite 😟",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: code,
    });
  }

  useEffect(() => {
    getGuesses();
  }, [pollId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessesConfirm(item.id)}
        />
      )}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  );
}
