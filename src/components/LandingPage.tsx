import type { CSSProperties } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  Coins,
  Globe2,
  Layers3,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import {
  farmConfigs,
  getAssetHref,
  getRouteHref,
} from "@/lib/config";

function cardThemeStyle(accent: string, glow: string): CSSProperties {
  return {
    "--card-accent": accent,
    "--card-glow": glow,
  } as CSSProperties;
}

export function LandingPage() {
  const logoSrc = getAssetHref("MBTC_light.png");
  const ethereumHref = getRouteHref(farmConfigs.eth.routeSegment);
  const baseHref = getRouteHref(farmConfigs.base.routeSegment);

  return (
    <div className="min-h-screen min-h-[calc(var(--app-height,1vh)*100)] overflow-x-hidden bg-[#020617] px-4 py-6 text-slate-50 sm:px-6 sm:py-8 md:px-10 md:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.12),transparent_28%),linear-gradient(180deg,#08111f_0%,#020617_100%)]" />
      <div className="pointer-events-none absolute left-[8%] top-20 h-48 w-48 rounded-full bg-[#6da8ff]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-24 right-[10%] h-56 w-56 rounded-full bg-[#0a4ecb]/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-8">
        <motion.div
          className="overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-950/70 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.55)] backdrop-blur sm:p-8 md:p-10"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div className="grid gap-6">
              <div className="relative grid w-full max-w-md gap-6 overflow-hidden rounded-[1.75rem] border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.92)_0%,rgba(2,6,23,0.96)_100%)] p-6 shadow-[0_20px_50px_rgba(2,6,23,0.4)] sm:p-7">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(109,168,255,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_30%)]" />
                <div className="relative flex items-center justify-between gap-4">
                  <img
                    src={logoSrc}
                    alt="MAGA Bitcoin logo"
                    className="h-16 w-auto rounded-xl object-contain sm:h-20"
                  />
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-right">
                    <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                      Ecosystem
                    </div>
                    <div className="mt-1 text-sm font-medium text-slate-100">Ethereum + Base</div>
                  </div>
                </div>
                <div className="relative grid gap-3 text-sm text-slate-300">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-slate-300">
                    <Sparkles className="h-3.5 w-3.5 text-[#9cc3ff]" />
                    Network Selector
                  </div>
                  <p className="max-w-sm leading-7">
                    Pick the chain, enter the farm, and move directly into liquidity, staking,
                    rewards, and wallet actions.
                  </p>
                </div>
                <div className="relative grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      Farms
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-white">2</div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      Liquidity
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-white">V2</div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      Token
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-white">MBTC</div>
                  </div>
                </div>
              </div>
              <div className="grid gap-3">
                <h1 className="max-w-3xl font-['Space_Grotesk'] text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
                  One MBTC ecosystem, two live liquidity routes.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  Enter the original MBTC Ethereum farm, or the new Base deployment for MBTC on
                  Coinbase&apos;s Base Network
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/65 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    Wallet Ready
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Connect, approve, and stake from the same interface.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/65 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                    <Waves className="h-4 w-4 text-sky-400" />
                    LP Focused
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Add liquidity, stake LP, withdraw, and claim rewards.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/65 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                    <Globe2 className="h-4 w-4 text-[#9cc3ff]" />
                    Cross-Network
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Separate addresses and config for Ethereum and Base.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card
                  className="group relative overflow-hidden border-[color:var(--card-accent)]/30 bg-slate-950/85 shadow-[0_18px_50px_rgba(8,20,38,0.4)]"
                  style={cardThemeStyle("#6da8ff", "rgba(109,168,255,0.32)")}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--card-glow),transparent_42%),linear-gradient(180deg,rgba(8,20,38,0.84)_0%,rgba(2,6,23,0.98)_100%)]" />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6da8ff]/60 to-transparent" />
                  <CardContent className="relative grid gap-6 p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-[#6da8ff]/30 bg-[#6da8ff]/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-[#dbeafe]">
                          Ethereum
                        </span>
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                          </span>
                          Live Farm
                        </div>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-[#9cc3ff]" />
                    </div>
                    <div className="grid gap-3">
                      <h2 className="font-['Space_Grotesk'] text-3xl font-semibold tracking-tight text-white">
                        MBTC on Ethereum
                      </h2>
                      <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                        This Farm is for the MBTC on Ethereum network! Enter, Stake, and Start
                        Earning!
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-4">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                          <Globe2 className="h-3.5 w-3.5 text-[#9cc3ff]" />
                          Network
                        </div>
                        <div className="mt-3 text-sm font-medium text-slate-100">
                          Ethereum Mainnet
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-4">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                          <Layers3 className="h-3.5 w-3.5 text-[#9cc3ff]" />
                          DEX
                        </div>
                        <div className="mt-3 text-sm font-medium text-slate-100">Uniswap V2</div>
                      </div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-4">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                          <Coins className="h-3.5 w-3.5 text-[#9cc3ff]" />
                          Pair
                        </div>
                        <div className="mt-3 text-sm font-medium text-slate-100">MBTC / USDC</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                      <span className="rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1.5">
                        Add Liquidity
                      </span>
                      <span className="rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1.5">
                        Stake LP
                      </span>
                      <span className="rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1.5">
                        Claim Rewards
                      </span>
                    </div>
                    <a
                      href={ethereumHref}
                      className={buttonVariants(
                        "default",
                        "w-full justify-between rounded-2xl text-base shadow-[0_14px_35px_rgba(109,168,255,0.22)]",
                      )}
                    >
                      <span>Enter MBTC ETH Farm</span>
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
              >
                <Card
                  className="group relative overflow-hidden border border-red-500/30 bg-slate-950/85 shadow-[0_0_0_1px_rgba(239,68,68,0.08),0_0_28px_rgba(239,68,68,0.12)]"
                  style={cardThemeStyle("#0a4ecb", "rgba(10,78,203,0.34)")}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--card-glow),transparent_42%),linear-gradient(180deg,rgba(6,16,31,0.8)_0%,rgba(2,6,23,0.98)_100%)]" />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
                  <div className="pointer-events-none absolute right-5 top-5 h-3 w-3 rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.85)] animate-pulse" />
                  <CardContent className="relative grid gap-6 p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-[#0a4ecb]/40 bg-[#0a4ecb]/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-[#dbeafe]">
                          Base
                        </span>
                        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/35 bg-red-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-red-300">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                          </span>
                          Launching Soon
                        </div>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-[#8fb5ff]" />
                    </div>
                    <div className="grid gap-3">
                      <h2 className="font-['Space_Grotesk'] text-3xl font-semibold tracking-tight text-white">
                        MBTC on Base
                      </h2>
                      <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                        This Farm is for the MBTC on Coinbase&apos;s Base network! Enter, Stake,
                        and Start Earning!
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-4">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                          <Globe2 className="h-3.5 w-3.5 text-[#8fb5ff]" />
                          Network
                        </div>
                        <div className="mt-3 text-sm font-medium text-slate-100">Base</div>
                      </div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-4">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                          <Layers3 className="h-3.5 w-3.5 text-[#8fb5ff]" />
                          DEX
                        </div>
                        <div className="mt-3 text-sm font-medium text-slate-100">Aerodrome</div>
                      </div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-4">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                          <Coins className="h-3.5 w-3.5 text-[#8fb5ff]" />
                          Pair
                        </div>
                        <div className="mt-3 text-sm font-medium text-slate-100">MBTC / USDC</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                      <span className="rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1.5">
                        Bridge Deployment
                      </span>
                      <span className="rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1.5">
                        Aerodrome Router
                      </span>
                      <span className="rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1.5">
                        Rewards Ready
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled
                      className={buttonVariants(
                        "default",
                        "w-full justify-between rounded-2xl text-base shadow-[0_14px_35px_rgba(10,78,203,0.24)]",
                      )}
                    >
                      <span>Launching Soon</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
