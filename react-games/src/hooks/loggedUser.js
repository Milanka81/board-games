import { useQuery } from "@tanstack/react-query";
import { getLoggedUser } from "../service";

export const useGetLoggedUser = () =>
  useQuery(["loggedUser"], async () => {
    const response = await getLoggedUser();
    return response.data[0];
  });
