import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BrowserProvider,
  Contract,
  JsonRpcProvider,
  JsonRpcSigner,
  MaxUint256,
  isAddress,
  type Eip1193Provider,
} from "ethers";
import { useAccount, useBalance, useReadContracts, useSwitchChain } from "wagmi";
import { useActiveFarmConfig } from "@/lib/config";
import {
  AERODROME_ROUTER_ABI,
  REWARDS_ABI,
  UNISWAP_V2_PAIR_ABI,
} from "@/lib/abis";
import {
  getLpReadContract,
  getTokenReadContract,
  getTokenWriteContract,
  getV2RouterWriteContract,
  getLpWriteContract,
  getRewardsReadContract,
  getRewardsWriteContract,
} from "@/lib/contracts";
import { formatUnitsSafe, parseInputToUnits, parseInputToUnitsSafe } from "@/lib/format";

export type FarmState = {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  account: string;
  status: string;
  busy: boolean;
  walletLpBalance: bigint;
  walletTokenBalance: bigint;
  walletQuoteTokenBalance: bigint;
  stakedBalance: bigint;
  earnedRewards: bigint;
  rewardRate: bigint;
  periodFinish: bigint;
  allowance: bigint;
  tokenAllowanceToRouter: bigint;
  quoteTokenAllowanceToRouter: bigint;
  lpAllowanceToRouter: bigint;
  totalStaked: bigint;
  pairTotalSupply: bigint;
  pairTokenReserve: bigint;
  pairQuoteReserve: bigint;
  liquidityTokenInput: string;
  liquidityQuoteInput: string;
  removeLiquidityInput: string;
  stakeInput: string;
  withdrawInput: string;
  hasApproval: boolean;
  hasLiquidityTokenApproval: boolean;
  hasLiquidityQuoteApproval: boolean;
  hasRemoveLiquidityApproval: boolean;
  setLiquidityTokenInput: (value: string) => void;
  setLiquidityQuoteInput: (value: string) => void;
  setRemoveLiquidityInput: (value: string) => void;
  setStakeInput: (value: string) => void;
  setWithdrawInput: (value: string) => void;
  refreshData: () => Promise<void>;
  approveTokenForRouter: () => Promise<void>;
  approveQuoteTokenForRouter: () => Promise<void>;
  approveLpForRouter: () => Promise<void>;
  addLiquidity: () => Promise<void>;
  removeLiquidity: () => Promise<void>;
  approveLp: () => Promise<void>;
  stakeLp: () => Promise<void>;
  withdrawLp: () => Promise<void>;
  claimRewards: () => Promise<void>;
  exitFarm: () => Promise<void>;
  fillMaxLiquidityToken: () => void;
  fillMaxLiquidityQuote: () => void;
  fillMaxRemoveLiquidity: () => void;
  fillMaxStake: () => void;
  fillMaxWithdraw: () => void;
};

type LiquidityInputSide = "token" | "quote" | null;

const PUBLIC_RPC_URLS: Record<number, string> = {
  1: "https://ethereum-rpc.publicnode.com",
  8453: "https://mainnet.base.org",
};

