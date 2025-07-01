import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import colors from "tailwindcss/colors";

import { ResponsiveContainer, Pie, PieChart, Cell } from "recharts";
import { BarChart } from "lucide-react";

const data = [
  { product: "Peperroni", amount: 40 },
  { product: "Frango Catupiry", amount: 30 },
  { product: "Calabresa", amount: 50 },
  { product: "Margherita", amount: 16 },
  { product: "Quatro Queijos", amount: 26 },
];

const COLORS = [
  colors.sky[500],
  colors.amber[500],
  colors.violet[500],
  colors.emerald[500],
  colors.rose[500],
];

export function PopularProductsChart() {
  return (
    <Card className="bg-transparent col-span-3">
      <CardHeader className="flex items-center justify-between pb-8">
        <div className="flex w-full items-center justify-between">
          <CardTitle className="text-base font-medium">
            Produtos populares
          </CardTitle>
          <BarChart className="size-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={248}>
          <PieChart data={data} className="text-xs">
            <Pie
              dataKey="amount"
              nameKey="product"
              cx="50%"
              cy="50%"
              outerRadius={86}
              innerRadius={64}
              strokeWidth={8}
              labelLine={false}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                value,
                index,
              }) => {
                if (
                  midAngle === undefined ||
                  cx === undefined ||
                  cy === undefined ||
                  innerRadius === undefined ||
                  outerRadius === undefined ||
                  index === undefined
                ) {
                  return null;
                }
                const RADIAN = Math.PI / 180;
                const radius = 12 + innerRadius + (outerRadius - innerRadius);
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                const product = data[index].product;
                const labelText =
                  product.length > 12
                    ? product.substring(0, 12).concat("...")
                    : product;

                return (
                  <text
                    x={x}
                    y={y}
                    className="fill-muted-foreground text-xs"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                  >
                    {labelText} ({value})
                  </text>
                );
              }}
            >
              {data.map((_, index) => {
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index]}
                    className="stroke-background hover:opacity-80"
                  />
                );
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
