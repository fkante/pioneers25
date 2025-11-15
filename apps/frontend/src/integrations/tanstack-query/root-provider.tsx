import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export interface QueryContext {
  queryClient: QueryClient
}

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
      },
    },
  })
}

export function getContext(): QueryContext {
  return {
    queryClient: createQueryClient(),
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
