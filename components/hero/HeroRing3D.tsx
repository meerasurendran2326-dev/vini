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

function FloatingRingFigure({ imageSrc, isDragging }: RingMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, imageSrc);
  const mousePos = useRef({ x: 0, y: 0 });
  const scrollRot = useRef(0);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const handleScroll = () => {
      scrollRot.current = window.scrollY * 0.0015;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mousePos.current = {
        x: (e.clientX / innerWidth - 0.5) * 0.3,
        y: (e.clientY / innerHeight - 0.5) * 0.3,
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
    if (!meshRef.current) return;

    if (!isDragging) {
      meshRef.current.rotation.y += delta * 0.2;
    }

    const targetRotX = mousePos.current.y * 0.25;
    const targetRotY = meshRef.current.rotation.y + scrollRot.current * 0.01 + mousePos.current.x * 0.015;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.05);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.05);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0.1]} scale={1.25} castShadow receiveShadow>
      <planeGeometry args={[3.8, 2.6]} />
      <meshStandardMaterial
        map={texture}
        transparent={true}
        alphaTest={0.02}
        metalness={0.92}
        roughness={0.12}
        envMapIntensity={2.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

interface HeroRing3DProps {
  imageSrc?: string;
  productName?: string;
}

export default function HeroRing3D({
  imageSrc = '/images/products/aethelgard-ring-nobg.png',
  productName = 'Aethelgard Hand-Carved Sovereign Ring',
}: HeroRing3DProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
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
      <div className="relative w-[360px] sm:w-[460px] md:w-[540px] h-[360px] sm:h-[460px] md:h-[540px] mx-auto flex items-center justify-center pointer-events-auto">
        <div className="relative w-full h-full transform hover:scale-105 transition-transform duration-500">
          <Image
            src={imageSrc}
            alt={productName}
            fill
            sizes="(max-width: 768px) 360px, 540px"
            priority
            className="object-contain drop-shadow-[0_25px_50px_rgba(15,42,31,0.25)]"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-[380px] sm:w-[480px] md:w-[560px] h-[380px] sm:h-[480px] md:h-[560px] mx-auto pointer-events-auto cursor-grab active:cursor-grabbing select-none hero-ring-container"
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
    >
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.4], fov: 42 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Environment preset="studio" background={false} />

          <ambientLight intensity={1.8} />
          <directionalLight position={[5, 8, 5]} intensity={3.8} color="#ffffff" />
          <directionalLight position={[-5, -4, -4]} intensity={2.2} color="#dbe2e8" />
          <pointLight position={[0, -2, 3]} intensity={1.2} color="#a9bfae" />

          <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.4}>
            <FloatingRingFigure imageSrc={imageSrc} isDragging={isDragging} />
          </Float>

          <ContactShadows
            position={[0, -1.6, 0]}
            opacity={0.65}
            scale={6.0}
            blur={2.5}
            far={4}
            color="#0F2A1F"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
