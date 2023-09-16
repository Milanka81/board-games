import { useQuery } from "@tanstack/react-query";
import {
  getFavoriteGames,
  getMostLiked,
  getNewGames,
  getRecommendedGames,
} from "../service";

export const useNewGames = () =>
  useQuery(["newGames"], async () => {
    const response = await getNewGames();
    return response.data;
  });

export const useMostLikedGames = () =>
  useQuery(["mostLikedGames"], async () => {
    const response = await getMostLiked();
    return response.data;
  });

export const useRecommendedGames = () =>
  useQuery(["recommendedGames"], async () => {
    const response = await getRecommendedGames();
    return response.data;
  });

export const useFavouriteGames = () =>
  useQuery(["favouriteGames"], async () => {
    const response = await getFavoriteGames();
    return response.data;
  });
