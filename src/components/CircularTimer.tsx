import { useState, useEffect, useRef } from 'react';

interface CircularTimerProps {
  timeLeft: number;
  totalTime: number;
}

const CircularTimer = ({ timeLeft, totalTime }: CircularTimerProps) => {
  const [smoothTime, setSmoothTime] = useState(timeLeft);
  const animationFrameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(Date.now());

  // Smoothly interpolate between discrete second values
  useEffect(() => {
    setSmoothTime(timeLeft);
    lastUpdateRef.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = (now - lastUpdateRef.current) / 1000; // seconds elapsed
      const newSmoothTime = Math.max(0, timeLeft - elapsed);
      setSmoothTime(newSmoothTime);

      if (newSmoothTime > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [timeLeft]);

  // Calculate the percentage of time remaining
  const percentage = (smoothTime / totalTime) * 100;

  // SVG properties
  const size = 80;
  const center = size / 2;
  const radius = 35;

  // Calculate the angle for the pie slice (in degrees)
  // 360 degrees = full circle, 0 degrees = no circle
  const angle = (percentage / 100) * 360;

  // Convert angle to radians for calculation
  const angleInRadians = ((angle - 90) * Math.PI) / 180;

  // Calculate the end point of the arc
  const x = center + radius * Math.cos(angleInRadians);
  const y = center + radius * Math.sin(angleInRadians);

  // Determine if we should use the large arc flag (for angles > 180°)
  const largeArcFlag = angle > 180 ? 1 : 0;

  // Create the path for the pie slice
  // Move to center, line to top, arc to end point, line back to center
  const pathData =
    angle === 0
      ? '' // No path when time is 0
      : angle === 360
      ? `M ${center},${center} m 0,-${radius} a ${radius},${radius} 0 1,1 0,${radius * 2} a ${radius},${radius} 0 1,1 0,-${radius * 2}` // Full circle
      : `M ${center},${center} L ${center},${center - radius} A ${radius},${radius} 0 ${largeArcFlag},1 ${x},${y} Z`;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg height={size} width={size}>
        {/* White background circle */}
        <circle cx={center} cy={center} r={radius} fill="#ffffff" />
        {/* Red foreground circle that decreases over time */}
        <path d={pathData} fill="#ef4444" />
      </svg>
      {/* Time number in the center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-black">{timeLeft}</span>
      </div>
    </div>
  );
};

export default CircularTimer;
