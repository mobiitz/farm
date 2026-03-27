import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      </CardContent>
    </Card>
  );
}
