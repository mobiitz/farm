import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  trustWallet,
  uniswapWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { farmConfig } from "@/lib/config";

export const wagmiConfig = getDefaultConfig({
  appName: `${farmConfig.projectName} Farm`,
  appDescription: `${farmConfig.projectName} LP farm for ${farmConfig.projectTicker}.`,
  appUrl: "https://mobiitz.github.io/farm/",
  projectId: farmConfig.walletConnectProjectId,
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  wallets: [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        uniswapWallet,
        trustWallet,
        coinbaseWallet,
        walletConnectWallet,
        injectedWallet,
      ],
    },
  ],
  ssr: false,
});
