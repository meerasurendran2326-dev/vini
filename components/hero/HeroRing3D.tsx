'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import Image from 'next/image';

interface RingMeshProps {
  imageSrc: string;
  isDragging: boolean;
}

function SignetRingMesh({ imageSrc, isDragging }: RingMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, imageSrc);
  const scrollRotY = useRef(0);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;

    const handleScroll = () => {
      scrollRotY.current = window.scrollY * 0.002;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mousePos.current = {
        x: (e.clientX / innerWidth - 0.5) * 0.4,
        y: (e.clientY / innerHeight - 0.5) * 0.4,
      };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [texture]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Slow continuous auto-rotation unless dragging
    if (!isDragging) {
      groupRef.current.rotation.y += delta * 0.4;
    }

    // Gentle mouse parallax + page scroll rotation damping
    const targetRotX = mousePos.current.y * 0.5;
    const targetRotY = groupRef.current.rotation.y + scrollRotY.current * 0.01 + mousePos.current.x * 0.02;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
  });

  return (
    <group ref={groupRef} scale={1.15} position={[0, 0.1, 0]}>
      {/* Outer 3D Silver Signet Bevel Ring Band */}
      <mesh position={[0, 0, -0.05]} castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.35, 0.35, 64, 1, false]} />
        <meshStandardMaterial
          color="#dcdfe2"
          metalness={0.96}
          roughness={0.12}
          envMapIntensity={2.8}
        />
      </mesh>

      {/* Front Octagonal / Rounded Planar Face with Product Texture */}
      <mesh position={[0, 0, 0.13]} castShadow receiveShadow>
        <cylinderGeometry args={[1.28, 1.28, 0.08, 64]} />
        <meshStandardMaterial
          map={texture}
          metalness={0.88}
          roughness={0.18}
          envMapIntensity={2.2}
        />
      </mesh>

      {/* Inner Beveled Rim Highlight */}
      <mesh position={[0, 0, 0.18]}>
        <torusGeometry args={[1.28, 0.04, 32, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.98}
          roughness={0.08}
          envMapIntensity={3.2}
        />
      </mesh>
    </group>
  );
}

interface HeroRing3DProps {
  imageSrc?: string;
  productName?: string;
}

export default function HeroRing3D({
  imageSrc = '/images/products/pdt-1.jpeg',
  productName = 'Aethelgard Hand-Carved Sovereign',
}: HeroRing3DProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    // Check reduced motion or mobile low power
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsLowPower(true);
    }
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setIsSupported(false);
    } catch {
      setIsSupported(false);
    }
  }, []);

  if (!isSupported || isLowPower) {
    return (
      <div className="relative w-[320px] sm:w-[420px] md:w-[480px] h-[320px] sm:h-[420px] md:h-[480px] mx-auto flex items-center justify-center pointer-events-auto">
        <div className="relative w-full h-full transform hover:scale-105 transition-transform duration-500">
          <Image
            src={imageSrc}
            alt={productName}
            fill
            sizes="(max-width: 768px) 320px, 480px"
            priority
            className="object-contain rounded-full shadow-[0_25px_50px_rgba(15,42,31,0.2)]"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-[340px] sm:w-[440px] md:w-[520px] h-[340px] sm:h-[440px] md:h-[520px] mx-auto pointer-events-auto cursor-grab active:cursor-grabbing select-none hero-ring-container"
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
    >
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.6], fov: 42 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Studio Chrome Environment for realistic metallic reflections */}
          <Environment preset="studio" background={false} />

          {/* Key lights for crisp specular highlights */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 8, 5]} intensity={3.5} color="#ffffff" />
          <directionalLight position={[-5, -4, -4]} intensity={2.0} color="#dbe2e8" />
          <pointLight position={[0, -2, 3]} intensity={1.2} color="#a9bfae" />

          {/* Floating interactive ring */}
          <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
            <SignetRingMesh imageSrc={imageSrc} isDragging={isDragging} />
          </Float>

          {/* Contact shadow directly on page floor */}
          <ContactShadows
            position={[0, -1.65, 0]}
            opacity={0.65}
            scale={5.8}
            blur={2.4}
            far={4}
            color="#0F2A1F"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
