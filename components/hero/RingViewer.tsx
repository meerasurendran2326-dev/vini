"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const RING_MODEL_URL = "/ring_with_big_black_stone_and_diamond.glb";
useGLTF.preload(RING_MODEL_URL);

function GemRingModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(RING_MODEL_URL);
  const model = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    model.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.metalness = 1;
        mesh.material.roughness = 0.18;
        mesh.material.envMapIntensity = 2.8;
      }

      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((material) => {
          if (material instanceof THREE.MeshStandardMaterial) {
            material.metalness = 1;
            material.roughness = 0.18;
            material.envMapIntensity = 2.8;
          }
        });
      }
    });

    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);
    model.position.sub(center);

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    model.scale.setScalar(3.5 / maxDim);
    model.rotation.set(0.18, 0.8, 0.08);

    if (groupRef.current) {
      groupRef.current.clear();
      groupRef.current.add(model);
    }

    return () => {
      if (groupRef.current) {
        groupRef.current.remove(model);
      }
    };
  }, [model]);

  useFrame(() => {
    if (!groupRef.current) return;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      0.18,
      0.08,
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      0.8,
      0.08,
    );
  });

  return <group ref={groupRef} />;
}

function RingScene() {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[2.6, 3.8, 4.8]}
        intensity={2.8}
        color="#fffaf1"
      />
      <directionalLight
        position={[-3.5, 2.2, 2.8]}
        intensity={1.2}
        color="#eaf1ff"
      />
      <pointLight position={[0, 2.5, 3.6]} intensity={2.2} color="#ffffff" />

      <Suspense fallback={null}>
        <GemRingModel />
      </Suspense>
    </>
  );
}

export default function RingViewer() {
  return (
    <div
      style={{
        width: "32rem",
        height: "32rem",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        background: "transparent",
        overflow: "visible",
        border: "none",
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: "drop-shadow(0 26px 32px rgba(17, 19, 21, 0.16))",
      }}
    >
      <Canvas
        camera={{ position: [0, 0.2, 3.2], fov: 28 }}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          background: "transparent",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000", 0);
        }}
      >
        <RingScene />
      </Canvas>
    </div>
  );
}
