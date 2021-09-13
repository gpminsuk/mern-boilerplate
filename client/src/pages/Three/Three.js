import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import model from '../../res/model/scene.gltf';

export default () => {
  const gltf = useLoader(GLTFLoader, model);

  return (
    <Suspense fallback={null}>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <primitive
          rotation={[0.4, 0, 0]}
          object={gltf.scene}
          scale={[1.0, 1.0, 1.0]}
          position={[0, 0, 0]}
        />
      </Canvas>
    </Suspense>
  );
};
