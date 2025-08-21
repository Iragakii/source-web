import { PresentationControls, Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import { Hoho } from "./Hoho";

// npm create vite@latest xxx
// npm install

const Ek = () => {
  // Position of the object
  const objectPosition = [0, 0, 0];

  useFrame(({ clock, camera }) => {
    const elapsedTime = clock.getElapsedTime();

    // Make the camera rotate around the Y-axis
    const radius = 9; // Distance from the object
    const speed = 0.5; // Rotation speed
    camera.position.x = radius * Math.sin(elapsedTime * speed);
    camera.position.z = radius * Math.cos(elapsedTime * speed);
    camera.position.y = 2; // Set height above the object (look down)

    // Make the camera look at the object
    camera.lookAt(objectPosition[0], objectPosition[0], objectPosition[0]);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        shadow-mapSize={2048}
        castShadow
      />
      <PresentationControls
        global
        snap={true}
        rotation={[0, 0.3, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <Hoho position={[0, -0.8, 0]} scale={[0.8, 0.8, 0.8]}></Hoho>
      </PresentationControls>
      {/* <ContactShadows position={[0, -0.1, 0]} opacity={0.75} scale={10} blur={3} far={4} /> */}
      <Environment preset="city" />
    </>
  );
};

export default Ek;
