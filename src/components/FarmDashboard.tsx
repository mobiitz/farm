import { motion } from "framer-motion";
import { Coins, Droplets, Gift } from "lucide-react";
import { LiquidityPanel } from "@/components/LiquidityPanel";
import { MetricCard } from "@/components/MetricCard";
import { ProgramInfoCard } from "@/components/ProgramInfoCard";
import { StakePanel } from "@/components/StakePanel";
import { StatusAlert } from "@/components/StatusAlert";
import { WalletActions } from "@/components/WalletActions";
import { useFarm } from "@/hooks/useFarm";
import { farmConfig } from "@/lib/config";
import {
  formatDateTime,
  formatPerDay,
  formatUnitsSafe,
} from "@/lib/format";

export function FarmDashboard() {
  const farm = useFarm();

  return (
    <div className="min-h-screen bg-slate-950 bg-farm-grid px-4 py-6 text-slate-50 sm:px-6 sm:py-8 md:px-10 md:py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-amber-300/10 to-transparent" />
      <div className="relative mx-auto grid max-w-6xl gap-4 sm:gap-6">
        <div className="grid gap-4 md:grid-cols-[1.4fr_0.6fr]">
          <WalletActions
            chainName={farmConfig.chainName}
            title={`${farmConfig.projectName} Farm`}
            description={`Add liquidity, stake your ${farmConfig.lpSymbol}, and earn ${farmConfig.tokenSymbol} rewards over time.`}
            busy={farm.busy}
            connected={Boolean(farm.account)}
            onRefresh={farm.refreshData}
          />
          <ProgramInfoCard
            rewardRate={`${formatPerDay(farm.rewardRate, farmConfig.tokenDecimals)} ${farmConfig.tokenSymbol}/day`}
            totalStaked={`${formatUnitsSafe(farm.totalStaked, farmConfig.lpDecimals)} ${farmConfig.lpSymbol}`}
            programEnds={formatDateTime(farm.periodFinish)}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <MetricCard
            icon={<Coins className="h-5 w-5" />}
            title={`Wallet ${farmConfig.tokenSymbol}`}
            value={formatUnitsSafe(farm.walletTokenBalance, farmConfig.tokenDecimals)}
            subtitle={farmConfig.tokenSymbol}
          />
          <MetricCard
            icon={<Coins className="h-5 w-5" />}
            title={`Wallet ${farmConfig.quoteTokenSymbol}`}
            value={formatUnitsSafe(
              farm.walletQuoteTokenBalance,
              farmConfig.quoteTokenDecimals,
            )}
            subtitle={farmConfig.quoteTokenSymbol}
            delay={0.05}
          />
          <MetricCard
            icon={<Coins className="h-5 w-5" />}
            title="Wallet LP"
            value={formatUnitsSafe(farm.walletLpBalance, farmConfig.lpDecimals)}
            subtitle={farmConfig.lpSymbol}
            delay={0.1}
          />
        </div>

        <LiquidityPanel
          tokenSymbol={farmConfig.tokenSymbol}
          quoteTokenSymbol={farmConfig.quoteTokenSymbol}
          tokenBalance={formatUnitsSafe(farm.walletTokenBalance, farmConfig.tokenDecimals)}
          quoteTokenBalance={formatUnitsSafe(
            farm.walletQuoteTokenBalance,
            farmConfig.quoteTokenDecimals,
          )}
          tokenValue={farm.liquidityTokenInput}
          quoteValue={farm.liquidityQuoteInput}
          hasTokenApproval={farm.hasLiquidityTokenApproval}
          hasQuoteApproval={farm.hasLiquidityQuoteApproval}
          busy={farm.busy}
          connected={Boolean(farm.account)}
          poolAddress={farmConfig.v2PoolAddress}
          onTokenValueChange={farm.setLiquidityTokenInput}
          onQuoteValueChange={farm.setLiquidityQuoteInput}
          onTokenMax={farm.fillMaxLiquidityToken}
          onQuoteMax={farm.fillMaxLiquidityQuote}
          onApproveToken={farm.approveTokenForRouter}
          onApproveQuoteToken={farm.approveQuoteTokenForRouter}
          onAddLiquidity={farm.addLiquidity}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            icon={<Droplets className="h-5 w-5" />}
            title="Staked LP"
            value={formatUnitsSafe(farm.stakedBalance, farmConfig.lpDecimals)}
            subtitle="Deposited in farm"
            delay={0}
          />
          <MetricCard
            icon={<Gift className="h-5 w-5" />}
            title="Earned Rewards"
            value={formatUnitsSafe(farm.earnedRewards, farmConfig.tokenDecimals)}
            subtitle={farmConfig.tokenSymbol}
            delay={0.05}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <StakePanel
              title="Stake LP"
              label="Amount to stake"
              value={farm.stakeInput}
              onValueChange={farm.setStakeInput}
              onMax={farm.fillMaxStake}
              primaryActionLabel="Step 2. Stake LP"
              secondaryActionLabel={farm.hasApproval ? "Step 1. LP Approved" : "Step 1. Approve LP"}
              onPrimaryAction={farm.stakeLp}
              onSecondaryAction={farm.approveLp}
              primaryDisabled={farm.busy || !farm.account}
              secondaryDisabled={farm.busy || !farm.account || farm.hasApproval}
              secondaryVariant={farm.hasApproval ? "secondary" : "default"}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
          >
            <StakePanel
              title="Withdraw / Claim"
              label="Amount to withdraw"
              value={farm.withdrawInput}
              onValueChange={farm.setWithdrawInput}
              onMax={farm.fillMaxWithdraw}
              primaryActionLabel={`Claim ${farmConfig.tokenSymbol}`}
              secondaryActionLabel="Withdraw LP"
              onPrimaryAction={farm.claimRewards}
              onSecondaryAction={farm.withdrawLp}
              primaryDisabled={farm.busy || !farm.account}
              secondaryDisabled={farm.busy || !farm.account}
              primaryVariant="default"
              secondaryVariant="secondary"
              footerActionLabel="Exit Farm"
              onFooterAction={farm.exitFarm}
              footerDisabled={farm.busy || !farm.account}
            />
          </motion.div>
        </div>

        <StatusAlert status={farm.status} />

        <div className="pb-2 pt-4 text-center text-xs text-slate-500">
          Copyright MAGA Bitcoin 2026
        </div>
      </div>
    </div>
  );
}
