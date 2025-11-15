import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router';

import Header from '../components/Header';
import appCss from '../styles.css?url';
import type { QueryClient } from '@tanstack/react-query';

interface AppRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<AppRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Pioneers Frontend',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-[#f0f4ef] text-[#0d1821]">
        <Header />
        <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{children}</main>
        <Scripts />
      </body>
    </html>
  );
}
