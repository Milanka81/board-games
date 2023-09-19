import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutUser } from "../utils";

export function useLogoutUser() {
  const queryClient = useQueryClient();

  const { isLoading: isLoggingOut, mutate: logout } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["loggedUser"],
      });
    },
  });

  return { isLoggingOut, logout };
}
