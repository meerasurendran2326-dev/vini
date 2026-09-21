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

function FloatingRing3DPlane({ imageSrc, isDragging }: RingMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, imageSrc);
  const mousePos = useRef({ x: 0, y: 0 });
  const scrollRot = useRef(0);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16;

    const handleScroll = () => {
      scrollRot.current = window.scrollY * 0.0012;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mousePos.current = {
        // Limit max tilt to +/- 12 degrees (~0.21 rad)
        x: Math.max(-0.21, Math.min(0.21, (e.clientX / innerWidth - 0.5) * 0.4)),
        y: Math.max(-0.21, Math.min(0.21, (e.clientY / innerHeight - 0.5) * 0.4)),
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

    // Slow floating rotation unless dragging
    if (!isDragging) {
      meshRef.current.rotation.y += delta * 0.15;
    }

    // Parallax mouse follow (max +/-12 degrees)
    const targetRotX = mousePos.current.y;
    const targetRotY = meshRef.current.rotation.y + scrollRot.current * 0.01 + mousePos.current.x * 0.01;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.05);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.05);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0.1]} scale={1.85} castShadow receiveShadow>
      {/* 2400px High-Res Cutout Plane */}
      <planeGeometry args={[4.4, 2.4]} />
      <meshStandardMaterial
        map={texture}
        transparent={true}
        alphaTest={0.01}
        metalness={0.95}
        roughness={0.12}
        envMapIntensity={2.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

interface HeroRing3DProps {
  imageSrc?: string;
  fallbackWebp?: string;
  productName?: string;
}

export default function HeroRing3D({
  imageSrc = '/images/ring-cutout.png',
  fallbackWebp = '/images/ring-cutout.webp',
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
      <div className="relative w-full h-[540px] sm:h-[640px] md:h-[740px] mx-auto flex items-center justify-center pointer-events-auto">
        <div className="relative w-[85%] h-[85%] transform hover:scale-105 transition-transform duration-500">
          <Image
            src={fallbackWebp}
            alt={productName}
            fill
            sizes="(max-width: 768px) 90vw, 800px"
            priority
            className="object-contain filter drop-shadow-[0_30px_60px_rgba(15,42,31,0.22)]"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-[560px] sm:h-[660px] md:h-[760px] mx-auto pointer-events-auto cursor-grab active:cursor-grabbing select-none hero-ring-container"
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
    >
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Studio Environment for Cool Metallic Silver Reflections */}
          <Environment preset="studio" background={false} />

          {/* Studio Lighting */}
          <ambientLight intensity={1.9} />
          <directionalLight position={[5, 8, 5]} intensity={3.8} color="#ffffff" />
          <directionalLight position={[-5, -4, -4]} intensity={2.2} color="#dbe2e8" />
          <pointLight position={[0, -2, 3]} intensity={1.2} color="#a9bfae" />

          {/* Floating Ring Bobbing Animation */}
          <Float speed={1.3} rotationIntensity={0.18} floatIntensity={0.35}>
            <FloatingRing3DPlane imageSrc={imageSrc} isDragging={isDragging} />
          </Float>

          {/* Soft Elliptical Contact Shadow directly under the ring on the white floor */}
          <ContactShadows
            position={[0, -1.7, 0]}
            opacity={0.65}
            scale={7.5}
            blur={2.6}
            far={4}
            color="#0F2A1F"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
