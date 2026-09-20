'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as THREE from 'three';
import { initialProducts } from '@/lib/data/initialProducts';
import { Product } from '@/lib/types';

export default function SilverJewellery3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [heroProduct, setHeroProduct] = useState<Product>(initialProducts[0]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true);
      return;
    }

    // Try fetching latest featured product
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products?.length > 0) {
          const featured = data.products.find((p: Product) => p.featured) || data.products[0];
          setHeroProduct(featured);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    // Check WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const container = containerRef.current;
    const width = container.clientWidth || 480;
    const height = container.clientHeight || 520;

    // Scene
    const scene = new THREE.Scene();

    // Camera with safe distance to prevent bottom cropping
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 3D Object Group
    const productGroup = new THREE.Group();

    // Create radial alpha mask canvas for seamless edge fading (no rectangular edges)
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = 512;
    maskCanvas.height = 512;
    const maskCtx = maskCanvas.getContext('2d');
    if (maskCtx) {
      const grad = maskCtx.createRadialGradient(256, 256, 120, 256, 256, 250);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.7, 'rgba(255,255,255,0.95)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      maskCtx.fillStyle = grad;
      maskCtx.fillRect(0, 0, 512, 512);
    }
    const alphaTexture = new THREE.CanvasTexture(maskCanvas);

    // Load Real Product Texture
    const textureLoader = new THREE.TextureLoader();
    const productImgSrc = heroProduct.images[0] || '/images/products/pdt-1.jpeg';

    textureLoader.load(productImgSrc, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;

      // Layer 1: Soft Contact Shadow Plane underneath
      const shadowGeo = new THREE.PlaneGeometry(3.6, 1.2);
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = 256;
      shadowCanvas.height = 128;
      const sCtx = shadowCanvas.getContext('2d');
      if (sCtx) {
        const sGrad = sCtx.createRadialGradient(128, 64, 10, 128, 64, 110);
        sGrad.addColorStop(0, 'rgba(6, 17, 12, 0.85)');
        sGrad.addColorStop(0.5, 'rgba(11, 26, 18, 0.45)');
        sGrad.addColorStop(1, 'rgba(3, 5, 4, 0)');
        sCtx.fillStyle = sGrad;
        sCtx.fillRect(0, 0, 256, 128);
      }
      const shadowTex = new THREE.CanvasTexture(shadowCanvas);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2.2;
      shadowMesh.position.set(0, -1.65, -0.4);
      productGroup.add(shadowMesh);

      // Layer 2: Main Textured Plane with real product & radial alpha mask
      const planeGeo = new THREE.PlaneGeometry(3.2, 3.2, 32, 32);
      const planeMat = new THREE.MeshStandardMaterial({
        map: texture,
        alphaMap: alphaTexture,
        transparent: true,
        metalness: 0.85,
        roughness: 0.22,
        side: THREE.DoubleSide,
      });
      const productMesh = new THREE.Mesh(planeGeo, planeMat);
      productMesh.position.set(0, 0.05, 0);
      productGroup.add(productMesh);

      // Layer 3: Depth Backplane (offset slightly behind for optical body)
      const backplaneMat = new THREE.MeshStandardMaterial({
        map: texture,
        alphaMap: alphaTexture,
        transparent: true,
        color: new THREE.Color(0x9aa39d),
        metalness: 0.9,
        roughness: 0.35,
        side: THREE.DoubleSide,
      });
      const backMesh = new THREE.Mesh(planeGeo, backplaneMat);
      backMesh.position.set(0, 0.05, -0.05);
      backMesh.scale.set(0.98, 0.98, 0.98);
      productGroup.add(backMesh);
    });

    scene.add(productGroup);

    // Studio Lighting: White key light + soft green-white rim light
    const ambientLight = new THREE.AmbientLight(0x0a0f0c, 3.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4d7da, 3.0);
    rimLight.position.set(-5, -3, -3);
    scene.add(rimLight);

    // Soft Green-White Underglow beneath object
    const greenGlow = new THREE.PointLight(0x8fb89a, 2.2, 9);
    greenGlow.position.set(0, -1.8, 2);
    scene.add(greenGlow);

    // Interactive pointer drag / hover with max +/-25 degree tilt limit (~0.44 rad)
    let pointerX = 0;
    let pointerY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let dragRotY = 0;
    let dragRotX = 0;

    const maxTilt = 0.44; // ~25 degrees

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        dragRotY += deltaX * 0.008;
        dragRotX += deltaY * 0.008;
        dragRotX = Math.max(-maxTilt, Math.min(maxTilt, dragRotX));
        dragRotY = Math.max(-maxTilt, Math.min(maxTilt, dragRotY));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Slow float & hover tilt (confined to +/-25 degrees)
      const hoverTiltY = Math.max(-maxTilt, Math.min(maxTilt, pointerX * 0.35 + dragRotY));
      const hoverTiltX = Math.max(-maxTilt, Math.min(maxTilt, -pointerY * 0.35 + dragRotX + Math.sin(elapsed * 0.8) * 0.06));

      productGroup.rotation.y += (hoverTiltY - productGroup.rotation.y) * 0.06;
      productGroup.rotation.x += (hoverTiltX - productGroup.rotation.x) * 0.06;
      productGroup.position.y = Math.sin(elapsed * 1.4) * 0.08;

      // Soft moving specular sheen
      keyLight.position.x = 4 + Math.sin(elapsed * 1.1) * 1.5;

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
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [heroProduct, reducedMotion]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[460px] sm:h-[500px] md:h-[560px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
    >
      {/* Real Product Hairline Label */}
      <div className="absolute top-2 right-2 sm:right-4 z-20 pointer-events-auto">
        <Link
          href={`/product/${heroProduct.slug}`}
          className="group flex items-center space-x-2 px-3 py-1.5 rounded-full border border-line bg-surface/75 backdrop-blur-md text-[10px] font-mono uppercase tracking-widest text-muted hover:text-text hover:border-green transition-all"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
          <span className="truncate max-w-[180px] sm:max-w-[240px]">
            {heroProduct.name}
          </span>
          <span className="text-text font-semibold">
            ₹{heroProduct.price.toLocaleString('en-IN')}
          </span>
        </Link>
      </div>

      {/* Fallback for WebGL failure, reduced motion, or mobile low-power */}
      {(!webGlSupported || reducedMotion) && (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
          <Image
            src={heroProduct.images[0] || '/images/products/pdt-1.jpeg'}
            alt={heroProduct.name}
            width={440}
            height={440}
            priority
            className="object-contain max-h-[360px] rounded-full drop-shadow-[0_20px_35px_rgba(11,26,18,0.7)]"
          />
        </div>
      )}

      {/* Interactive 3D Showroom Hint */}
      <div className="absolute bottom-2 inset-x-0 flex items-center justify-center pointer-events-none">
        <div className="px-3 py-1 rounded-full border border-line bg-surface/60 backdrop-blur-md text-[9px] font-mono uppercase tracking-[0.14em] text-muted flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green" />
          <span>Interactive 3D Showroom • Drag or Hover to Inspect</span>
        </div>
      </div>
    </div>
  );
}
