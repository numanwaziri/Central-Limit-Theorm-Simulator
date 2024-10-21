import useResizable from "../CustomHooks/useResizable.js";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// Helper function to calculate the Gamma function (approximation)
const gamma = (z) => {
  // Lanczos approximation coefficients
  const g = 7;
  const C = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  z -= 1;
  let x = C[0];
  for (let i = 1; i < g + 2; i++) x += C[i] / (z + i);
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * t ** (z + 0.5) * Math.exp(-t) * x;
};

// Function to calculate the Beta function using Gamma function
const betaFunction = (a, b) => (gamma(a) * gamma(b)) / gamma(a + b);

// Function to calculate the Beta distribution PDF
const betaPDF = (x, alpha, beta) =>
  (Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1)) /
  betaFunction(alpha, beta);

export const Line = ({
  margin = { top: 5, right: 15, bottom: 40, left: 23 },
}) => {
  const [means, setMeans] = useState([]);
  const { containerRef, dimensions } = useResizable(margin);
  const lineChartRef = useRef(null);
  const isMobile = dimensions.width < 840 && window.innerWidth < 900;

  // State for sliders
  const [alpha, setAlpha] = useState(3); // Initial alpha value
  const [beta, setBeta] = useState(2); // Initial beta value
  const [intervalSpeed, setIntervalSpeed] = useState(1240); // Initial interval speed

  // const sample = d3.range(18).map(() => Math.random() * 10);
  // const randomExponential = d3.randomExponential(0.5); // Exponential distribution with rate = 1
  // const sample = d3.range(18).map(randomExponential); // Generate 8 random samples

  // Beta distribution generator using D3.js
  // Adjust beta parameter for Beta distribution
  const randomBeta = d3.randomBeta(alpha, beta);
  const sample = d3.range(12).map(randomBeta); // Generate 18 random samples

  const mean = d3.mean(sample);

  useEffect(() => {
    const chartContainer = d3.select(lineChartRef.current);
    const svg = d3.select(lineChartRef.current.parentNode);

    // Append a glow filter to the SVG container
    chartContainer
      .append("defs")
      .append("filter")
      .attr("id", "glow")
      .append("feGaussianBlur")
      .attr("stdDeviation", 3) // Adjust for more/less blur (glow)
      .attr("result", "coloredBlur");

    // Merge the blur with the original stroke color
    chartContainer
      .select("filter#glow")
      .append("feMerge")
      .selectAll("feMergeNode")
      .data(["coloredBlur", "SourceGraphic"])
      .enter()
      .append("feMergeNode")
      .attr("in", (d) => d);

    const xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, dimensions.innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([dimensions.innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale).ticks(0).tickSize(0);
    const yAxis = d3
      .axisLeft(yScale)
      .tickValues([0, 0.4])
      // .tickValues([0, 0.25, 0.5, 0.75, 1])
      // .tickFormat(d3.format(".0%"))
      .tickSize(-xScale(1));

    chartContainer
      .select(".x-axis")
      .attr("transform", `translate(0,${dimensions.innerHeight})`)
      .attr("color", "white")
      // .transition("axis_moving")
      // .ease(d3.easeLinear)
      // .duration(100)
      .call(xAxis);

    chartContainer
      .select(".y-axis")
      .attr("color", "white")
      .call(yAxis)
      .selectAll("text")
      .attr("opacity", 0); // Hide y labels

    chartContainer.select(".y-axis .domain").remove();

    // Update existing circles' positions on resize
    chartContainer.selectAll(".sample").attr("cx", (d) => xScale(d)); // Adjust this as needed for your layout
    chartContainer.selectAll(".mean_circle").attr("cx", (d) => xScale(d)); // Adjust this as needed for your layout
    // Update existing text positions on resize

    // Generate Beta distribution data points for curve
    const betaData = d3.range(0, 1.01, 0.01).map((x) => ({
      x,
      y: betaPDF(x, alpha, beta),
    }));

    const max_pdf = d3.max(betaData, (d) => d.y);
    const yScaleBeta = d3
      .scaleLinear()
      .domain([0, max_pdf + 0.4]) // Adjusted Y scale for Beta distribution density values
      .range([yScale(0.6), yScale(1)]);

    // Draw Beta distribution curve using an area plot
    const areaGenerator = d3
      .area()
      .x((d) => xScale(d.x))
      .y0(yScaleBeta(0))
      .y1((d) => yScaleBeta(d.y))
      .curve(d3.curveBasis); // Smooth curve
    const lineTopGenerator = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScaleBeta(d.y))
      .curve(d3.curveBasis); // Smooth curve for the top line

    const lineBottomGenerator = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScaleBeta(0) + 2.15)
      .curve(d3.curveBasis); // Smooth curve for the bottom line

    chartContainer
      .selectAll(".beta-area")
      .data([betaData])
      .join("path")
      .attr("class", "beta-area")
      .attr("fill", "#047857")
      .attr("opacity", 1)
      // .attr("stroke", "black")
      // .attr("stroke-width", 0.8)
      // .transition()
      // .ease(d3.easeLinear)
      .attr("d", areaGenerator);

    // Append top line
    chartContainer
      .selectAll(".beta-top-line")
      .data([betaData])
      .join("path")
      .attr("class", "beta-top-line")
      .attr("stroke-linecap", "round")
      .attr("fill", "none")
      .attr("stroke", "#06b87f")
      .attr("stroke-width", 2.5)
      // .transition()
      // .ease(d3.easeLinear)
      .attr("filter", "url(#glow)") // Apply the glow effect
      .attr("d", lineTopGenerator);

    // Append bottom line
    chartContainer
      .selectAll(".beta-bottom-line")
      .data([betaData])
      .join("path")
      .attr("class", "beta-bottom-line")
      .attr("stroke-linecap", "round")
      .attr("fill", "none")
      .attr("stroke", "#06b87f")
      .attr("stroke-width", 4)
      .transition()
      .ease(d3.easeLinear)
      .attr("d", lineBottomGenerator);

    const update = () => {
      // Generate new random sample and mean
      const radius = !isMobile ? 5 : 4;
      const newSample = d3.range(12).map(randomBeta);
      const newMean = d3.mean(newSample);

      // Unique class for each set of samples
      const uniqueId = Date.now();

      // Bind data to circles
      const circles = chartContainer
        .selectAll(`sample-${uniqueId}`)
        .data(newSample)
        .join("circle")
        .attr("class", `sample sample-${uniqueId}`)
        .attr("r", radius)
        .attr("fill", "#09ca8e")
        .lower()
        .attr("cy", yScale(0.594))
        .attr("cx", (d) => xScale(d));
      circles
        // Position circles at the start
        .transition("drop-${uniqueId}")
        .delay(() => Math.random() * 80) // Random delay for each circle
        .duration(600)
        .ease(d3.easeBounceOut) // Bounce effect
        .attr("cy", yScale(0.4) - radius) // Position above the middle tick
        .end()
        .then(() => {
          circles
            .transition(`moveToMean-${uniqueId}`)
            // Named transition 'moveToMean'
            .duration(400)
            .attr("fill", "#ca8a04")
            .attr("cx", xScale(newMean))
            .end()
            .then(() => {
              circles.remove();

              const mean_circles = chartContainer
                .selectAll(`.mean-${uniqueId}`)
                .data([newMean])
                .join("circle")
                .attr("class", `mean_circle mean-${uniqueId}`)
                .attr("cx", (d) => xScale(d))
                .attr("cy", yScale(0.4) - radius)
                .attr("r", radius)
                .attr("opacity", 1)
                .attr("fill", "#ca8a04");
              mean_circles
                .transition()
                .duration(400)
                .attr("cy", yScale(0) - radius)
                .end()
                .then(() => {
                  mean_circles.remove();
                });

              // Update the means state
              setMeans((prevMeans) => [...prevMeans, newMean]);

              // .attr("cy", function (d) {
              //   const newCX = xScale(d);
              //   const radius = 4;
              //   let newY = yScale(0); // Starting position for piling up
              //   const overlapThreshold = 1.1 * radius; // Threshold for when circles are considered overlapping
              //
              //   // Check for overlapping circles
              //   chartContainer.selectAll(".mean_circle").each(function () {
              //     const existingCircle = d3.select(this);
              //     const existingCX = parseFloat(existingCircle.attr("cx"));
              //     const existingCY = parseFloat(existingCircle.attr("cy"));
              //
              //     // Check if the existing circle overlaps with the new circle
              //     if (
              //       Math.abs(existingCX - newCX) < overlapThreshold && // Close enough on the x-axis
              //       Math.abs(existingCY - newY) < overlapThreshold // Close enough on the y-axis
              //     ) {
              //       newY -= overlapThreshold; // Move up to avoid overlap
              //     }
              //   });
              //
              //   return newY; // Return the adjusted y position to "pile up"
              // });
            });
        });
    };

    // Calculate and plot KDE when means update
    if (means.length > 0) {
      const histogram = d3
        .histogram()
        .value((d) => d)
        .domain(xScale.domain()) // Use the same domain as the x scale
        .thresholds(xScale.ticks(isMobile ? 30 : 40)); // Adjust the number of bins
      const bins = histogram(means);

      const yHistogramScale = d3
        .scaleLinear()
        .domain([0, d3.max(bins, (d) => d.length)])
        .range([yScale(0), yScale(0.35)]); // Adjust the range to map from yScale(0) to yScale(0.35)
      // Render Histogram Bars with Smooth Transition
      const bars = chartContainer.selectAll(".bar").data(bins);

      // Update: Use the 'join' pattern for entering, updating, and exiting bars
      bars.join(
        (enter) =>
          enter
            .append("rect")
            .attr("class", "bar")
            .lower()
            .attr("x", (d) => xScale(d.x0))
            .attr("width", (d) => Math.max(0, xScale(d.x1) - xScale(d.x0)))
            .attr("y", yScale(0)) // Start from the bottom
            .attr("height", 0) // Initial height is zero
            .attr("fill", "#b67e05")
            .attr("stroke", "#ffc617")
            .attr("opacity", 1)
            .attr("stroke-width", 1)
            .transition() // Smoothly transition bars from bottom to the correct height
            .duration(400)
            .ease(d3.easeCubicInOut)
            .attr("y", (d) => yHistogramScale(d.length)) // Final y position
            .attr("height", (d) => yScale(0) - yHistogramScale(d.length)), // Final height,
        (update) =>
          update

            .transition()
            .duration(400)
            .ease(d3.easeCubicInOut)
            .attr("x", (d) => xScale(d.x0))
            .attr("width", (d) => Math.max(0, xScale(d.x1) - xScale(d.x0)))
            .attr("y", (d) => yHistogramScale(d.length))
            .attr("height", (d) => yScale(0) - yHistogramScale(d.length)),
        (exit) => exit.remove(),
      );

      // Calculate total count for percentage calculation
      const totalCount = d3.sum(bins, (d) => d.length);

      // Add percentages inside each histogram bar
      const barText = chartContainer
        .selectAll(".bar-text")
        .data(bins, (d) => d);
      barText.join(
        (enter) =>
          enter
            // .filter((d) => d.length > 0) // Only append text if percentage > 0
            .append("text")
            .attr("class", "bar-text")
            .attr("x", (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2) // Center text in the bar
            .attr("y", yScale(0)) // Start at bottom
            .attr("dx", "0.5rem")
            .attr("text-anchor", "start")
            .attr("dominant-baseline", "middle")
            .text((d) => `${((d.length / totalCount) * 100).toFixed(1)}%`) // Calculate percentage
            .style("fill", "white")
            // .style("font-weight", 600)
            .attr(
              "transform",
              (d) =>
                `rotate(90, ${xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2}, ${yScale(0)})`,
            )
            .attr("opacity", (d) => (d.length > 0 ? 1 : 0))
            .style("font-size", isMobile ? "10px" : "11px")
            .style("font-weight", 500),

        // .transition()
        // .duration(800)
        // .ease(d3.easeCubicInOut)
        // .attr("y", (d) => yHistogramScale(d.length) - 5), // Adjust y to position text inside bar
        (update) =>
          update
            // .filter((d) => d.length > 0)
            .transition()
            .duration(300)
            .ease(d3.easeCubicInOut)
            .attr("x", (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2) // Center text in the bar
            .attr("y", yScale(0)) // Start at bottom
            .style("font-size", isMobile ? "10px" : "11px")
            .style("font-weight", 500)
            // .attr("x", (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
            // .attr("y", (d) => yHistogramScale(d.length) - 5)
            .text((d) => `${((d.length / totalCount) * 100).toFixed(1)}%`), // Update percentage
        (exit) => exit.remove(),
      );

      // Calculate Mean and Standard Deviation
      const mean_of_means = d3.mean(means);
      const stdDev_of_means = d3.deviation(means);

      // Generate Normal Distribution Curve Data
      const normalDistribution = d3.range(0, 10, 0.1).map((x) => {
        const y =
          (1 / (stdDev_of_means * Math.sqrt(2 * Math.PI))) *
          Math.exp(-0.5 * ((x - mean_of_means) / stdDev_of_means) ** 2);
        return { x, y };
      });

      // Calculate Normalized Y Scale for Normal Curve
      const maxDensity = d3.max(normalDistribution, (d) => d.y);
      const yScaleCurve = d3
        .scaleLinear()
        .domain([0, maxDensity])
        .range([yScale(0), yScale(0.4)]); // Adjust Y range from yScale(0) to yScale(0.4)

      // Create Area Under Normal Curve
      const area = d3
        .area()
        .x((d) => xScale(d.x))
        .y0(yScale(0))
        .y1((d) => yScaleCurve(d.y))
        .curve(d3.curveBasis);

      // chartContainer
      //   .selectAll(".normal-area")
      //   .data([normalDistribution])
      //   .join("path")
      //   .attr("class", "normal-area")
      //   .attr("stroke", "grey")
      //   .attr("stroke-width", 2)
      //   .attr("fill", "cyan")
      //   .attr("opacity", means.length > 3 ? 0.4 : 0)
      //   // .lower()
      //   .transition()
      //   .duration(500)
      //   .attr("d", area); // Adjust opacity for visibility

      // // Ensure there is enough data to compute KDE
      // const bandwidth = 0.45; // Adjust bandwidth as needed
      // const kde = gaussianKDE(bandwidth, xScale.ticks(1000)); // KDE function using Gaussian kernel
      // const density = kde(means);
      // const maxDensity = d3.max(density, (d) => d[1]); // Find maximum density to normalize
      // // Select KDE path and bind new data
      // const kdePath = chartContainer.selectAll(".kde-line").data([density]);
      //
      // // Enter + Update: Append path and transition its update
      // kdePath
      //   .join("path")
      //   .attr("class", "kde-line")
      //   .attr("fill", "none")
      //   .attr("transform", `translate(0,${dimensions.innerHeight / 1.83})`)
      //   .attr("stroke", "red")
      //   .attr("stroke-width", 1.5)
      //
      //   .transition() // Add transition for smooth updates
      //   .duration(800)
      //   // Set duration for transition
      //   .ease(d3.easeCubicInOut) // Easing function for smoothness
      //   .attr(
      //     "d",
      //     d3
      //       .line()
      //       .curve(d3.curveBasis)
      //       .x((d) => xScale(d[0]))
      //       .y((d) => yScale(d[1]) / 2.2),
      //   );
    }

    // Call the update function every 2 seconds
    const interval = setInterval(update, intervalSpeed);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [dimensions.width, means, isMobile, alpha, beta, intervalSpeed]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", boxSizing: "border-box" }}
    >
      <svg
        style={{ border: "1px solidd green", overflow: "visible" }}
        width={dimensions.width}
        height={dimensions.height}
      >
        <g
          transform={`translate(${margin.left},${margin.top})`}
          ref={lineChartRef}
        >
          <g className="x-axis" />
          <g className="y-axis" />
        </g>
      </svg>
      <div style={{ padding: "10px" }}>
        <label>
          Alpha:
          <input
            type="range"
            min="1"
            max="5"
            step="0.01"
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
          />
          {alpha}
        </label>
        <br />
        <label>
          Beta:
          <input
            type="range"
            min="1"
            max="5"
            step="0.01"
            value={beta}
            onChange={(e) => setBeta(parseFloat(e.target.value))}
          />
          {beta}
        </label>
        <br />
        <label>
          Interval Speed (ms):
          <input
            type="range"
            min="0"
            max="1500"
            step="50"
            value={intervalSpeed}
            onChange={(e) => setIntervalSpeed(parseInt(e.target.value, 10))}
          />
          {intervalSpeed} ms
        </label>
      </div>
    </div>
  );
};
