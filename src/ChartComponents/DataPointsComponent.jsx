import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const DataPointsComponent = ({ samples }) => {
  const ref = useRef();

  useEffect(() => {
    if (samples.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous points

    const height = 200;
    const width = 400;

    svg.attr("height", height).attr("width", width);

    svg
      .selectAll("circle")
      .data(samples)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => i * (width / samples.length))
      .attr("cy", 0)
      .attr("r", 5)
      .attr("fill", "blue")
      .transition()
      .duration(1000)
      .attr("cy", height);
  }, [samples]);

  return <svg ref={ref}></svg>;
};

export default DataPointsComponent;
