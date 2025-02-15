import {
  type QueryFilters,
  type QueryKey,
  useIsFetching as useIsFetchingRQ,
  useQueryClient,
} from "@tanstack/react-query";

export const useInvalidateQuery = () => {
  const queryClient = useQueryClient();

  return {
    invalidate: async (
      queryKey?: QueryKey,
      refetchType: QueryFilters["type"] = "active"
    ) => {
      await queryClient.invalidateQueries({ queryKey, refetchType });
    },
  };
};

export const useRemoveQueries = () => {
  const queryClient = useQueryClient();
  return {
    removeQuery: (queryKey: QueryKey) => {
      queryClient.removeQueries({ queryKey, exact: true });
    },
    removeQueries: () => {
      queryClient.removeQueries();
    },
  };
};

export const useResetQueries = () => {
  const queryClient = useQueryClient();
  return {
    resetQuery: (queryKey: QueryKey) => {
      queryClient.resetQueries({ queryKey, exact: false });
    },
    resetQueries: () => {
      queryClient.resetQueries();
    },
  };
};

export const useIsLoading = ({
  queryKey,
  queryRootKeys,
}: QueryFilters & { queryRootKeys?: string[] } = {}) => {
  const isFetching = useIsFetchingRQ({
    queryKey,
    predicate: (query) => {
      return (
        (!queryRootKeys ||
          !!queryRootKeys.some((rootKey) => rootKey === query.queryKey[0])) &&
        query.state.status === "pending"
      );
    },
  });
  return isFetching > 0;
};

export const useIsFetching = ({ queryKey }: QueryFilters = {}) => {
  const isFetching = useIsFetchingRQ({
    queryKey,
  });
  return isFetching > 0;
};
