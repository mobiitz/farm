import { motion } from "framer-motion";
import { Droplets, RefreshCw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletConnectTrigger } from "@/components/WalletConnectTrigger";

type WalletActionsProps = {
  chainName: string;
  title: string;
  description: string;
  busy: boolean;
  connected: boolean;
  onRefresh: () => Promise<void>;
};

export function WalletActions({
  chainName,
  title,
  description,
  busy,
  connected,
  onRefresh,
}: WalletActionsProps) {
  const logoSrc = `${import.meta.env.BASE_URL}MBTC_light.png`;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="space-y-3">
          <img
            src={logoSrc}
            alt="MAGA Bitcoin logo"
            className="h-14 w-auto rounded-lg object-contain sm:h-16"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              Live Farm
            </Badge>
            <Badge variant="secondary">{chainName}</Badge>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</CardTitle>
          <p className="max-w-2xl text-slate-300">{description}</p>
        </CardHeader>
        <CardContent className="grid gap-3 sm:flex sm:flex-wrap">
          <WalletConnectTrigger />
          <a
            href="#add-liquidity"
            className={buttonVariants("secondary", "w-full sm:w-auto")}
          >
            <Droplets className="mr-2 h-4 w-4" />
            Add Liquidity
          </a>
          <Button
            onClick={onRefresh}
            disabled={busy || !connected}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
