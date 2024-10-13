import { useState, createRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Nodes, Node } from "./Nodes";
import { nodesData } from "./assets/NodesData.jsx"; // import the data

// Function to generate random positions around a circle
function generateCircularPositions(numNodes, radius = 2) {
  const angleStep = (Math.PI * 2) / numNodes;
  return Array.from({ length: numNodes }, (_, i) => {
    const angle = angleStep * i + Math.random() * angleStep * 0.5; // Add slight randomness
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return [x, y, 0];
  });
}

export default function App() {
  // Create references for each node dynamically
  const nodeRefs = useState(() => nodesData.map(() => createRef()))[0];
  // Generate positions dynamically
  const positions = generateCircularPositions(nodesData.length, 3);

  return (
    <Canvas orthographic camera={{ zoom: 80 }}>
      <Nodes>
        {nodesData.map((nodeData, index) => (
          <Node
            key={nodeData.id}
            ref={nodeRefs[index]}
            name={nodeData.name}
            color={nodeData.color}
            // profileImage={nodeData.profileImage}
            profileImage={`profile/${nodeData.id}.webp`}
            position={positions[index]} // Dynamic positioning
            monetaryValue={nodeData.monetaryValue}
            connectedTo={nodeData.connections.map(
              (connId) => nodeRefs[nodesData.findIndex((n) => n.id === connId)]
            )} // Map connections to refs dynamically
          />
        ))}
      </Nodes>
    </Canvas>
  );
}
