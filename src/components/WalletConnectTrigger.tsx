import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet } from "lucide-react";
import { useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";
import { useActiveFarmConfig } from "@/lib/config";

export function WalletConnectTrigger() {
  const farmConfig = useActiveFarmConfig();
  const { switchChainAsync } = useSwitchChain();

  return (
    <ConnectButton.Custom>
      {({
        mounted,
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;
        const wrongFarmNetwork = Boolean(connected && chain.id !== farmConfig.chainId);

        if (!connected) {
          return (
            <Button onClick={openConnectModal} className="w-full sm:w-auto">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          );
        }

        if (chain.unsupported || wrongFarmNetwork) {
          return (
            <Button
              onClick={() => {
                void switchChainAsync({ chainId: farmConfig.chainId }).catch(() => {
                  openChainModal();
                });
              }}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Wallet className="mr-2 h-4 w-4" />
              {`Switch to ${farmConfig.chainName}`}
            </Button>
          );
        }

        return (
          <Button onClick={openAccountModal} className="w-full sm:w-auto">
            <Wallet className="mr-2 h-4 w-4" />
            {account.displayName}
          </Button>
        );
      }}
    </ConnectButton.Custom>
  );
}
