import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Dependency {
  name: string;
  size: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface DependencyGraphProps {
  dependencies: Dependency[];
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({
  dependencies,
}: {
  dependencies: any;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || dependencies.length === 0) return;

    const width = 600;
    const height = 400;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const simulation = d3
      .forceSimulation(dependencies)
      .force("charge", d3.forceManyBody().strength(-50))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d: any) => Math.sqrt(d.size) + 5)
      );

    const nodes = svg
      .selectAll<SVGCircleElement, Dependency>("circle")
      .data(dependencies)
      .enter()
      .append("circle")
      .attr("r", (d: any) => Math.sqrt(d.size) + 5)
      .attr("fill", "#69b3a2")
      .call(
        //@ts-ignore
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    const labels = svg
      .selectAll("text")
      .data(dependencies)
      .enter()
      .append("text")
      .text((d: any) => d.name)
      .attr("font-size", "10px")
      .attr("text-anchor", "middle");

    simulation.on("tick", () => {
      nodes.attr("cx", (d: any) => d.x!).attr("cy", (d: any) => d.y!);
      labels.attr("x", (d: any) => d.x!).attr("y", (d: any) => d.y! - 10);
    });

    function dragstarted(
      event: d3.D3DragEvent<SVGCircleElement, Dependency, Dependency>
    ) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(
      event: d3.D3DragEvent<SVGCircleElement, Dependency, Dependency>
    ) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(
      event: d3.D3DragEvent<SVGCircleElement, Dependency, Dependency>
    ) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }, [dependencies]);

  return <svg ref={svgRef}></svg>;
};

export default DependencyGraph;
