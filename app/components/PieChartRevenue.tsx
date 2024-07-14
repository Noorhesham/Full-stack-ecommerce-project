"use client";
import { formatPrice } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PieChartProducts = ({ data }: { data: any }) => {
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <PieChart>
        <Tooltip 
          cursor={{ fill: "hsl(var(--primary))" }} 
          formatter={(value, name, props) => [`${formatPrice(value as number)}`, `${props.payload.product}`]}
        />
        <Pie
          dataKey="revenue"
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label={(item) => item.product.slice(0, 12)}
        >
          {data.map((entry:any, index:any) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartProducts;
