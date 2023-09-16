import { useQuery } from "@tanstack/react-query";
import { getGame } from "../service";

export const useGetGame = (id) =>
  useQuery(["game", id], async () => {
    const response = await getGame(id);
    return response.data;
  });
