import { useQuery } from "@tanstack/react-query";
import { getIsPreferences } from "../service";

export const useIsPreferences = () =>
  useQuery(["preferences"], async () => {
    const response = await getIsPreferences();
    return response.data;
  });
