import useResizable from "../CustomHooks/useResizable.js";
import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
export const NormalDistribution = ({
  margin = { top: 5, right: 5, bottom: 5, left: 5 },
}) => {
  const [mean, setMean] = useState(0);
  const [variance, setVariance] = useState(1);
  const [showX, setShowX] = useState(false); // Track when to show the x-axis

  const [axesTimeout, setAxesTimeout] = useState(null); // Store the timeout reference
  const { containerRef, dimensions } = useResizable(margin);
  const lineChartRef = useRef(null);
  const isMobile = dimensions.width < 840 && window.innerWidth < 900;
  const [hasAnimated, setHasAnimated] = useState(false); // Track if we've animated

  // Generate data points for the normal distribution curve
  const data = useMemo(() => {
    return d3
      .range(
        mean - 4 * Math.sqrt(variance),
        mean + 4 * Math.sqrt(variance),
        0.1,
      )
      .map((x) => ({
        x: x,
        y:
          (1 / Math.sqrt(2 * Math.PI * variance)) *
          Math.exp(-Math.pow(x - mean, 2) / (2 * variance)),
      }));
  }, [mean, variance]);

  useEffect(() => {
    if (dimensions.width === 0) return; // Ensure the container is rendered

    const chartContainer = d3.select(lineChartRef.current);
    const svg = d3.select(lineChartRef.current.parentNode);
    const x = d3
      .scaleLinear()
      .domain([mean - 4 * Math.sqrt(variance), mean + 4 * Math.sqrt(variance)])
      .range([0, dimensions.innerWidth]);
    const y = d3
      .scaleLinear()
      .domain([0, 0.4])
      .range([dimensions.innerHeight, 0]);

    // Define the normal distribution line generator
    const lineGenerator = d3
      .line()
      .x((d) => x(d.x))
      .y((d) => y(d.y))
      .curve(d3.curveBasis);

    const path = chartContainer.selectAll(".normal_path").data([data]);

    // Enter: create a new path if none exists
    const pathEnter = path
      .join("path")
      .attr("class", "normal_path")
      .attr("fill", "none")
      .attr("clip-path", "url(#clip)")
      .attr("stroke", "#818cf8")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", isMobile ? 5 : 6)

      .attr("d", lineGenerator);

    // Recalculate the dasharray whenever dimensions change
    const totalLength = pathEnter.node().getTotalLength();

    if (!hasAnimated) {
      // Dasharray animation on initial load
      pathEnter
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)

        .attr("stroke-dashoffset", 0)
        .on("end", () => setHasAnimated(true)); // Mark animation as complete
    } else {
      // On resize or mean/variance update, recalculate and adjust the dasharray
      pathEnter
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", 0) // Smooth shape transition
        .attr("d", lineGenerator);
    }
  }, [dimensions, mean, variance, showX, hasAnimated]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <svg
        style={{ border: "1px solidd green", overflow: "visible" }}
        width={dimensions.width}
        height={dimensions.height}
      >
        {" "}
        <g
          transform={`translate(${margin.left},${margin.top})`}
          ref={lineChartRef}
        >
          <g className="x-axis" />
          <g className="y-axis" />
        </g>
      </svg>
    </div>
  );
};
