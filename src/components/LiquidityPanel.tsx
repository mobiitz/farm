import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type LiquidityPanelProps = {
  tokenSymbol: string;
  quoteTokenSymbol: string;
  tokenBalance: string;
  quoteTokenBalance: string;
  lpBalance: string;
  tokenValue: string;
  quoteValue: string;
  removeLiquidityValue: string;
  hasTokenApproval: boolean;
  hasQuoteApproval: boolean;
  hasRemoveLiquidityApproval: boolean;
  busy: boolean;
  connected: boolean;
  poolAddress: string;
  onTokenValueChange: (value: string) => void;
  onQuoteValueChange: (value: string) => void;
  onRemoveLiquidityValueChange: (value: string) => void;
  onTokenMax: () => void;
  onQuoteMax: () => void;
  onRemoveLiquidityMax: () => void;
  onApproveToken: () => Promise<void>;
  onApproveQuoteToken: () => Promise<void>;
  onApproveLp: () => Promise<void>;
  onAddLiquidity: () => Promise<void>;
  onRemoveLiquidity: () => Promise<void>;
};

export function LiquidityPanel({
  tokenSymbol,
  quoteTokenSymbol,
  tokenBalance,
  quoteTokenBalance,
  lpBalance,
  tokenValue,
  quoteValue,
  removeLiquidityValue,
  hasTokenApproval,
  hasQuoteApproval,
  hasRemoveLiquidityApproval,
  busy,
  connected,
  poolAddress,
  onTokenValueChange,
  onQuoteValueChange,
  onRemoveLiquidityValueChange,
  onTokenMax,
  onQuoteMax,
  onRemoveLiquidityMax,
  onApproveToken,
  onApproveQuoteToken,
  onApproveLp,
  onAddLiquidity,
  onRemoveLiquidity,
}: LiquidityPanelProps) {
  return (
    <motion.div id="add-liquidity" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Add {tokenSymbol}/{quoteTokenSymbol} Liquidity</CardTitle>
          <p className="text-sm text-slate-300">
            Here you can add to the liquidity pool, in order to get LP Stake tokens for
            earning {tokenSymbol} rewards with. After these 3 steps are complete,
            continue to the &quot;Stake LP&quot; section below, you&apos;re almost there!
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
              className="h-auto min-h-11 w-full whitespace-normal py-3 text-center"
            >
              {hasTokenApproval ? (
                <>
                  <strong>Step 1.</strong>&nbsp;{tokenSymbol} Approved
                </>
              ) : (
                <>
                  <strong>Step 1.</strong>&nbsp;Approve {tokenSymbol}
                </>
              )}
            </Button>
            <Button
              onClick={onApproveQuoteToken}
              disabled={busy || !connected || hasQuoteApproval}
              variant={hasQuoteApproval ? "secondary" : "default"}
              className="h-auto min-h-11 w-full whitespace-normal py-3 text-center"
            >
              {hasQuoteApproval ? (
                <>
                  <strong>Step 2.</strong>&nbsp;{quoteTokenSymbol} Approved
                </>
              ) : (
                <>
                  <strong>Step 2.</strong>&nbsp;Approve {quoteTokenSymbol}
                </>
              )}
            </Button>
            <Button
              onClick={onAddLiquidity}
              disabled={busy || !connected || !hasTokenApproval || !hasQuoteApproval}
              className="h-auto min-h-11 w-full whitespace-normal py-3 text-center sm:col-span-2 lg:col-span-1"
            >
              <strong>Step 3.</strong>&nbsp;Add Liquidity
            </Button>
          </div>

          <div className="border-t border-slate-800 pt-4" />

          <div className="grid gap-2">
            <div className="flex flex-col gap-1 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
              <label>LP amount to remove</label>
              <span>Wallet: {lpBalance} LP</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
              <Input
                value={removeLiquidityValue}
                onChange={(event) => onRemoveLiquidityValueChange(event.target.value)}
                placeholder="0.0"
              />
              <Button
                variant="secondary"
                onClick={onRemoveLiquidityMax}
                className="w-full sm:w-auto"
              >
                Max
              </Button>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              onClick={onApproveLp}
              disabled={busy || !connected || hasRemoveLiquidityApproval}
              variant={hasRemoveLiquidityApproval ? "secondary" : "default"}
              className="h-auto min-h-11 w-full whitespace-normal py-3 text-center"
            >
              {hasRemoveLiquidityApproval ? "LP Router Approved" : "Approve LP For Remove"}
            </Button>
            <Button
              onClick={onRemoveLiquidity}
              disabled={busy || !connected || !hasRemoveLiquidityApproval}
              variant="outline"
              className="h-auto min-h-11 w-full whitespace-normal py-3 text-center"
            >
              Remove Liquidity
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
