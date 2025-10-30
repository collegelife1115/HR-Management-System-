import React from "react";

/**
 * A simple static SVG doughnut chart component.
 * @param {object} props
 * @param {number} props.positive - Percentage (0-100)
 * @param {number} props.neutral - Percentage (0-100)
 * @param {number} props.negative - Percentage (0-100)
 */
export const DoughnutChart = ({ positive, neutral, negative }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  // Calculate offsets ensuring they are cumulative
  const positiveOffset = 0; // Starts at the top (after -90deg rotation)
  const neutralOffset = (positive / 100) * circumference;
  const negativeOffset = ((positive + neutral) / 100) * circumference;

  // Calculate dash arrays
  const positiveDasharray = `${
    (positive / 100) * circumference
  } ${circumference}`;
  const neutralDasharray = `${
    (neutral / 100) * circumference
  } ${circumference}`;
  const negativeDasharray = `${
    (negative / 100) * circumference
  } ${circumference}`;

  return (
    // Flex container for chart and legend
    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
      {/* SVG Container */}
      <div className="relative w-[120px] h-[120px]">
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          className="-rotate-90" // Rotates the start point to the top
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#e5e7eb" // Light gray background
            strokeWidth="12" // Thickness of the chart segments
          />
          {/* Negative Segment (Red) - Drawn first to be underneath */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#ef4444" // Red color
            strokeWidth="12"
            strokeDasharray={negativeDasharray}
            strokeDashoffset={-negativeOffset} // Offset starts after positive+neutral
            strokeLinecap="round" // Makes segment ends rounded
            style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }} // Smooth transition
          />
          {/* Neutral Segment (Amber/Yellow) - Drawn second */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#f59e0b" // Amber color
            strokeWidth="12"
            strokeDasharray={neutralDasharray}
            strokeDashoffset={-neutralOffset} // Offset starts after positive
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
          />
          {/* Positive Segment (Green) - Drawn last to be on top */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#22c55e" // Green color
            strokeWidth="12"
            strokeDasharray={positiveDasharray}
            strokeDashoffset={-positiveOffset} // No offset, starts at the beginning
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
          />
        </svg>
      </div>

      {/* Legend */}
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <span>Positive ({positive}%)</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
          <span>Neutral ({neutral}%)</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          <span>Negative ({negative}%)</span>
        </div>
      </div>
    </div>
  );
};

// Default export is optional but often good practice for components
export default DoughnutChart;
