import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DependencyNode {
  name: string;
  lintIssues: number;
  children?: DependencyNode[];
}

interface BubbleChartProps {
  dependencies: DependencyNode[];
  width?: number;
  height?: number;
}

const DependencyBubbleChart: React.FC<BubbleChartProps> = ({
  dependencies,
  width = 300,
  height = 200,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };

  useEffect(() => {
    if (!dependencies.length || !svgRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const bubble = d3
      .pack<any>()
      .size([
        width - margin.left - margin.right,
        height - margin.top - margin.bottom,
      ])
      .padding(1);

    const root = d3
      .hierarchy<DependencyNode>({
        name: "root",
        lintIssues: 0,
        children: dependencies,
      })
      .sum((d) => d.lintIssues);

    const nodes = bubble(root).descendants().slice(1);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const bubbles = svg
      .selectAll(".bubble")
      .data(nodes)
      .join("g")
      .attr("class", "bubble")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    bubbles
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", "#4B5563")
      .attr("opacity", 0.7)
      .attr("stroke", "#6B7280")
      .attr("stroke-width", 1)
      .on("mouseover", function () {
        d3.select(this).attr("opacity", 0.9).attr("stroke-width", 2);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 0.7).attr("stroke-width", 1);
      });

    bubbles
      .append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .style("font-size", (d) => Math.min(d.r / 3, 12) + "px")
      .style("fill", "white")
      .text((d) => d.data.name);

    bubbles
      .append("text")
      .attr("dy", "1.3em")
      .style("text-anchor", "middle")
      .style("font-size", (d) => Math.min(d.r / 3, 10) + "px")
      .style("fill", "#9CA3AF")
      .text((d) => d.data.lintIssues);
  }, [dependencies, width, height]);

  return <svg ref={svgRef} />;
};

export default DependencyBubbleChart;
