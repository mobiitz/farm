import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type LiquidityPanelProps = {
  tokenSymbol: string;
  quoteTokenSymbol: string;
  tokenBalance: string;
  quoteTokenBalance: string;
  tokenValue: string;
  quoteValue: string;
  hasTokenApproval: boolean;
  hasQuoteApproval: boolean;
  busy: boolean;
  connected: boolean;
  poolAddress: string;
  onTokenValueChange: (value: string) => void;
  onQuoteValueChange: (value: string) => void;
  onTokenMax: () => void;
  onQuoteMax: () => void;
  onApproveToken: () => Promise<void>;
  onApproveQuoteToken: () => Promise<void>;
  onAddLiquidity: () => Promise<void>;
};

export function LiquidityPanel({
  tokenSymbol,
  quoteTokenSymbol,
  tokenBalance,
  quoteTokenBalance,
  tokenValue,
  quoteValue,
  hasTokenApproval,
  hasQuoteApproval,
  busy,
  connected,
  poolAddress,
  onTokenValueChange,
  onQuoteValueChange,
  onTokenMax,
  onQuoteMax,
  onApproveToken,
  onApproveQuoteToken,
  onAddLiquidity,
}: LiquidityPanelProps) {
  return (
    <motion.div id="add-liquidity" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Add {tokenSymbol}/{quoteTokenSymbol} Liquidity</CardTitle>
          <p className="text-sm text-slate-300">
            Supply both tokens directly through the configured V2 router, receive LP tokens,
            then stake them below.
          </p>
          <p className="break-all text-xs text-slate-400">Pool: {poolAddress}</p>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex flex-col gap-1 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
              <label>{tokenSymbol} amount</label>
              <span>Wallet: {tokenBalance} {tokenSymbol}</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
              <Input value={tokenValue} onChange={(event) => onTokenValueChange(event.target.value)} placeholder="0.0" />
              <Button variant="secondary" onClick={onTokenMax} className="w-full sm:w-auto">
                Max
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex flex-col gap-1 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
              <label>{quoteTokenSymbol} amount</label>
              <span>Wallet: {quoteTokenBalance} {quoteTokenSymbol}</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
              <Input value={quoteValue} onChange={(event) => onQuoteValueChange(event.target.value)} placeholder="0.0" />
              <Button variant="secondary" onClick={onQuoteMax} className="w-full sm:w-auto">
                Max
              </Button>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <Button
              onClick={onApproveToken}
              disabled={busy || !connected || hasTokenApproval}
              variant={hasTokenApproval ? "secondary" : "default"}
              className="w-full"
            >
              {hasTokenApproval ? `${tokenSymbol} Approved` : `Approve ${tokenSymbol}`}
            </Button>
            <Button
              onClick={onApproveQuoteToken}
              disabled={busy || !connected || hasQuoteApproval}
              variant={hasQuoteApproval ? "secondary" : "default"}
              className="w-full"
            >
              {hasQuoteApproval ? `${quoteTokenSymbol} Approved` : `Approve ${quoteTokenSymbol}`}
            </Button>
            <Button
              onClick={onAddLiquidity}
              disabled={busy || !connected || !hasTokenApproval || !hasQuoteApproval}
              className="w-full sm:col-span-2 lg:col-span-1"
            >
              Add Liquidity
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
