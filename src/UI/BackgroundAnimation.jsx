import React, { useEffect, useRef } from "react";
import "../index.css"; // Import CSS for animation

const BackgroundAnimation = ({
  lineColor = "rgba(255,255,255,0.1)", // Color of the grid lines
  lineWidth = 0.4, // Width of the grid lines
  pulseDuration = 3, // Duration of the pulse animation in seconds
  gridSize = 60, // Size of each grid square
}) => {
  const svgRef = useRef(null);

  // Effect to update the grid dynamically when the window is resized
  useEffect(() => {
    const resizeGrid = () => {
      const svgElement = svgRef.current;
      if (svgElement) {
        const { clientWidth, clientHeight } = document.body;
        svgElement.setAttribute("width", clientWidth);
        svgElement.setAttribute("height", clientHeight);
      }
    };

    resizeGrid(); // Call once on mount
    window.addEventListener("resize", resizeGrid);

    return () => {
      window.removeEventListener("resize", resizeGrid);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="background-animation"
      style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}
    >
      {/* Create the grid of lines */}
      <defs>
        <pattern
          id="grid"
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#grid)"
        className="pulsating-grid"
      />
    </svg>
  );
};

export default BackgroundAnimation;
