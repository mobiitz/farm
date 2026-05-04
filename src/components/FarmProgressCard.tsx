import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type FarmProgressStep = {
  title: string;
  description: string;
  complete: boolean;
};

type FarmProgressCardProps = {
  title: string;
  steps: FarmProgressStep[];
};

export function FarmProgressCard({ title, steps }: FarmProgressCardProps) {
  const completedSteps = steps.filter((step) => step.complete).length;
  const totalSteps = steps.length || 1;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);
  const nextStep = steps.find((step) => !step.complete) ?? null;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.03 } }}>
      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
              <p className="text-sm text-slate-300">
                {completedSteps}/{totalSteps} steps complete
              </p>
            </div>
            <div className="text-sm text-slate-400">
              {nextStep ? `Next: ${nextStep.title}` : "Farm setup complete"}
            </div>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-900/90 ring-1 ring-slate-800">
            <motion.div
              className="h-full rounded-full bg-[color:var(--accent-solid)] shadow-[0_0_24px_var(--accent-glow)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-[color:var(--accent-text)]">
                  {step.complete ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <CircleDashed className="h-5 w-5 text-slate-500" />
                  )}
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="text-sm font-semibold text-slate-100">
                    Step {index + 1}. {step.title}
                  </div>
                  <p className="text-sm leading-6 text-slate-400">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
