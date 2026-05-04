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
import { base, mainnet } from "wagmi/chains";
import { getActiveFarmConfig } from "@/lib/config";

const farmConfig = getActiveFarmConfig();

export const wagmiConfig = getDefaultConfig({
  appName: `${farmConfig.projectName} Farm`,
  appDescription: `${farmConfig.projectName} LP farm for ${farmConfig.projectTicker}.`,
  appUrl: "https://farm.mbtc.us",
  projectId: farmConfig.walletConnectProjectId,
  chains: [mainnet, base],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
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
