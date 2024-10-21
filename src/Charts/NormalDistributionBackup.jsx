import useResizable from "../CustomHooks/useResizable.js";
import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
export const NormalDistribution = ({
  margin = { top: 5, right: 5, bottom: 20, left: 5 },
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

    // const standardDeviation = Math.sqrt(variance);
    // const x1 = mean - standardDeviation; // One standard deviation to the left
    // const yAtMean = (1 / Math.sqrt(2 * Math.PI * variance)) * Math.exp(0); // y at the mean (x2 = mean)
    // const yAtX1 = (1 / Math.sqrt(2 * Math.PI * variance)) * Math.exp(-0.5); // y at x1 (mu - sigma)
    // // Draw the horizontal line from (x1, yAtX1) to (mean, yAtMean)
    // chartContainer.selectAll(".mean_line").remove();
    //
    // chartContainer
    //   .append("line")
    //   .attr("class", "mean_line")
    //   .attr("x1", x(x1))
    //   .attr("y1", y(yAtX1))
    //   .attr("x2", x(mean))
    //   .attr("y2", y(yAtX1))
    //   .attr("stroke", "#e0e7ff") // Adjust color as needed
    //   .attr("stroke-width", 1)
    //   // .attr("stroke-dasharray", "5,5")
    //   .lower(); // Optional dashed line

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    if (showX) {
      // Show and transition in the x-axis and y-axis
      chartContainer
        .select(".x-axis")
        .style("color", "#e0e7ff")
        .style("opacity", 1)
        .attr("transform", `translate(0,${dimensions.innerHeight})`)
        .transition()
        .duration(400)
        .ease(d3.easeLinear) // Smooth transition to show axis
        .call(xAxis);
    } else {
      // Transition out the x-axis and y-axis smoothly
      chartContainer
        .select(".x-axis")
        .transition()
        .duration(500) // Smooth transition to hide axis
        .style("opacity", 0)
        .on("end", function () {
          d3.select(this).selectAll("*").remove(); // Remove axis elements after transition
        });
    }

    // svg.on("mouseover", () => {
    //   hasAnimated && setShowX(true);
    // });
    //
    // svg.on("mouseout", () => {
    //   setShowX(false);
    // });
    // if (showY) {
    //   svg
    //     .select(".y-axis")
    //     .style("color", "white")
    //     .style("opacity", 1)
    //     .attr("transform", `translate(0, 0)`)
    //     .transition()
    //     .duration(400)
    //     .ease(d3.easeLinear) // Smooth transition to show y-axis
    //     .call(yAxis);
    // } else {
    //   svg
    //     .select(".y-axis")
    //     .transition()
    //     .duration(500) // Smooth transition to hide y-axis
    //     .style("opacity", 0)
    //     .on("end", function () {
    //       d3.select(this).selectAll("*").remove(); // Remove axis elements after transition
    //     });
    // }

    // Define the normal distribution line generator
    const lineGenerator = d3
      .line()
      .x((d) => x(d.x))
      .y((d) => y(d.y))
      .curve(d3.curveBasis);

    const areaGenerator = d3
      .area()
      .x((d) => x(d.x))
      .y0(dimensions.innerHeight)
      .y1((d) => y(d.y))
      .curve(d3.curveBasis);

    const defs = svg.append("defs");

    defs
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "#818cf8", opacity: 0.6 },
        { offset: "100%", color: "#818cf8", opacity: 0 },
      ])
      .enter()
      .append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color)
      .attr("stop-opacity", (d) => d.opacity);

    // // Append the area under the curve
    // const area = chartContainer
    //   .selectAll(".normal_area")
    //   .data([data])
    //   .join("path")
    //   .attr("class", "normal_area")
    //   .attr("fill", "url(#gradient)")
    //   .attr("d", areaGenerator);

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
      // Animate the area by progressively revealing it
      // area
      //   .attr("d", areaGenerator)
      //   .attr("opacity", 0)
      //   .transition()
      //   .duration(2000)
      //   .delay(2000)
      //   .attr("opacity", 1);
    } else {
      // On resize or mean/variance update, recalculate and adjust the dasharray
      pathEnter
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", 0) // Smooth shape transition
        .attr("d", lineGenerator);
    }
  }, [dimensions, mean, variance, showX, hasAnimated]);

  // Handle mean slider change
  const handleMeanChange = (e) => {
    setMean(parseFloat(e.target.value));

    // Show only the x-axis
    setShowX(true);
    // setShowY(false);

    handleAxesTimeout();
  };

  // Handle variance slider change
  const handleVarianceChange = (e) => {
    setVariance(parseFloat(e.target.value));

    // Show both the x-axis and y-axis
    setShowX(true);
    // setShowY(true);

    handleAxesTimeout();
  };

  // Handle the timeout for hiding axes after changes
  const handleAxesTimeout = () => {
    // Clear any existing timeout
    if (axesTimeout) clearTimeout(axesTimeout);

    // Set a new timeout to hide the axes after 2 seconds of inactivity
    const timeout = setTimeout(() => {
      setShowX(false);
      // setShowY(false);
    }, 3000);

    setAxesTimeout(timeout);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Slider for changing the mean */}
      {/*<div style={{ marginBottom: "10px" }}>*/}
      {/*  /!*<label htmlFor="mean-slider">Mean: {mean}</label>*!/*/}
      {/*  <input*/}
      {/*    id="mean-slider"*/}
      {/*    type="range"*/}
      {/*    min="-10"*/}
      {/*    max="10"*/}
      {/*    value={mean}*/}
      {/*    step="0.1"*/}
      {/*    onChange={handleMeanChange}*/}
      {/*    style={{ width: "300px", marginLeft: "10px" }}*/}
      {/*  />*/}
      {/*</div>*/}
      {/*<div style={{ marginBottom: "10px" }}>*/}
      {/*  /!*<label htmlFor="variance-slider">variance: {variance}</label>*!/*/}
      {/*  <input*/}
      {/*    id="variance-slider"*/}
      {/*    type="range"*/}
      {/*    min="1"*/}
      {/*    max="40"*/}
      {/*    value={variance}*/}
      {/*    step="0.01"*/}
      {/*    onChange={handleVarianceChange}*/}
      {/*    style={{ width: "300px", marginLeft: "10px" }}*/}
      {/*  />*/}
      {/*</div>*/}
      {/* The chart itself */}
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
    </div>
  );
};
