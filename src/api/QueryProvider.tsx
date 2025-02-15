import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren } from "react";

interface QueryProviderProps extends PropsWithChildren {
  config?: QueryClientConfig;
  idbValidKey?: string;
  maxAge?: number;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({
  children,
  config = {
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        refetchOnWindowFocus: false,
      },
    },
  },
}) => {
  const client = new QueryClient(config);

  return (
    <QueryClientProvider client={client}>
      {" "}
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;
