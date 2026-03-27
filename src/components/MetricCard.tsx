import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MetricCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  subtitle: string;
  delay?: number;
};

export function MetricCard({ icon, title, value, subtitle, delay = 0 }: MetricCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay } }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">{value}</div>
          <div className="mt-1 text-sm text-slate-400">{subtitle}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
