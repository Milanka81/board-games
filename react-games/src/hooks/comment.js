import { useQuery } from "@tanstack/react-query";
import { getGameComments, getUserComments } from "../service";

export const useGetGameComments = (id) =>
  useQuery(["comments", id], async () => {
    const response = await getGameComments(id);
    return response.data;
  });

export const useGetUserComments = (id) =>
  useQuery(["userComments", id], async () => {
    const response = await getUserComments(id);
    return response.data;
  });