export function useFarm(): FarmState {
  const farmConfig = useActiveFarmConfig();
  const { address, connector, chain, isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const lastAutoSwitchAttemptRef = useRef<string | null>(null);
  const rewardsContractReady = isAddress(farmConfig.rewardsContractAddress);
  const pairContractReady = isAddress(farmConfig.v2PoolAddress);
  const {
    data: publicProgramInfoData,
  } = useReadContracts({
    contracts: rewardsContractReady
      ? [
          {
            address: farmConfig.rewardsContractAddress as `0x${string}`,
            abi: REWARDS_ABI,
            chainId: farmConfig.chainId,
            functionName: "rewardRate",
          },
          {
            address: farmConfig.rewardsContractAddress as `0x${string}`,
            abi: REWARDS_ABI,
            chainId: farmConfig.chainId,
            functionName: "periodFinish",
          },
          {
            address: farmConfig.rewardsContractAddress as `0x${string}`,
            abi: REWARDS_ABI,
            chainId: farmConfig.chainId,
            functionName: "totalSupply",
          },
        ]
      : [],
    allowFailure: true,
    query: {
      enabled: rewardsContractReady,
      refetchInterval: 10000,
    },
  });
  const {
    data: publicPairData,
  } = useReadContracts({
    contracts: pairContractReady && farmConfig.dexType !== "aerodrome"
      ? [
          {
            address: farmConfig.v2PoolAddress as `0x${string}`,
            abi: [
              "function totalSupply() view returns (uint256)",
              "function token0() view returns (address)",
              "function token1() view returns (address)",
              "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
            ] as const,
            chainId: farmConfig.chainId,
            functionName: "totalSupply",
          },
          {
            address: farmConfig.v2PoolAddress as `0x${string}`,
            abi: [
              "function totalSupply() view returns (uint256)",
              "function token0() view returns (address)",
              "function token1() view returns (address)",
              "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
            ] as const,
            chainId: farmConfig.chainId,
            functionName: "token0",
          },
          {
            address: farmConfig.v2PoolAddress as `0x${string}`,
            abi: [
              "function totalSupply() view returns (uint256)",
              "function token0() view returns (address)",
              "function token1() view returns (address)",
              "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
            ] as const,
            chainId: farmConfig.chainId,
            functionName: "token1",
          },
          {
            address: farmConfig.v2PoolAddress as `0x${string}`,
            abi: [
              "function totalSupply() view returns (uint256)",
              "function token0() view returns (address)",
              "function token1() view returns (address)",
              "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
            ] as const,
            chainId: farmConfig.chainId,
            functionName: "getReserves",
          },
        ]
      : [],
    allowFailure: true,
    query: {
      enabled: pairContractReady && farmConfig.dexType !== "aerodrome",
      refetchInterval: 10000,
    },
  });
  const { data: walletTokenBalanceData } = useBalance({
    address,
    chainId: farmConfig.chainId,
    token: farmConfig.tokenAddress as `0x${string}`,
    query: {
      enabled: Boolean(address),
      refetchInterval: 10000,
    },
  });
  const { data: walletQuoteTokenBalanceData } = useBalance({
    address,
    chainId: farmConfig.chainId,
    token: farmConfig.quoteTokenAddress as `0x${string}`,
    query: {
      enabled: Boolean(address),
      refetchInterval: 10000,
    },
  });
  const { data: walletLpBalanceData } = useBalance({
    address,
    chainId: farmConfig.chainId,
    token: farmConfig.lpTokenAddress as `0x${string}`,
    query: {
      enabled: Boolean(address),
      refetchInterval: 10000,
    },
  });
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [account, setAccount] = useState("");
  const [status, setStatus] = useState("Connect your wallet to begin.");
  const [busy, setBusy] = useState(false);

  const [walletLpBalance, setWalletLpBalance] = useState(0n);
  const [walletTokenBalance, setWalletTokenBalance] = useState(0n);
  const [walletQuoteTokenBalance, setWalletQuoteTokenBalance] = useState(0n);
  const [stakedBalance, setStakedBalance] = useState(0n);
  const [earnedRewards, setEarnedRewards] = useState(0n);
  const [rewardRate, setRewardRate] = useState(0n);
  const [periodFinish, setPeriodFinish] = useState(0n);
  const [allowance, setAllowance] = useState(0n);
  const [tokenAllowanceToRouter, setTokenAllowanceToRouter] = useState(0n);
  const [quoteTokenAllowanceToRouter, setQuoteTokenAllowanceToRouter] = useState(0n);
  const [lpAllowanceToRouter, setLpAllowanceToRouter] = useState(0n);
  const [totalStaked, setTotalStaked] = useState(0n);
  const [pairTotalSupply, setPairTotalSupply] = useState(0n);
  const [pairTokenReserve, setPairTokenReserve] = useState(0n);
  const [pairQuoteReserve, setPairQuoteReserve] = useState(0n);

  const [liquidityTokenInput, setLiquidityTokenInput] = useState("");
  const [liquidityQuoteInput, setLiquidityQuoteInput] = useState("");
  const [removeLiquidityInput, setRemoveLiquidityInput] = useState("");
  const [stakeInput, setStakeInput] = useState("");
  const [withdrawInput, setWithdrawInput] = useState("");
  const [lastLiquidityInputSide, setLastLiquidityInputSide] =
    useState<LiquidityInputSide>(null);

  const rewardsRead = useMemo(
    () => (provider ? getRewardsReadContract(farmConfig, provider) : null),
    [farmConfig, provider],
  );
  const lpRead = useMemo(
    () => (provider ? getLpReadContract(farmConfig, provider) : null),
    [farmConfig, provider],
  );
  const tokenRead = useMemo(
    () => (provider ? getTokenReadContract(farmConfig.tokenAddress, provider) : null),
    [farmConfig.tokenAddress, provider],
  );
  const quoteTokenRead = useMemo(
    () => (provider ? getTokenReadContract(farmConfig.quoteTokenAddress, provider) : null),
    [farmConfig.quoteTokenAddress, provider],
  );
  const rewardsWrite = useMemo(
    () => (signer ? getRewardsWriteContract(farmConfig, signer) : null),
    [farmConfig, signer],
  );
  const lpWrite = useMemo(
    () => (signer ? getLpWriteContract(farmConfig, signer) : null),
    [farmConfig, signer],
  );
  const tokenWrite = useMemo(
    () => (signer ? getTokenWriteContract(farmConfig.tokenAddress, signer) : null),
    [farmConfig.tokenAddress, signer],
  );
  const quoteTokenWrite = useMemo(
    () => (signer ? getTokenWriteContract(farmConfig.quoteTokenAddress, signer) : null),
    [farmConfig.quoteTokenAddress, signer],
  );
  const v2RouterWrite = useMemo(
    () => (signer ? getV2RouterWriteContract(farmConfig, signer) : null),
    [farmConfig, signer],
  );
  const publicReadProvider = useMemo(() => {
    const rpcUrl = PUBLIC_RPC_URLS[farmConfig.chainId];
    return rpcUrl ? new JsonRpcProvider(rpcUrl) : null;
  }, [farmConfig.chainId]);

  const refreshPublicLiquidityData = useCallback(async () => {
    if (!publicReadProvider) {
      return;
    }

    try {
      if (farmConfig.dexType === "aerodrome") {
        const router = new Contract(
          farmConfig.v2RouterAddress,
          AERODROME_ROUTER_ABI,
          publicReadProvider,
        );
        const pair = new Contract(farmConfig.v2PoolAddress, UNISWAP_V2_PAIR_ABI, publicReadProvider);
        const factory = await router.defaultFactory();
        const reserves = await router.getReserves(
          farmConfig.tokenAddress,
          farmConfig.quoteTokenAddress,
          farmConfig.isStablePool,
          factory,
        );

        setPairTokenReserve(reserves[0] as bigint);
        setPairQuoteReserve(reserves[1] as bigint);

        try {
          const [token0, token1, pairReserves] = await Promise.all([
            pair.token0(),
            pair.token1(),
            pair.getReserves(),
          ]);
          const token0Address = String(token0).toLowerCase();
          const token1Address = String(token1).toLowerCase();
          const tokenAddress = farmConfig.tokenAddress.toLowerCase();
          const quoteTokenAddress = farmConfig.quoteTokenAddress.toLowerCase();

          if (token0Address === tokenAddress && token1Address === quoteTokenAddress) {
            setPairTokenReserve((pairReserves as [bigint, bigint, number])[0]);
            setPairQuoteReserve((pairReserves as [bigint, bigint, number])[1]);
          } else if (token0Address === quoteTokenAddress && token1Address === tokenAddress) {
            setPairTokenReserve((pairReserves as [bigint, bigint, number])[1]);
            setPairQuoteReserve((pairReserves as [bigint, bigint, number])[0]);
          }
        } catch {
          // The router reserves above are enough to quote liquidity.
        }

        return;
      }

      const pair = new Contract(farmConfig.v2PoolAddress, UNISWAP_V2_PAIR_ABI, publicReadProvider);
      const [totalSupply, token0, token1, reserves] = await Promise.all([
        pair.totalSupply(),
        pair.token0(),
        pair.token1(),
        pair.getReserves(),
      ]);
      const token0Address = String(token0).toLowerCase();
      const token1Address = String(token1).toLowerCase();
      const tokenAddress = farmConfig.tokenAddress.toLowerCase();
      const quoteTokenAddress = farmConfig.quoteTokenAddress.toLowerCase();

      setPairTotalSupply(totalSupply as bigint);

      if (token0Address === tokenAddress && token1Address === quoteTokenAddress) {
        setPairTokenReserve((reserves as [bigint, bigint, number])[0]);
        setPairQuoteReserve((reserves as [bigint, bigint, number])[1]);
      } else if (token0Address === quoteTokenAddress && token1Address === tokenAddress) {
        setPairTokenReserve((reserves as [bigint, bigint, number])[1]);
        setPairQuoteReserve((reserves as [bigint, bigint, number])[0]);
      }
    } catch {
      // Leave current reserves in place if public quoting refresh fails.
    }
  }, [farmConfig, publicReadProvider]);

  const refreshData = useCallback(async () => {
    if (!provider || !rewardsRead || !lpRead || !tokenRead || !quoteTokenRead || !account) {
      return;
    }

    try {
      const [
        walletLpBalanceResult,
        walletTokenBalanceResult,
        walletQuoteTokenBalanceResult,
        stakedBalanceResult,
        earnedResult,
        rewardRateResult,
        periodFinishResult,
        allowanceResult,
        tokenAllowanceToRouterResult,
        quoteTokenAllowanceToRouterResult,
        lpAllowanceToRouterResult,
        totalStakedResult,
      ] = await Promise.allSettled([
        lpRead.balanceOf(account),
        tokenRead.balanceOf(account),
        quoteTokenRead.balanceOf(account),
        rewardsRead.balanceOf(account),
        rewardsRead.earned(account),
        rewardsRead.rewardRate(),
        rewardsRead.periodFinish(),
        lpRead.allowance(account, farmConfig.rewardsContractAddress),
        tokenRead.allowance(account, farmConfig.v2RouterAddress),
        quoteTokenRead.allowance(account, farmConfig.v2RouterAddress),
        lpRead.allowance(account, farmConfig.v2RouterAddress),
        rewardsRead.totalSupply(),
      ]);

      if (walletLpBalanceResult.status === "fulfilled" && !walletLpBalanceData) {
        setWalletLpBalance(walletLpBalanceResult.value as bigint);
      }

      if (walletTokenBalanceResult.status === "fulfilled" && !walletTokenBalanceData) {
        setWalletTokenBalance(walletTokenBalanceResult.value as bigint);
      }

      if (
        walletQuoteTokenBalanceResult.status === "fulfilled" &&
        !walletQuoteTokenBalanceData
      ) {
        setWalletQuoteTokenBalance(walletQuoteTokenBalanceResult.value as bigint);
      }

      if (stakedBalanceResult.status === "fulfilled") {
        setStakedBalance(stakedBalanceResult.value as bigint);
      }

      if (earnedResult.status === "fulfilled") {
        setEarnedRewards(earnedResult.value as bigint);
      }

      if (rewardRateResult.status === "fulfilled") {
        setRewardRate(rewardRateResult.value as bigint);
      }

      if (periodFinishResult.status === "fulfilled") {
        setPeriodFinish(periodFinishResult.value as bigint);
      }

      if (allowanceResult.status === "fulfilled") {
        setAllowance(allowanceResult.value as bigint);
      }

      if (tokenAllowanceToRouterResult.status === "fulfilled") {
        setTokenAllowanceToRouter(tokenAllowanceToRouterResult.value as bigint);
      }

      if (quoteTokenAllowanceToRouterResult.status === "fulfilled") {
        setQuoteTokenAllowanceToRouter(quoteTokenAllowanceToRouterResult.value as bigint);
      }

      if (lpAllowanceToRouterResult.status === "fulfilled") {
        setLpAllowanceToRouter(lpAllowanceToRouterResult.value as bigint);
      }

      if (totalStakedResult.status === "fulfilled") {
        setTotalStaked(totalStakedResult.value as bigint);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to refresh contract data.";
      setStatus(message);
    }
  }, [
    account,
    farmConfig.rewardsContractAddress,
    farmConfig.v2RouterAddress,
    lpRead,
    provider,
    quoteTokenRead,
    rewardsRead,
    tokenRead,
    walletLpBalanceData,
    walletQuoteTokenBalanceData,
    walletTokenBalanceData,
  ]);

  useEffect(() => {
    setWalletLpBalance(0n);
    setWalletTokenBalance(0n);
    setWalletQuoteTokenBalance(0n);
    setStakedBalance(0n);
    setEarnedRewards(0n);
    setRewardRate(0n);
    setPeriodFinish(0n);
    setAllowance(0n);
    setTokenAllowanceToRouter(0n);
    setQuoteTokenAllowanceToRouter(0n);
    setLpAllowanceToRouter(0n);
    setTotalStaked(0n);
    setPairTotalSupply(0n);
    setPairTokenReserve(0n);
    setPairQuoteReserve(0n);
    setLiquidityTokenInput("");
    setLiquidityQuoteInput("");
    setRemoveLiquidityInput("");
    setStakeInput("");
    setWithdrawInput("");
    setLastLiquidityInputSide(null);
  }, [farmConfig.key]);

  useEffect(() => {
    if (!publicProgramInfoData?.length) {
      return;
    }

    const [rewardRateResult, periodFinishResult, totalStakedResult] = publicProgramInfoData;

    if (rewardRateResult?.status === "success" && typeof rewardRateResult.result === "bigint") {
      setRewardRate(rewardRateResult.result);
    }

    if (
      periodFinishResult?.status === "success" &&
      typeof periodFinishResult.result === "bigint"
    ) {
      setPeriodFinish(periodFinishResult.result);
    }

    if (
      totalStakedResult?.status === "success" &&
      typeof totalStakedResult.result === "bigint"
    ) {
      setTotalStaked(totalStakedResult.result);
    }
  }, [publicProgramInfoData]);

  useEffect(() => {
    if (!publicPairData?.length) {
      return;
    }

    const [pairTotalSupplyResult, pairToken0Result, pairToken1Result, pairReservesResult] =
      publicPairData;

    if (
      pairTotalSupplyResult?.status === "success" &&
      typeof pairTotalSupplyResult.result === "bigint"
    ) {
      setPairTotalSupply(pairTotalSupplyResult.result);
    }

    if (farmConfig.dexType === "aerodrome") {
      return;
    }

    if (
      pairToken0Result?.status === "success" &&
      pairToken1Result?.status === "success" &&
      pairReservesResult?.status === "success"
    ) {
      const token0Address = String(pairToken0Result.result).toLowerCase();
      const token1Address = String(pairToken1Result.result).toLowerCase();
      const tokenAddress = farmConfig.tokenAddress.toLowerCase();
      const quoteTokenAddress = farmConfig.quoteTokenAddress.toLowerCase();
      const reserves = pairReservesResult.result as [bigint, bigint, number];

      if (token0Address === tokenAddress && token1Address === quoteTokenAddress) {
        setPairTokenReserve(reserves[0]);
        setPairQuoteReserve(reserves[1]);
      } else if (token0Address === quoteTokenAddress && token1Address === tokenAddress) {
        setPairTokenReserve(reserves[1]);
        setPairQuoteReserve(reserves[0]);
      } else {
        setPairTokenReserve(0n);
        setPairQuoteReserve(0n);
        setStatus("Configured pair does not match the MBTC/USDC token addresses.");
      }
      return;
    }

    setPairTokenReserve(0n);
    setPairQuoteReserve(0n);
  }, [
    farmConfig.dexType,
    farmConfig.quoteTokenAddress,
    farmConfig.tokenAddress,
    publicPairData,
  ]);

  useEffect(() => {
    void refreshPublicLiquidityData();

    const interval = window.setInterval(() => {
      void refreshPublicLiquidityData();
    }, 10000);

    return () => window.clearInterval(interval);
  }, [refreshPublicLiquidityData]);

  useEffect(() => {
    if (walletTokenBalanceData?.value != null) {
      setWalletTokenBalance(walletTokenBalanceData.value);
    }
  }, [walletTokenBalanceData?.value]);

  useEffect(() => {
    if (walletQuoteTokenBalanceData?.value != null) {
      setWalletQuoteTokenBalance(walletQuoteTokenBalanceData.value);
    }
  }, [walletQuoteTokenBalanceData?.value]);

  useEffect(() => {
    if (walletLpBalanceData?.value != null) {
      setWalletLpBalance(walletLpBalanceData.value);
    }
  }, [walletLpBalanceData?.value]);

  const quoteFromTokenInput = useCallback((value: string) => {
    const amountIn = parseInputToUnitsSafe(value, farmConfig.tokenDecimals);
    if (!value.trim() || amountIn <= 0n || pairTokenReserve <= 0n || pairQuoteReserve <= 0n) {
      return "";
    }

    const quotedAmount = (amountIn * pairQuoteReserve) / pairTokenReserve;
    return formatUnitsSafe(quotedAmount, farmConfig.quoteTokenDecimals, 8);
  }, [farmConfig.quoteTokenDecimals, farmConfig.tokenDecimals, pairQuoteReserve, pairTokenReserve]);

  const tokenFromQuoteInput = useCallback((value: string) => {
    const amountIn = parseInputToUnitsSafe(value, farmConfig.quoteTokenDecimals);
    if (!value.trim() || amountIn <= 0n || pairTokenReserve <= 0n || pairQuoteReserve <= 0n) {
      return "";
    }

    const quotedAmount = (amountIn * pairTokenReserve) / pairQuoteReserve;
    return formatUnitsSafe(quotedAmount, farmConfig.tokenDecimals, 8);
  }, [farmConfig.quoteTokenDecimals, farmConfig.tokenDecimals, pairQuoteReserve, pairTokenReserve]);

  const handleLiquidityTokenInput = useCallback((value: string) => {
    setLastLiquidityInputSide("token");
    setLiquidityTokenInput(value);
    setLiquidityQuoteInput(quoteFromTokenInput(value));
  }, [quoteFromTokenInput]);

  const handleLiquidityQuoteInput = useCallback((value: string) => {
    setLastLiquidityInputSide("quote");
    setLiquidityQuoteInput(value);
    setLiquidityTokenInput(tokenFromQuoteInput(value));
  }, [tokenFromQuoteInput]);

  const ensureCorrectNetwork = useCallback(async () => {
    if ((chain?.id ?? farmConfig.chainId) === farmConfig.chainId) {
      return true;
    }

    try {
      setStatus(`Switching wallet to ${farmConfig.chainName}...`);
      await switchChainAsync({ chainId: farmConfig.chainId });
      setStatus(`Wallet switched to ${farmConfig.chainName}. Retry your action.`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `Wrong network. Please switch to ${farmConfig.chainName}.`;
      setStatus(message);
    }

    return false;
  }, [chain?.id, farmConfig.chainId, farmConfig.chainName, switchChainAsync]);

  useEffect(() => {
    if (lastLiquidityInputSide === "token") {
      const nextQuoteValue = quoteFromTokenInput(liquidityTokenInput);
      if (nextQuoteValue !== liquidityQuoteInput) {
        setLiquidityQuoteInput(nextQuoteValue);
      }
      return;
    }

    if (lastLiquidityInputSide === "quote") {
      const nextTokenValue = tokenFromQuoteInput(liquidityQuoteInput);
      if (nextTokenValue !== liquidityTokenInput) {
        setLiquidityTokenInput(nextTokenValue);
      }
    }
  }, [
    lastLiquidityInputSide,
    liquidityQuoteInput,
    liquidityTokenInput,
    quoteFromTokenInput,
    tokenFromQuoteInput,
  ]);

  const approveLp = useCallback(async () => {
    if (!lpWrite) {
      setStatus("Connect wallet first.");
      return;
    }

    if (!(await ensureCorrectNetwork())) {
      return;
    }

    try {
      setBusy(true);
      setStatus("Sending LP approval...");
      const tx = await lpWrite.approve(farmConfig.rewardsContractAddress, MaxUint256);
      await tx.wait();
      setStatus("LP approval confirmed.");
      await refreshData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "LP approval failed.";
      setStatus(message);
    } finally {
      setBusy(false);
    }
  }, [ensureCorrectNetwork, lpWrite, refreshData]);

  const approveTokenForRouter = useCallback(async () => {
    if (!tokenWrite) {
      setStatus("Connect wallet first.");
      return;
    }

    if (!(await ensureCorrectNetwork())) {
      return;
    }

    try {
      setBusy(true);
      setStatus(`Approving ${farmConfig.tokenSymbol} for the V2 router...`);
      const tx = await tokenWrite.approve(farmConfig.v2RouterAddress, MaxUint256);
      await tx.wait();
      setStatus(`${farmConfig.tokenSymbol} approval confirmed.`);
      await refreshData();
    } catch (error) {
      const message = error instanceof Error ? error.message : `${farmConfig.tokenSymbol} approval failed.`;
      setStatus(message);
    } finally {
      setBusy(false);
    }
  }, [ensureCorrectNetwork, refreshData, tokenWrite]);

  const approveQuoteTokenForRouter = useCallback(async () => {
    if (!quoteTokenWrite) {
      setStatus("Connect wallet first.");
      return;
    }

    if (!(await ensureCorrectNetwork())) {
      return;
    }

    try {
      setBusy(true);
      setStatus(`Approving ${farmConfig.quoteTokenSymbol} for the V2 router...`);
      const tx = await quoteTokenWrite.approve(farmConfig.v2RouterAddress, MaxUint256);
      await tx.wait();
      setStatus(`${farmConfig.quoteTokenSymbol} approval confirmed.`);
      await refreshData();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `${farmConfig.quoteTokenSymbol} approval failed.`;
      setStatus(message);
    } finally {
      setBusy(false);
    }
  }, [ensureCorrectNetwork, quoteTokenWrite, refreshData]);

  const approveLpForRouter = useCallback(async () => {
    if (!lpWrite) {
      setStatus("Connect wallet first.");
      return;
    }

    if (!(await ensureCorrectNetwork())) {
      return;
    }

    try {
      setBusy(true);
      setStatus(`Approving ${farmConfig.lpSymbol} for the V2 router...`);
      const tx = await lpWrite.approve(farmConfig.v2RouterAddress, MaxUint256);
      await tx.wait();
      setStatus(`${farmConfig.lpSymbol} router approval confirmed.`);
      await refreshData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "LP router approval failed.";
      setStatus(message);
    } finally {
      setBusy(false);
    }
  }, [ensureCorrectNetwork, lpWrite, refreshData]);

  const addLiquidity = useCallback(async () => {
    if (!v2RouterWrite) {
      setStatus("Connect wallet first.");
      return;
    }

    if (!(await ensureCorrectNetwork())) {
      return;
    }

    try {
      const amountTokenDesired = parseInputToUnits(
        liquidityTokenInput,
        farmConfig.tokenDecimals,
      );
      const amountQuoteDesired = parseInputToUnits(
        liquidityQuoteInput,
        farmConfig.quoteTokenDecimals,
      );

      if (amountTokenDesired <= 0n || amountQuoteDesired <= 0n) {
        setStatus(
          `Enter valid ${farmConfig.tokenSymbol} and ${farmConfig.quoteTokenSymbol} amounts.`,
        );
        return;
      }

      const slippageBps = BigInt(farmConfig.liquiditySlippageBps);
      const amountTokenMin = (amountTokenDesired * (10000n - slippageBps)) / 10000n;
      const amountQuoteMin = (amountQuoteDesired * (10000n - slippageBps)) / 10000n;
      const deadline =
        BigInt(Math.floor(Date.now() / 1000)) +
        BigInt(farmConfig.liquidityDeadlineMinutes * 60);

      setBusy(true);
      setStatus(
        `Adding ${farmConfig.tokenSymbol}/${farmConfig.quoteTokenSymbol} liquidity...`,
      );

      const tx =
        farmConfig.dexType === "aerodrome"
          ? await v2RouterWrite.addLiquidity(
              farmConfig.tokenAddress,
              farmConfig.quoteTokenAddress,
              farmConfig.isStablePool,
              amountTokenDesired,
              amountQuoteDesired,
              amountTokenMin,
              amountQuoteMin,
              account,
              deadline,
            )
          : await v2RouterWrite.addLiquidity(
              farmConfig.tokenAddress,
              farmConfig.quoteTokenAddress,
              amountTokenDesired,
              amountQuoteDesired,
              amountTokenMin,
              amountQuoteMin,
              account,
              deadline,
            );

      await tx.wait();
      setStatus("Liquidity added. Your LP tokens are ready to stake.");
      setLastLiquidityInputSide(null);
      setLiquidityTokenInput("");
      setLiquidityQuoteInput("");
      await refreshData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Add liquidity failed.";
      setStatus(message);
    } finally {
      setBusy(false);
    }
  }, [account, ensureCorrectNetwork, liquidityQuoteInput, liquidityTokenInput, refreshData, v2RouterWrite]);

  const removeLiquidity = useCallback(async () => {
    if (!v2RouterWrite) {
      setStatus("Connect wallet first.");
      return;
    }

    if (!(await ensureCorrectNetwork())) {
      return;
    }

    try {
      const liquidity = parseInputToUnits(removeLiquidityInput, farmConfig.lpDecimals);

      if (liquidity <= 0n) {
        setStatus("Enter a valid LP amount to remove.");
        return;
      }

      const slippageBps = BigInt(farmConfig.liquiditySlippageBps);
      let amountTokenMin = 0n;
      let amountQuoteMin = 0n;

      if (pairTotalSupply > 0n && pairTokenReserve > 0n && pairQuoteReserve > 0n) {
        const expectedTokenOut = (liquidity * pairTokenReserve) / pairTotalSupply;
        const expectedQuoteOut = (liquidity * pairQuoteReserve) / pairTotalSupply;
        amountTokenMin = (expectedTokenOut * (10000n - slippageBps)) / 10000n;
        amountQuoteMin = (expectedQuoteOut * (10000n - slippageBps)) / 10000n;
      }

      const deadline =
        BigInt(Math.floor(Date.now() / 1000)) +
        BigInt(farmConfig.liquidityDeadlineMinutes * 60);

      setBusy(true);
      setStatus(`Removing ${farmConfig.lpSymbol} liquidity...`);

      const tx =
        farmConfig.dexType === "aerodrome"
          ? await v2RouterWrite.removeLiquidity(
              farmConfig.tokenAddress,
              farmConfig.quoteTokenAddress,
              farmConfig.isStablePool,
              liquidity,
              amountTokenMin,
              amountQuoteMin,
              account,
              deadline,
            )
          : await v2RouterWrite.removeLiquidity(
              farmConfig.tokenAddress,
              farmConfig.quoteTokenAddress,
              liquidity,
              amountTokenMin,
              amountQuoteMin,
              account,
              deadline,
            );

      await tx.wait();
      setStatus(`Liquidity removed. ${farmConfig.tokenSymbol} and ${farmConfig.quoteTokenSymbol} returned to your wallet.`);
      setRemoveLiquidityInput("");
      await refreshData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Remove liquidity failed.";
      setStatus(message);
    } finally {
      setBusy(false);
    }
  }, [
    account,
    pairTotalSupply,
    pairQuoteReserve,
    pairTokenReserve,
    refreshData,
    removeLiquidityInput,
    ensureCorrectNetwork,
    v2RouterWrite,
  ]);

  const stakeLp = useCallback(async () => {
    if (!rewardsWrite) {
      setStatus("Connect wallet first.");
      return;
    }

    if (!(await ensureCorrectNetwork())) {
      return;
    }

    try {
      const amount = parseInputToUnits(stakeInput, farmConfig.lpDecimals);

      if (amount <= 0n) {
        setStatus("Enter a valid LP amount to stake.");
        return;
      }

      setBusy(true);
      setStatus("Submitting stake transaction...");
      const tx = await rewardsWrite.stake(amount);
      await tx.wait();
      setStatus("Stake confirmed.");
      setStakeInput("");
      await refreshData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Stake failed.";
      setStatus(message);
    } finally {
      setBusy(false);
    }
  }, [ensureCorrectNetwork, refreshData, rewardsWrite, stakeInput]);

  const withdrawLp = useCallback(async () => {
    if (!rewardsWrite) {
      setStatus("Connect wallet first.");
      return;
    }

    if (!(await ensureCorrectNetwork())) {
      return;
    }

    try {
      const amount = parseInputToUnits(withdrawInput, farmConfig.lpDecimals);

      if (amount <= 0n) {
        setStatus("Enter a valid LP amount to withdraw.");
        return;
      }

      setBusy(true);
      setStatus("Submitting withdraw transaction...");
      const tx = await rewardsWrite.withdraw(amount);
      await tx.wait();
      setStatus("Withdraw confirmed.");
      setWithdrawInput("");
      await refreshData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Withdraw failed.";
      setStatus(message);
    } finally {
      setBusy(false);
    }
  }, [ensureCorrectNetwork, refreshData, rewardsWrite, withdrawInput]);

  const claimRewards = useCallback(async () => {
    if (!rewardsWrite) {
      setStatus("Connect wallet first.");
      return;
    }

    if (!(await ensureCorrectNetwork())) {
      return;
    }

    try {
      setBusy(true);
      setStatus(`Claiming ${farmConfig.tokenSymbol} rewards...`);
      const tx = await rewardsWrite.getReward();
      await tx.wait();
      setStatus("Rewards claimed.");
      await refreshData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Claim failed.";
      setStatus(message);
    } finally {
      setBusy(false);
    }
  }, [ensureCorrectNetwork, refreshData, rewardsWrite]);

  const exitFarm = useCallback(async () => {
    if (!rewardsWrite) {
      setStatus("Connect wallet first.");
      return;
    }

    if (!(await ensureCorrectNetwork())) {
      return;
    }

    try {
      setBusy(true);
      setStatus("Exiting farm: withdrawing LP and claiming rewards...");
      const tx = await rewardsWrite.exit();
      await tx.wait();
      setStatus("Exit confirmed.");
      await refreshData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Exit failed.";
      setStatus(message);
    } finally {
      setBusy(false);
    }
  }, [ensureCorrectNetwork, refreshData, rewardsWrite]);

  const fillMaxStake = useCallback(() => {
    setStakeInput(formatUnitsSafe(walletLpBalance, farmConfig.lpDecimals, 8));
  }, [farmConfig.lpDecimals, walletLpBalance]);

  const fillMaxWithdraw = useCallback(() => {
    setWithdrawInput(formatUnitsSafe(stakedBalance, farmConfig.lpDecimals, 8));
  }, [farmConfig.lpDecimals, stakedBalance]);

  const fillMaxLiquidityToken = useCallback(() => {
    const nextValue = formatUnitsSafe(walletTokenBalance, farmConfig.tokenDecimals, 8);
    setLastLiquidityInputSide("token");
    setLiquidityTokenInput(nextValue);
    setLiquidityQuoteInput(quoteFromTokenInput(nextValue));
  }, [farmConfig.tokenDecimals, quoteFromTokenInput, walletTokenBalance]);

  const fillMaxLiquidityQuote = useCallback(() => {
    const nextValue = formatUnitsSafe(walletQuoteTokenBalance, farmConfig.quoteTokenDecimals, 8);
    setLastLiquidityInputSide("quote");
    setLiquidityQuoteInput(nextValue);
    setLiquidityTokenInput(tokenFromQuoteInput(nextValue));
  }, [farmConfig.quoteTokenDecimals, tokenFromQuoteInput, walletQuoteTokenBalance]);

  const fillMaxRemoveLiquidity = useCallback(() => {
    setRemoveLiquidityInput(formatUnitsSafe(walletLpBalance, farmConfig.lpDecimals, 8));
  }, [farmConfig.lpDecimals, walletLpBalance]);

  useEffect(() => {
    if (!account) {
      return;
    }

    void refreshData();

    const interval = window.setInterval(() => {
      void refreshData();
    }, 10000);

    return () => window.clearInterval(interval);
  }, [account, refreshData]);

  useEffect(() => {
    if (!isConnected || !address) {
      lastAutoSwitchAttemptRef.current = null;
      return;
    }

    if ((chain?.id ?? farmConfig.chainId) === farmConfig.chainId) {
      lastAutoSwitchAttemptRef.current = null;
      return;
    }

    const attemptKey = `${address}:${farmConfig.chainId}`;
    if (lastAutoSwitchAttemptRef.current === attemptKey) {
      return;
    }

    lastAutoSwitchAttemptRef.current = attemptKey;

    void switchChainAsync({ chainId: farmConfig.chainId }).catch((error) => {
      const message =
        error instanceof Error
          ? error.message
          : `Wrong network. Please switch to ${farmConfig.chainName}.`;
      setStatus(message);
    });
  }, [address, chain?.id, farmConfig.chainId, farmConfig.chainName, isConnected, switchChainAsync]);

  useEffect(() => {
    if (!isConnected || !connector || !address) {
      setAccount("");
      setSigner(null);
      setProvider(null);
      setStatus("Connect your wallet to begin.");
      return;
    }

    let cancelled = false;
    const activeConnector = connector;
    const activeAddress = address;

    async function syncWallet() {
      try {
        const walletProvider = (await activeConnector.getProvider()) as
          | Eip1193Provider
          | undefined;

        if (!walletProvider) {
          if (!cancelled) {
            setStatus("Wallet provider unavailable.");
          }
          return;
        }

        const browserProvider = new BrowserProvider(walletProvider);
        const nextSigner = await browserProvider.getSigner(activeAddress);

        if (cancelled) {
          return;
        }

        setProvider(browserProvider);
        setSigner(nextSigner);
        setAccount(activeAddress);

        if ((chain?.id ?? farmConfig.chainId) !== farmConfig.chainId) {
          setStatus(`Wrong network. Please switch to ${farmConfig.chainName}.`);
        } else {
          setStatus("Wallet connected.");
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : "Failed to initialize wallet.";
          setStatus(message);
        }
      }
    }

    void syncWallet();

    return () => {
      cancelled = true;
    };
  }, [address, chain?.id, connector, farmConfig.chainId, farmConfig.chainName, isConnected]);

  const hasApproval = allowance > 0n;
  const requiredTokenApproval = parseInputToUnitsSafe(
    liquidityTokenInput || "0",
    farmConfig.tokenDecimals,
  );
  const requiredQuoteApproval = parseInputToUnitsSafe(
    liquidityQuoteInput || "0",
    farmConfig.quoteTokenDecimals,
  );
  const requiredRemoveLiquidityApproval = parseInputToUnitsSafe(
    removeLiquidityInput || "0",
    farmConfig.lpDecimals,
  );
  const hasLiquidityTokenApproval =
    requiredTokenApproval === 0n || tokenAllowanceToRouter >= requiredTokenApproval;
  const hasLiquidityQuoteApproval =
    requiredQuoteApproval === 0n || quoteTokenAllowanceToRouter >= requiredQuoteApproval;
  const hasRemoveLiquidityApproval =
    lpAllowanceToRouter > 0n &&
    (requiredRemoveLiquidityApproval === 0n ||
      lpAllowanceToRouter >= requiredRemoveLiquidityApproval);

  return {
    provider,
    signer,
    account,
    status,
    busy,
    walletLpBalance,
    walletTokenBalance,
    walletQuoteTokenBalance,
    stakedBalance,
    earnedRewards,
    rewardRate,
    periodFinish,
    allowance,
    tokenAllowanceToRouter,
    quoteTokenAllowanceToRouter,
    lpAllowanceToRouter,
    totalStaked,
    pairTotalSupply,
    pairTokenReserve,
    pairQuoteReserve,
    liquidityTokenInput,
    liquidityQuoteInput,
    removeLiquidityInput,
    stakeInput,
    withdrawInput,
    hasApproval,
    hasLiquidityTokenApproval,
    hasLiquidityQuoteApproval,
    hasRemoveLiquidityApproval,
    setLiquidityTokenInput: handleLiquidityTokenInput,
    setLiquidityQuoteInput: handleLiquidityQuoteInput,
    setRemoveLiquidityInput,
    setStakeInput,
    setWithdrawInput,
    refreshData,
    approveTokenForRouter,
    approveQuoteTokenForRouter,
    approveLpForRouter,
    addLiquidity,
    removeLiquidity,
    approveLp,
    stakeLp,
    withdrawLp,
    claimRewards,
    exitFarm,
    fillMaxLiquidityToken,
    fillMaxLiquidityQuote,
    fillMaxRemoveLiquidity,
    fillMaxStake,
    fillMaxWithdraw,
  };
}
