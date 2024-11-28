import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DependencyGraphProps {
  dependencies: string[];
  devDependencies: string[];
}

interface Node {
  id: string;
  group: "dep" | "devDep";
}

interface Link {
  source: string;
  target: string;
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({
  dependencies,
  devDependencies,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    // Create nodes and links data
    const nodes: Node[] = [
      { id: "root", group: "dep" },
      ...dependencies.map((dep) => ({ id: dep, group: "dep" as const })),
      ...devDependencies.map((dep) => ({ id: dep, group: "devDep" as const })),
    ];

    const links: Link[] = [
      ...dependencies.map((dep) => ({ source: "root", target: dep })),
      ...devDependencies.map((dep) => ({ source: "root", target: dep })),
    ];

    // Set up SVG dimensions
    const width = 800;
    const height = 500;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes as any)
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(100)
      )
      .force("collision", d3.forceCollide().radius(30));

    // Create links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#666")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1);

    // Create nodes
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => (d.id === "root" ? 8 : 5))
      .attr("fill", (d) => {
        if (d.id === "root") return "#4f46e5";
        return d.group === "dep" ? "#10b981" : "#f59e0b";
      })
      .call(drag(simulation) as any);

    // Add labels
    const labels = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => (d.id === "root" ? "Project" : d.id))
      .attr("font-size", "10px")
      .attr("fill", "white")
      .attr("dx", 12)
      .attr("dy", 4);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);

      labels.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [dependencies, devDependencies]);

  // Drag functionality
  const drag = (simulation: d3.Simulation<any, undefined>) => {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  return (
    <div className="bg-neutral-800 rounded-lg p-5 col-span-2">
      <h2 className="text-lg font-semibold mb-4 text-white">
        Dependency Graph
      </h2>
      <div className="border border-neutral-700 rounded-lg overflow-hidden">
        <svg ref={svgRef} />
      </div>
      <div className="flex gap-4 mt-4 text-sm text-white">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#10b981]" />
          <span>Dependencies</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
          <span>Dev Dependencies</span>
        </div>
      </div>
    </div>
  );
};

export default DependencyGraph;
