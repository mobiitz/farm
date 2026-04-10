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

function getBooleanEnv(name: string, fallback: boolean) {
  const raw = import.meta.env[name];
  if (typeof raw !== "string") {
    return fallback;
  }

  const normalized = raw.trim().toLowerCase();
  if (normalized === "true") {
    return true;
  }

  if (normalized === "false") {
    return false;
  }

  return fallback;
}

function getPrefixedEnv(prefix: string, name: string, fallback: string) {
  return getEnv(`VITE_${prefix}_${name}`, fallback);
}

function getPrefixedNumberEnv(prefix: string, name: string, fallback: number) {
  return getNumberEnv(`VITE_${prefix}_${name}`, fallback);
}

function getPrefixedBooleanEnv(prefix: string, name: string, fallback: boolean) {
  return getBooleanEnv(`VITE_${prefix}_${name}`, fallback);
}

function normalizePath(pathname: string) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export type FarmKey = "eth" | "base";

type FarmTheme = {
  accentSolid: string;
  accentHover: string;
  accentSoft: string;
  accentText: string;
  accentRing: string;
  accentGlow: string;
  pageGlow: string;
  pageGlowSecondary: string;
  pageFrom: string;
  pageTo: string;
};

export type FarmConfig = {
  key: FarmKey;
  envPrefix: "ETH" | "BASE";
  routeSegment: "mbtcfarm" | "mbtc-base";
  routeLabel: string;
  chainId: number;
  chainName: string;
  projectName: string;
  projectTicker: string;
  walletConnectProjectId: string;
  tokenSymbol: string;
  tokenAddress: string;
  quoteTokenSymbol: string;
  quoteTokenAddress: string;
  quoteTokenDecimals: number;
  lpSymbol: string;
  rewardsContractAddress: string;
  lpTokenAddress: string;
  v2RouterAddress: string;
  v2PoolAddress: string;
  liquiditySlippageBps: number;
  liquidityDeadlineMinutes: number;
  tokenDecimals: number;
  lpDecimals: number;
  dexName: string;
  dexType: "uniswap-v2" | "aerodrome";
  isStablePool: boolean;
  cardEyebrow: string;
  landingDescription: string;
  actionLabel: string;
  theme: FarmTheme;
};

