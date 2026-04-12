import React from "react";
import ReactDOM from "react-dom/client";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import App from "@/App";
import { wagmiConfig } from "@/lib/wagmi";
import { getActiveFarmConfig } from "@/lib/config";
import "@/styles/index.css";

const queryClient = new QueryClient();
const farmConfig = getActiveFarmConfig();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: farmConfig.theme.accentSolid,
            accentColorForeground: "#020617",
            borderRadius: "large",
          })}
        >
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
