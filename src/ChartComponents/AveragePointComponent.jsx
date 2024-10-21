import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const AveragePointComponent = ({ sampleMean }) => {
  const ref = useRef();

  useEffect(() => {
    if (!sampleMean) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous points

    const height = 200;
    const width = 400;

    svg.attr("height", height).attr("width", width);

    svg
      .append("circle")
      .attr("cx", width / 2)
      .attr("cy", 0)
      .attr("r", 10)
      .attr("fill", "red")
      .transition()
      .duration(1000)
      .attr("cy", height);
  }, [sampleMean]);

  return <svg ref={ref}></svg>;
};

export default AveragePointComponent;
