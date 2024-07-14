"use client";

import { formatPrice } from "@/lib/utils";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const BarChartUsers = ({ data }: { data: any }) => {
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <BarChart data={data}>
        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
        <XAxis dataKey="email"  stroke="hsl(var(--primary))" />
        <YAxis tickFormatter={(v) => formatPrice(v)} />
        <Tooltip formatter={(v) => formatPrice(v as number)} />
        <Legend />
        <Bar type="monotone" name="Total Paid" dataKey="totalPaid" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartUsers;
