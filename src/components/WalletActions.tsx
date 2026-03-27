import { motion } from "framer-motion";
import { Droplets, RefreshCw, Wallet } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WalletActionsProps = {
  chainName: string;
  title: string;
  description: string;
  accountLabel: string;
  busy: boolean;
  connected: boolean;
  onConnect: () => Promise<void>;
  onRefresh: () => Promise<void>;
};

export function WalletActions({
  chainName,
  title,
  description,
  accountLabel,
  busy,
  connected,
  onConnect,
  onRefresh,
}: WalletActionsProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Live Farm</Badge>
            <Badge variant="secondary">{chainName}</Badge>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</CardTitle>
          <p className="max-w-2xl text-slate-300">{description}</p>
        </CardHeader>
        <CardContent className="grid gap-3 sm:flex sm:flex-wrap">
          <Button onClick={onConnect} disabled={busy} className="w-full sm:w-auto">
            <Wallet className="mr-2 h-4 w-4" />
            {accountLabel}
          </Button>
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
