import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllGames, getFilteredGames } from "../service";
import { useEffect, useState } from "react";

export function useFilteredGames(page, limit, input, sortBy, enabled) {
  const queryClient = useQueryClient();
  const [numResults, setNumResults] = useState(0);

  useEffect(() => {
    getAllGames().then((res) => {
      setNumResults(res.data[0].count);
    });
  }, []);

  const pageCount = Math.ceil(numResults / limit);

  let {
    isLoading,
    data: { data: filteredGames } = {},
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["games", page, limit, input, sortBy],
    queryFn: () => getFilteredGames(page, limit, input, sortBy),
    enabled: enabled,
  });

  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["games", page + 1, limit, input, sortBy],
      queryFn: () => getFilteredGames(page + 1, limit, input, sortBy),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["games", page - 1, limit, input, sortBy],
      queryFn: () => getFilteredGames(page - 1, limit, input, sortBy),
    });

  return {
    isLoading,
    isSuccess,
    filteredGames,
    refetch,
    pageCount,
  };
}

//const [searchParams, setSearchParams] = useDebounce([category_id, sortPrice, minPrice, maxPrice, page, categoryFilters], 1000)
//const productsQuery = useQuery({ queryKey: ['products', ...searchParams], queryFn: fetchProducts, keepPreviousData: true, staleTime: 1000 });
