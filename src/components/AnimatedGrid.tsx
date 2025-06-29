import * as React from "react"
import { motion } from "framer-motion"

interface AnimatedGridProps {
  className?: string;
  opacity?: number;
  gridSize?: number;
  strokeColor?: string;
  strokeWidth?: number;
  dotColor?: string;
  dotRadius?: number;
}

const AnimatedGrid = ({
  className = "absolute inset-0",
  opacity = 0.2,
  gridSize = 60,
  strokeColor = "rgba(0,0,0,0.15)",
  strokeWidth = 1,
  dotColor = "rgba(0,0,0,0.2)",
  dotRadius = 2
}: AnimatedGridProps) => {
  return (
    <div className={className} style={{ opacity }}>
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="net-pattern"
            x="0"
            y="0"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <motion.path
              d={`M0 0L${gridSize} 0M0 0L0 ${gridSize}M${gridSize} 0L${gridSize} ${gridSize}M0 ${gridSize}L${gridSize} ${gridSize}`}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="none"
              initial={{ pathLength: 0, opacity: 0.3 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: 0
              }}
            />
            <motion.circle
              cx="0"
              cy="0"
              r={dotRadius}
              fill={dotColor}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 0] }}
              transition={{
                duration: 2.5,
                repeat: 0,
                delay: 0.5
              }}
            />
            <motion.circle
              cx={gridSize}
              cy="0"
              r={dotRadius}
              fill={dotColor}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 0] }}
              transition={{
                duration: 2.5,
                repeat: 0,
                delay: 1
              }}
            />
            <motion.circle
              cx="0"
              cy={gridSize}
              r={dotRadius}
              fill={dotColor}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 0] }}
              transition={{
                duration: 2.5,
                repeat: 0,
                delay: 1.5
              }}
            />
            <motion.circle
              cx={gridSize}
              cy={gridSize}
              r={dotRadius}
              fill={dotColor}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 0] }}
              transition={{
                duration: 2.5,
                repeat: 0,
                delay: 2
              }}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#net-pattern)" />
      </svg>
    </div>
  );
}

export default AnimatedGrid;