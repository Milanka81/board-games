import { useQuery } from "@tanstack/react-query";
import { getIsPreferences } from "../service";

export const useIsPreferences = () =>
  useQuery({
    queryKey: ["preferences"],
    queryFn: async () => {
      const response = await getIsPreferences();
      return response.data;
    },
    initialData: [{ 1: 1 }],
    initialDataUpdatedAt: 1000,
  });
