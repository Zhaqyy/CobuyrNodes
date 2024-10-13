import * as THREE from "three";
import {
  createContext,
  useMemo,
  useRef,
  useState,
  useContext,
  useLayoutEffect,
  forwardRef,
  useEffect,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, QuadraticBezierLine, Text, useTexture } from "@react-three/drei";
import { useDrag } from "@use-gesture/react";

const context = createContext();

const Circle = forwardRef(
  (
    {
      children,
      opacity = 1,
      radius = 0.05,
      segments = 32,
      color = "#ff1050",
      ...props
    },
    ref
  ) => (
    <mesh ref={ref} {...props}>
      <circleGeometry args={[radius, segments]} />
      <meshBasicMaterial
        transparent={opacity < 1}
        opacity={opacity}
        color={color}
      />
      {children}
    </mesh>
  )
);

// Connections and line logic
export function Nodes({ children }) {
  const group = useRef();
  const [nodes, set] = useState([]);
  const lines = useMemo(() => {
    const lines = [];
    for (let node of nodes)
      node.connectedTo
        .map((ref) => [node.position, ref.current.position])
        .forEach(([start, end]) =>
          lines.push({
            start: start.clone().add({ x: 0.4, y: 0, z: 0 }),
            end: end.clone().add({ x: -0.4, y: 0, z: 0 }),
          })
        );
    return lines;
  }, [nodes]);
  useFrame((_, delta) =>
    group.current.children.forEach(
      (group) =>
        (group.children[0].material.uniforms.dashOffset.value -= delta * 10)
    )
  );
  return (
    <context.Provider value={set}>
      <group ref={group}>
        {lines.map((line, index) => (
          <group>
            <QuadraticBezierLine
              key={index}
              {...line}
              color="white"
              dashed
              dashScale={50}
              gapSize={20}
            />
            <QuadraticBezierLine
              key={index}
              {...line}
              color="white"
              lineWidth={0.5}
              transparent
              opacity={0.1}
            />
          </group>
        ))}
      </group>
      {children}
      {lines.map(({ start, end }, index) => (
        <group key={index} position-z={-1}>
          <Circle position={start} color={"#ffffff"} />
          <Circle position={end} color={"#ffffff"} />
        </group>
      ))}
    </context.Provider>
  );
}

// the node logic

export const Node = forwardRef(
  (
    {
      color = "black",
      name,
      monetaryValue,
      connectedTo = [],
      position = [0, 0, 0],
      profileImage,
      ...props
    },
    ref
  ) => {
    const set = useContext(context);
    const { size, camera } = useThree();
    const [pos, setPos] = useState(() => new THREE.Vector3(...position));
    const state = useMemo(
      () => ({ position: pos, connectedTo }),
      [pos, connectedTo]
    );
    const texture = useTexture(profileImage); // Load the profile image as texture

    const [hovered, setHovered] = useState(false);
    const [showInfo, setShowInfo] = useState(false); // Track if the info box should be shown

    // Register node in the context on mount
    useEffect(() => {
      set((nodes) => [...nodes, state]);
      return () => set((nodes) => nodes.filter((n) => n !== state));
    }, [set, state]);

    // Handle drag to update position
    const bind = useDrag(({ down, xy: [x, y] }) => {
      document.body.style.cursor = down ? "grabbing" : "grab";
      setPos(
        new THREE.Vector3(
          (x / size.width) * 2 - 1,
          -(y / size.height) * 2 + 1,
          0
        )
          .unproject(camera)
          .multiplyScalar(1) // keep the node on 2D plane
      );
    });


    // useEffect(() => {
    //   if (ref.current) {
    //     applyRepulsion(ref.current.parent.children, ref.current);
    //   }
    // }, []);

// Repulsion logic
useFrame(() => {
  if (ref.current) {
    applyRepulsion(ref.current.parent.children, ref.current);
  }
});
    return (
      <group
        ref={ref}
        {...bind()}
        position={pos}
        onPointerOver={() => {
          setHovered(true);
          setShowInfo(true);
        }}
        onPointerOut={() => {
          setHovered(false);
          setShowInfo(false);
        }}
        {...props}
      >
        <mesh>
          {/* Outer Circle */}
          <circleGeometry args={[0.4, 32]} />
          <meshBasicMaterial color={hovered ? "#ff1050" : color} />
        </mesh>

        {/* Inner Circle with texture */}
        <mesh position={[0, 0, 0.1]}>
          <circleGeometry args={[0.325, 32]} />
          <meshBasicMaterial map={texture} />
        </mesh>

        {/* Text label */}
        <Text position={[0, -0.55, 1]} fontSize={0.2}>
          {name}
        </Text>

        {/* Info box (HTML) */}
        {showInfo && (
          <Html position={[0.5, 0, 0.1]} style={{ pointerEvents: "none" }}>
            <div
              style={{
                color: "#fff",
                backgroundColor: "#333",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              <strong>{name}</strong>
              <br />
              Value: ${monetaryValue}
              <br />
              Connections: {connectedTo.length}
            </div>
          </Html>
        )}
      </group>
    );
  }
);
// Apply repulsion logic
function applyRepulsion(nodes, currentNode, threshold = 0.9) {
  for (let otherNode of nodes) {
    if (otherNode !== currentNode) {
      const currentPosition = currentNode.position;
      const otherPosition = otherNode.position;

      const distance = currentPosition.distanceTo(otherPosition);
      if (distance < threshold) {
        const direction = currentPosition.clone().sub(otherPosition).normalize();
        const repulsionForce = direction.multiplyScalar(0.05); // Strength of the repulsion
        currentNode.position.add(repulsionForce);
      }
    }
  }
}