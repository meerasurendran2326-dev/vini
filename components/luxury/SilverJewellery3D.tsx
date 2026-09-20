'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function SilverJewellery3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const container = containerRef.current;
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Geometry: Sculpted Silver Ring (Torus with bespoke bevels + inner core)
    const ringGroup = new THREE.Group();

    // Main heavy band
    const torusGeo = new THREE.TorusGeometry(1.9, 0.55, 32, 100);
    const silverMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E6E8EA'),
      metalness: 0.96,
      roughness: 0.16,
      envMapIntensity: 1.5,
    });

    const ringMesh = new THREE.Mesh(torusGeo, silverMaterial);
    ringGroup.add(ringMesh);

    // Recessed architectural bezel / signet face
    const bezelGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.45, 8);
    bezelGeo.rotateX(Math.PI / 2);
    bezelGeo.translate(0, 1.95, 0);
    const darkSilverMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#3A3D40'),
      metalness: 0.98,
      roughness: 0.28,
    });
    const bezelMesh = new THREE.Mesh(bezelGeo, darkSilverMaterial);
    ringGroup.add(bezelMesh);

    // Floating micro silver accents / particle spheres
    const particlesGroup = new THREE.Group();
    const sphereGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const particleMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      metalness: 1.0,
      roughness: 0.05,
    });

    for (let i = 0; i < 16; i++) {
      const p = new THREE.Mesh(sphereGeo, particleMat);
      const angle = (i / 16) * Math.PI * 2;
      const radius = 2.8 + (Math.random() - 0.5) * 0.8;
      p.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        (Math.random() - 0.5) * 1.5
      );
      particlesGroup.add(p);
    }
    ringGroup.add(particlesGroup);

    scene.add(ringGroup);

    // Lighting (Controlled studio lighting for sharp silver specular glints)
    const ambientLight = new THREE.AmbientLight(0x0a0a0a, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xd4d7da, 4.0);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 3.5);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    const subtleGreenLight = new THREE.PointLight(0x6c8f72, 1.2, 10);
    subtleGreenLight.position.set(0, -3, 3);
    scene.add(subtleGreenLight);

    // Interactive mouse movement
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.5;
    let targetRotY = 0.5;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
    };

    container.addEventListener('mousemove', handlePointerMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Continuous slow showroom drift
      targetRotY += delta * 0.45;
      targetRotX = Math.sin(elapsed * 0.6) * 0.25;

      // Mouse influence
      const finalTargetY = targetRotY + mouseX * 0.8;
      const finalTargetX = targetRotX - mouseY * 0.6;

      ringGroup.rotation.y += (finalTargetY - ringGroup.rotation.y) * 0.05;
      ringGroup.rotation.x += (finalTargetX - ringGroup.rotation.x) * 0.05;
      ringGroup.position.y = Math.sin(elapsed * 1.2) * 0.12;

      particlesGroup.rotation.z += delta * 0.1;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[380px] sm:h-[450px] md:h-[520px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
    >
      {/* 3D Canvas mounts here */}
      {!webGlSupported && (
        <div className="flex flex-col items-center justify-center text-center p-6 border border-steel/50 bg-carbon">
          <p className="text-xs uppercase tracking-widest text-silver">
            Solid 925 Sterling Silver Ring Specimen
          </p>
        </div>
      )}

      {/* Subtle bottom indicator */}
      <div className="absolute bottom-4 inset-x-0 flex items-center justify-center pointer-events-none">
        <div className="px-4 py-1.5 rounded-full border border-steel/40 bg-graphite/60 backdrop-blur-md text-[10px] font-sans uppercase tracking-widest text-silver/70 flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-bright-silver animate-pulse" />
          <span>Interactive 3D Showroom • Drag or Hover to Inspect</span>
        </div>
      </div>
    </div>
  );
}
