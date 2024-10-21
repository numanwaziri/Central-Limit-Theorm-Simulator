import React from "react";

const NodeDiagram = ({ numberOfNodes }) => {
  // Function to generate node positions using trigonometry
  const generateNodes = () => {
    const nodes = [];
    const radius = 200; // Distance from the center to the nodes
    const centerX = 50; // Center X position (50% of the container)
    const centerY = 50; // Center Y position (50% of the container)
    const angleIncrement = (2 * Math.PI) / numberOfNodes; // Angle between each node

    for (let i = 0; i < numberOfNodes; i++) {
      const angle = i * angleIncrement;
      const x = centerX + radius * Math.cos(angle); // X position
      const y = centerY + radius * Math.sin(angle); // Y position

      nodes.push(
        <div
          key={i}
          className="absolute"
          style={{
            top: `${y}%`,
            left: `${x}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-400">
            Node {i + 1}
          </div>
        </div>,
      );
    }

    return nodes;
  };

  // Function to generate connecting lines from the center to the nodes
  const generateLines = () => {
    const lines = [];
    const centerX = 50; // Center X position (50% of the container)
    const centerY = 50; // Center Y position (50% of the container)
    const radius = 200; // Distance from the center to the nodes
    const angleIncrement = (2 * Math.PI) / numberOfNodes;

    for (let i = 0; i < numberOfNodes; i++) {
      const angle = i * angleIncrement;
      const x = centerX + radius * Math.cos(angle); // X position
      const y = centerY + radius * Math.sin(angle); // Y position

      lines.push(
        <line
          key={i}
          x1="50%"
          y1="50%"
          x2={`${x}%`}
          y2={`${y}%`}
          stroke="black"
          strokeWidth="2"
        />,
      );
    }

    return lines;
  };

  return (
    <div className="relative flex h-screen items-center justify-center">
      {/* Central Circle */}
      <div className="z-10 flex h-40 w-40 items-center justify-center rounded-full bg-blue-500 text-center text-white">
        Central Text
      </div>

      {/* SVG for connecting lines */}
      <svg className="absolute left-0 top-0 h-full w-full">
        {generateLines()}
      </svg>

      {/* Nodes */}
      {generateNodes()}
    </div>
  );
};

export default NodeDiagram;
