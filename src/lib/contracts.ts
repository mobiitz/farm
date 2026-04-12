import { Contract, type BrowserProvider, type JsonRpcSigner } from "ethers";
import {
  AERODROME_ROUTER_ABI,
  ERC20_ABI,
  REWARDS_ABI,
  UNISWAP_V2_PAIR_ABI,
  UNISWAP_V2_ROUTER_ABI,
} from "@/lib/abis";
import type { FarmConfig } from "@/lib/config";

export function getRewardsReadContract(farmConfig: FarmConfig, provider: BrowserProvider) {
  return new Contract(farmConfig.rewardsContractAddress, REWARDS_ABI, provider);
}

export function getLpReadContract(farmConfig: FarmConfig, provider: BrowserProvider) {
  return new Contract(farmConfig.lpTokenAddress, ERC20_ABI, provider);
}

export function getTokenReadContract(address: string, provider: BrowserProvider) {
  return new Contract(address, ERC20_ABI, provider);
}

export function getV2PairReadContract(farmConfig: FarmConfig, provider: BrowserProvider) {
  return new Contract(farmConfig.v2PoolAddress, UNISWAP_V2_PAIR_ABI, provider);
}

export function getRewardsWriteContract(farmConfig: FarmConfig, signer: JsonRpcSigner) {
  return new Contract(farmConfig.rewardsContractAddress, REWARDS_ABI, signer);
}

export function getLpWriteContract(farmConfig: FarmConfig, signer: JsonRpcSigner) {
  return new Contract(farmConfig.lpTokenAddress, ERC20_ABI, signer);
}

export function getTokenWriteContract(address: string, signer: JsonRpcSigner) {
  return new Contract(address, ERC20_ABI, signer);
}

export function getV2RouterWriteContract(farmConfig: FarmConfig, signer: JsonRpcSigner) {
  const routerAbi =
    farmConfig.dexType === "aerodrome" ? AERODROME_ROUTER_ABI : UNISWAP_V2_ROUTER_ABI;

  return new Contract(farmConfig.v2RouterAddress, routerAbi, signer);
}
