import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import model from '../../res/model/scene.gltf';

const Mesh = () => {
  const gltf = useLoader(GLTFLoader, model);
  const [rotation, setRotation] = useState(0);

  useFrame((state, delta) => {
    setRotation(rotation + 0.005);
  });

  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <primitive
        object={gltf.scene}
        rotation={[0.4, rotation, 0]}
        scale={[1.0, 1.0, 1.0]}
        position={[0, 0, 0]}
      />
    </>
  );
};

export default () => {
  return (
    <Suspense fallback={null}>
      <Canvas>
        <Mesh />
      </Canvas>
    </Suspense>
  );
};