function createFarmConfig(key: FarmKey): FarmConfig {
  const envPrefix = key === "eth" ? "ETH" : "BASE";

  return {
    key,
    envPrefix,
    routeSegment: key === "eth" ? "mbtcfarm" : "mbtc-base",
    routeLabel: key === "eth" ? "Ethereum Farm" : "Base Farm",
    chainId: getPrefixedNumberEnv(envPrefix, "CHAIN_ID", key === "eth" ? 1 : 8453),
    chainName: getPrefixedEnv(envPrefix, "CHAIN_NAME", key === "eth" ? "Ethereum" : "Base"),
    projectName: getPrefixedEnv(envPrefix, "PROJECT_NAME", "Maga Bitcoin"),
    projectTicker: getPrefixedEnv(envPrefix, "PROJECT_TICKER", "MBTC"),
    walletConnectProjectId: getPrefixedEnv(
      envPrefix,
      "WALLETCONNECT_PROJECT_ID",
      "YOUR_WALLETCONNECT_PROJECT_ID",
    ),
    tokenSymbol: getPrefixedEnv(envPrefix, "TOKEN_SYMBOL", "MBTC"),
    tokenAddress: getPrefixedEnv(
      envPrefix,
      "TOKEN_ADDRESS",
      "0x3898257dD2Cd6d2A3b6e3435f73568A725262b9B",
    ),
    quoteTokenSymbol: getPrefixedEnv(envPrefix, "QUOTE_TOKEN_SYMBOL", "USDC"),
    quoteTokenAddress: getPrefixedEnv(envPrefix, "QUOTE_TOKEN_ADDRESS", "0xYourUsdcAddressHere"),
    quoteTokenDecimals: getPrefixedNumberEnv(envPrefix, "QUOTE_TOKEN_DECIMALS", 6),
    lpSymbol: getPrefixedEnv(envPrefix, "LP_SYMBOL", "MBTC/USDC LP"),
    rewardsContractAddress: getPrefixedEnv(
      envPrefix,
      "REWARDS_CONTRACT_ADDRESS",
      "0xYourRewardsContractAddressHere",
    ),
    lpTokenAddress: getPrefixedEnv(envPrefix, "LP_TOKEN_ADDRESS", "0xYourLpTokenAddressHere"),
    v2RouterAddress: getPrefixedEnv(
      envPrefix,
      "V2_ROUTER_ADDRESS",
      "0xYourV2RouterAddressHere",
    ),
    v2PoolAddress: getPrefixedEnv(envPrefix, "V2_POOL_ADDRESS", "0xYourMbtcUsdcPairAddressHere"),
    liquiditySlippageBps: getPrefixedNumberEnv(envPrefix, "LIQUIDITY_SLIPPAGE_BPS", 100),
    liquidityDeadlineMinutes: getPrefixedNumberEnv(
      envPrefix,
      "LIQUIDITY_DEADLINE_MINUTES",
      20,
    ),
    tokenDecimals: getPrefixedNumberEnv(envPrefix, "TOKEN_DECIMALS", 18),
    lpDecimals: getPrefixedNumberEnv(envPrefix, "LP_DECIMALS", 18),
    dexName: key === "eth" ? "Uniswap V2" : "Aerodrome",
    dexType: key === "eth" ? "uniswap-v2" : "aerodrome",
    isStablePool: getPrefixedBooleanEnv(envPrefix, "POOL_STABLE", false),
    cardEyebrow: key === "eth" ? "Ethereum Mainnet" : "Base Network",
    landingDescription:
      key === "eth"
        ? "Use the current MBTC farm on Ethereum with the existing Uniswap V2 LP flow."
        : "Use the new MBTC farm on Base with the bridge-native deployment and Aerodrome branding.",
    actionLabel: key === "eth" ? "Use Existing Site" : "Open Base Farm",
    theme:
      key === "eth"
        ? {
            accentSolid: "#6da8ff",
            accentHover: "#8bb8ff",
            accentSoft: "rgba(109, 168, 255, 0.18)",
            accentText: "#dbeafe",
            accentRing: "rgba(109, 168, 255, 0.45)",
            accentGlow: "rgba(109, 168, 255, 0.28)",
            pageGlow: "rgba(109, 168, 255, 0.2)",
            pageGlowSecondary: "rgba(59, 130, 246, 0.12)",
            pageFrom: "#081426",
            pageTo: "#020617",
          }
        : {
            accentSolid: "#0a4ecb",
            accentHover: "#1564eb",
            accentSoft: "rgba(21, 101, 235, 0.18)",
            accentText: "#dbeafe",
            accentRing: "rgba(37, 99, 235, 0.5)",
            accentGlow: "rgba(10, 78, 203, 0.32)",
            pageGlow: "rgba(10, 78, 203, 0.24)",
            pageGlowSecondary: "rgba(15, 23, 42, 0.45)",
            pageFrom: "#06101f",
            pageTo: "#020617",
          },
  };
}

export const farmConfigs = {
  eth: createFarmConfig("eth"),
  base: createFarmConfig("base"),
} as const;

export function getFarmKeyFromPath(pathname: string): FarmKey | null {
  const normalized = normalizePath(pathname);

  if (normalized.endsWith("/mbtcfarm")) {
    return "eth";
  }

  if (normalized.endsWith("/mbtc-base")) {
    return "base";
  }

  return null;
}

export function getAppRootPath(pathname: string) {
  const normalized = normalizePath(pathname);

  if (normalized === "/") {
    return "/";
  }

  const farmKey = getFarmKeyFromPath(normalized);
  if (!farmKey) {
    return `${normalized}/`;
  }

  const routeSegment = farmConfigs[farmKey].routeSegment;
  const nextPath = normalized.slice(0, -(`/${routeSegment}`.length));

  return nextPath.length > 0 ? `${nextPath}/` : "/";
}

export function getRouteHref(routeSegment: FarmConfig["routeSegment"], pathname?: string) {
  const currentPath =
    pathname ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  return `${getAppRootPath(currentPath)}${routeSegment}/`;
}

export function getLandingHref(pathname?: string) {
  const currentPath =
    pathname ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  return getAppRootPath(currentPath);
}

export function getAssetHref(assetName: string, pathname?: string) {
  const currentPath =
    pathname ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  return `${getAppRootPath(currentPath)}${assetName}`;
}

export const activeFarmKey =
  typeof window !== "undefined" ? getFarmKeyFromPath(window.location.pathname) : null;

export const farmConfig = farmConfigs[activeFarmKey ?? "eth"];
