import React, { useEffect, useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";

const Space = ({path,sizes}:{path?:string,sizes?:[number,number,number]}) => {
  const group = useRef<Group>(null);
  const { nodes, animations, scene } = useGLTF(`${path?path:'/naruto.glb'}`) as any;
  const { actions, names } = useAnimations(animations, scene);

  useEffect(() => {
    // Play all animations and log any issues
    names.forEach((name, index) => {
      const action = actions[name];
      if (action) {
        action.reset().fadeIn(0.5).play();
      } else {
        console.error(`Animation not found for name: ${name} at index ${index}`);
      }
    });

    return () => {
      // Cleanup animation actions
      names.forEach((name) => {
        const action = actions[name];
        if (action) {
          action.fadeOut(0.5).stop();
        }
      });
    };
  }, [actions, names]);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.01; // Adjust the rotation speed as needed
    }
  });

  return (
    <group ref={group} position={[0, -2, 0]} scale={sizes||[1.6, 1.6, 1.6]}>
      <primitive object={scene} />
    </group>
  );
};

export default Space;
