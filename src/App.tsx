import { Header } from "@/components/header";
import SwapPage from "@/components/swap-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const manifestUrl = `${
  import.meta.env.VITE_WEBSITE_URL
}/tonconnect-manifest.json`;

const queryClient = new QueryClient();

export default function App() {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <QueryClientProvider client={queryClient}>
        <Header />
        <SwapPage />
      </QueryClientProvider>
    </TonConnectUIProvider>
  );
}
