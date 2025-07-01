import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import colors from "tailwindcss/colors";

import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  Tooltip,
} from "recharts";

const data = [
  { date: "01/07", revenue: 1530 },
  { date: "30/06", revenue: 1190 },
  { date: "29/06", revenue: 1835 },
  { date: "28/06", revenue: 1320 },
  { date: "27/06", revenue: 925 },
  { date: "26/06", revenue: 1760 },
  { date: "25/06", revenue: 1445 },
  { date: "24/06", revenue: 1605 },
  { date: "23/06", revenue: 1080 },
];

export function RevenueChart() {
  return (
    <Card className="bg-transparent col-span-6">
      <CardHeader className="flex items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base  font-medium">
            Receita no periodo
          </CardTitle>
          <CardDescription>Receita diária no período</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={248}>
          <LineChart data={data} className="text-xs">
            <XAxis dataKey="date" tickLine={false} axisLine={false} dy={16} />
            <YAxis
              stroke="#888"
              axisLine={false}
              tickLine={false}
              width={80}
              tickFormatter={(value: number) =>
                value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }
            />
            <CartesianGrid vertical={false} className="stroke-muted" z={1} />
            <Line
              type="linear"
              strokeWidth={2}
              dataKey="revenue"
              stroke={colors.violet["400"]}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
