import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, getFilteredUsers } from "../service";
import { useEffect, useState } from "react";

export function useFilteredUsers(page, limit, input, sortBy) {
  const queryClient = useQueryClient();
  const [numResults, setNumResults] = useState(0);

  useEffect(() => {
    getAllUsers().then((res) => {
      setNumResults(res.data[0].count);
    });
  }, []);

  const pageCount = Math.ceil(numResults / limit);

  let {
    isLoading,
    data: { data: filteredUsers } = {},
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["users", page, limit, input, sortBy],
    queryFn: () => getFilteredUsers(page, limit, input, sortBy),
  });

  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["users", page + 1, limit, input, sortBy],
      queryFn: () => getFilteredUsers(page + 1, limit, input, sortBy),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["users", page - 1, limit, input, sortBy],
      queryFn: () => getFilteredUsers(page - 1, limit, input, sortBy),
    });

  if (sortBy.endsWith("asc"))
    queryClient.prefetchQuery({
      queryKey: ["users", page, limit, input, sortBy.replace("asc", "desc")],
      queryFn: () =>
        getFilteredUsers(page, limit, input, sortBy.replace("asc", "desc")),
    });

  if (sortBy.endsWith("desc"))
    queryClient.prefetchQuery({
      queryKey: ["users", page, limit, input, sortBy.replace("desc", "asc")],
      queryFn: () =>
        getFilteredUsers(page, limit, input, sortBy.replace("desc", "asc")),
    });

  return {
    isLoading,
    isSuccess,
    filteredUsers,
    refetch,
    pageCount,
  };
}
