import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const SamplingDistributionComponent = ({ samplingDistribution }) => {
  const ref = useRef();

  useEffect(() => {
    if (samplingDistribution.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous histogram

    const height = 200;
    const width = 400;
    const margin = { top: 10, right: 30, bottom: 30, left: 30 };

    const x = d3
      .scaleLinear()
      .domain([0, 1])
      .range([margin.left, width - margin.right]);

    const histogram = d3.histogram().domain(x.domain()).thresholds(x.ticks(20));

    const bins = histogram(samplingDistribution);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (d) => d.length)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const bar = svg
      .attr("viewBox", [0, 0, width, height])
      .append("g")
      .selectAll("rect")
      .data(bins)
      .join("rect")
      .attr("x", (d) => x(d.x0) + 1)
      .attr("y", (d) => y(d.length))
      .attr("width", (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
      .attr("height", (d) => y(0) - y(d.length))
      .attr("fill", "steelblue");

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [samplingDistribution]);

  return <svg ref={ref}></svg>;
};

export default SamplingDistributionComponent;
