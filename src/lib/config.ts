function getEnv(name: string, fallback: string) {
  const raw = import.meta.env[name];
  if (typeof raw !== "string") {
    return fallback;
  }

  const normalized = raw.trim();
  return normalized.length > 0 ? normalized : fallback;
}

function getNumberEnv(name: string, fallback: number) {
  const raw = import.meta.env[name];
  if (typeof raw !== "string" || raw.trim().length === 0) {
    return fallback;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const farmConfig = {
  chainId: getNumberEnv("VITE_CHAIN_ID", 1),
  chainName: getEnv("VITE_CHAIN_NAME", "Ethereum"),
  projectName: getEnv("VITE_PROJECT_NAME", "Maga Bitcoin"),
  projectTicker: getEnv("VITE_PROJECT_TICKER", "MBTC"),
  tokenSymbol: getEnv("VITE_TOKEN_SYMBOL", "MBTC"),
  tokenAddress: getEnv(
    "VITE_TOKEN_ADDRESS",
    "0x3898257dD2Cd6d2A3b6e3435f73568A725262b9B",
  ),
  quoteTokenSymbol: getEnv("VITE_QUOTE_TOKEN_SYMBOL", "USDC"),
  quoteTokenAddress: getEnv("VITE_QUOTE_TOKEN_ADDRESS", "0xYourUsdcAddressHere"),
  quoteTokenDecimals: getNumberEnv("VITE_QUOTE_TOKEN_DECIMALS", 6),
  lpSymbol: getEnv("VITE_LP_SYMBOL", "MBTC/USDC LP"),
  rewardsContractAddress: getEnv(
    "VITE_REWARDS_CONTRACT_ADDRESS",
    "0xYourRewardsContractAddressHere",
  ),
  lpTokenAddress: getEnv("VITE_LP_TOKEN_ADDRESS", "0xYourLpTokenAddressHere"),
  v2RouterAddress: getEnv("VITE_V2_ROUTER_ADDRESS", "0xYourV2RouterAddressHere"),
  v2PoolAddress: getEnv("VITE_V2_POOL_ADDRESS", "0xYourMbtcUsdcPairAddressHere"),
  liquiditySlippageBps: getNumberEnv("VITE_LIQUIDITY_SLIPPAGE_BPS", 100),
  liquidityDeadlineMinutes: getNumberEnv("VITE_LIQUIDITY_DEADLINE_MINUTES", 20),
  tokenDecimals: getNumberEnv("VITE_TOKEN_DECIMALS", 18),
  lpDecimals: getNumberEnv("VITE_LP_DECIMALS", 18),
} as const;
