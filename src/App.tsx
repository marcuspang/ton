import { TonConnectButton, TonConnectUIProvider } from "@tonconnect/ui-react";

const manifestUrl = `${
  import.meta.env.VITE_WEBSITE_URL
}/tonconnect-manifest.json`;

export default function App() {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <TonConnectButton />
    </TonConnectUIProvider>
  );
}
