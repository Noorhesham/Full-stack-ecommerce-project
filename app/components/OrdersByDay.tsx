"use client";

import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const OrdersByDay = ({ data }: { data: any }) => {
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
        <XAxis 
          dataKey="_id" 
          tickFormatter={(v) => format(new Date(v), "dd/MM/yyyy")} 
          stroke="hsl(var(--primary))" 
        />
        <YAxis tickFormatter={(v) => formatPrice(v)} />
        <Tooltip formatter={(v) => formatPrice(v as number)} />
        <Legend />
        <Line type="monotone" name="Total Sales" dataKey="totalSales" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default OrdersByDay;
