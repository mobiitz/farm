import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { farmConfig } from "@/lib/config";

type ProgramInfoCardProps = {
  rewardRate: string;
  totalStaked: string;
  programEnds: string;
};

export function ProgramInfoCard({
  rewardRate,
  totalStaked,
  programEnds,
}: ProgramInfoCardProps) {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(farmConfig.tokenAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Program Info</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-slate-300">
        <div className="flex items-center justify-between gap-4">
          <span>Reward Rate</span>
          <span className="text-right">{rewardRate}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Total Staked</span>
          <span className="text-right">{totalStaked}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Program Ends</span>
          <span className="text-right">{programEnds}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span>MBTC Contract</span>
          <div className="text-right">
            <button
              type="button"
              onClick={copyAddress}
              className="break-all text-amber-300 underline underline-offset-4"
            >
              {farmConfig.tokenAddress}
            </button>
            {copied ? (
              <div className="mt-1 inline-block rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                Copied
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
