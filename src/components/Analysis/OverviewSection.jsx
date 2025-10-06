'use client';

import React from "react";
import {
  Users, Briefcase, FileText, Heart, CreditCard
} from "lucide-react";
import MetricCard from "./MetricCard";
import ChartCard from "./ChartCard";

export default function OverviewSection() {
  const metrics = [
    { icon: Users, title: "Total Users", value: "12,847", change: "+12.5%", changeType: "positive", description: "New registrations this month" },
    { icon: Briefcase, title: "Posted Jobs", value: "3,214", change: "+8.3%", changeType: "positive", description: "Active job postings" },
    { icon: FileText, title: "Applications", value: "28,531", change: "+15.7%", changeType: "positive", description: "Total applications received" },
    { icon: Heart, title: "Matches", value: "9,846", change: "+22.1%", changeType: "positive", description: "Successful matches made" },
    { icon: CreditCard, title: "Subscriptions", value: "$47,892", change: "-3.2%", changeType: "negative", description: "Monthly recurring revenue" },
  ];

  const activities = [
    { color: "#4CAF50", text: "New user registered", time: "2 min ago" },
    { color: "#FF6F2F", text: "Job posted", time: "5 min ago" },
    { color: "#9C27B0", text: "Match created", time: "8 min ago" },
    { color: "#2196F3", text: "Application submitted", time: "12 min ago" },
  ];

  return (
    <div className="space-y-6 w-9/12 mx-auto my-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} {...metric} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <ChartCard title="User Growth" subtitle="User registrations over time" type="line" />
        <ChartCard title="Application Trends" subtitle="Daily application volumes" type="bar" />
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        <ChartCard title="Match Success Rate" subtitle="Percentage of successful matches" type="pie" />
        <ChartCard title="Subscription Revenue" subtitle="Monthly revenue breakdown" type="area" />
        
        {/* Activity Feed */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-200 dark:border-[#404040] flex flex-col">
          <h3 className="text-base sm:text-lg font-semibold text-[#13182B] dark:text-white mb-4">
            Real-time Activity
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {activities.map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activity.color }}></div>
                  <span className="text-xs sm:text-sm text-gray-700 dark:text-[#E0E0E0]">
                    {activity.text}
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs text-gray-500 dark:text-[#A0A0A0]">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
