'use client';

import React from "react";
import { MoreHorizontal } from "lucide-react";
import {
  LineChart, Line,
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function ChartCard({ title, subtitle, type }) {
  const dataSets = {
    line: [
      { name: 'Jan', value: 400 },
      { name: 'Feb', value: 300 },
      { name: 'Mar', value: 600 },
      { name: 'Apr', value: 800 },
      { name: 'May', value: 500 },
      { name: 'Jun', value: 900 },
      { name: 'Jul', value: 1200 },
    ],
    bar: [
      { name: 'Mon', value: 120 },
      { name: 'Tue', value: 150 },
      { name: 'Wed', value: 180 },
      { name: 'Thu', value: 200 },
      { name: 'Fri', value: 250 },
      { name: 'Sat', value: 100 },
      { name: 'Sun', value: 80 },
    ],
    pie: [
      { name: 'Successful', value: 75, color: '#4CAF50' },
      { name: 'Pending', value: 15, color: '#FF6F2F' },
      { name: 'Failed', value: 10, color: '#F44336' },
    ],
    area: [
      { name: 'Jan', value: 4000 },
      { name: 'Feb', value: 3000 },
      { name: 'Mar', value: 5000 },
      { name: 'Apr', value: 7000 },
      { name: 'May', value: 6000 },
      { name: 'Jun', value: 8000 },
    ],
  };

  const tooltipStyle = {
    backgroundColor: 'white',
    border: '1px solid #E6E8EB',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  };

  const chartConfig = {
    line: (
      <LineChart data={dataSets.line}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E6E8EB" />
        <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
        <YAxis stroke="#6B7280" fontSize={12} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#FF6F2F"
          strokeWidth={2}
          dot={{ fill: '#FF6F2F', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: '#FF6F2F' }}
        />
      </LineChart>
    ),
    bar: (
      <BarChart data={dataSets.bar}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E6E8EB" />
        <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
        <YAxis stroke="#6B7280" fontSize={12} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="value" fill="#4CAF50" radius={[4, 4, 0, 0]} />
      </BarChart>
    ),
    pie: (
      <PieChart>
        <Pie
          data={dataSets.pie}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {dataSets.pie.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    ),
    area: (
      <AreaChart data={dataSets.area}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E6E8EB" />
        <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
        <YAxis stroke="#6B7280" fontSize={12} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="value" stroke="#9C27B0" fill="#E1BEE7" strokeWidth={2} />
      </AreaChart>
    )
  };

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-200 dark:border-[#404040] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-[#13182B] dark:text-white mb-1">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-[#A0A0A0]">
            {subtitle}
          </p>
        </div>
        <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#404040] active:bg-gray-200 dark:active:bg-[#505050] transition-colors">
          <MoreHorizontal className="h-5 w-5 text-gray-500 dark:text-[#A0A0A0]" strokeWidth={1.5} />
        </button>
      </div>

      {/* Chart */}
      <div className="h-[180px] sm:h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartConfig[type] || null}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
