import {
  DefaultError,
  QueryFunction,
  type QueryFunctionContext,
  type QueryKey,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult as UseQueryResultRQ,
  useMutation as useMutationRQ,
  useQuery as useQueryRQ,
} from "@tanstack/react-query";

export type UseQueryResult<
  TData = unknown,
  TError = unknown
> = UseQueryResultRQ<TData, TError>;

export const useMutation = <
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> => {
  const mutationFn = options.mutationFn;
  return useMutationRQ({
    ...options,
    ...(mutationFn && {
      mutationFn: async (variables: TVariables): Promise<TData> => {
        return await mutationFn(variables);
      },
    }),
    onError: (error) => {
      throw error;
    },
  });
};

export const useQuery = <
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
    queryFn?: QueryFunction<TQueryFnData, TQueryKey>;
    cacheTime?: number;
    staleTime?: number;
  }
): UseQueryResult<TData, TError> => {
  const queryFn = options.queryFn;
  return useQueryRQ({
    ...options,
    ...(queryFn && {
      queryFn: async (context: QueryFunctionContext<TQueryKey>) =>
        queryFn(context),
    }),
  });
};
