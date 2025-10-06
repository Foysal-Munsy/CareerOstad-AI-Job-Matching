'use client';

import React from "react";
import { MoreHorizontal, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function MetricCard({
  icon: Icon,
  title = "Title",
  value = "0",
  change = "0%",
  changeType = "neutral", // "positive" | "negative" | "neutral"
  description = "",
}) {
  const changeConfig = {
    positive: {
      color: "text-green-500",
      icon: <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />,
    },
    negative: {
      color: "text-red-500",
      icon: <ArrowDownRight className="h-4 w-4" strokeWidth={1.5} />,
    },
    neutral: {
      color: "text-gray-500",
      icon: null,
    },
  };

  const { color, icon } = changeConfig[changeType] || changeConfig.neutral;

  return (
    <div className="bg-white dark:bg-[#1E1E1E] hover:shadow-2xs rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-200 dark:border-[#404040] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-[#262626] rounded-xl sm:rounded-2xl flex items-center justify-center">
          {Icon && <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#FF6F2F]" strokeWidth={1.5} />}
        </div>
        <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#404040] active:bg-gray-200 dark:active:bg-[#505050] transition-colors">
          <MoreHorizontal className="h-5 w-5 text-gray-500 dark:text-[#A0A0A0]" strokeWidth={1.5} />
        </button>
      </div>

      {/* Value + Change */}
      <div className="mb-2">
        <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-[#A0A0A0] mb-1">
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-xl sm:text-2xl lg:text-[28px] font-semibold text-[#13182B] dark:text-white font-montserrat">
            {value}
          </span>
          {change && (
            <div className={`flex items-center space-x-1 ${color}`}>
              {icon}
              <span className="text-xs sm:text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-[#A0A0A0]">{description}</p>
      )}
    </div>
  );
}
