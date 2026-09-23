"use client";

import { useEffect } from "react";

const SELECTOR =
  "section, article, .product-card, .shop-card, .card, [data-scroll-reveal]";

export default function ScrollAnimations() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const elements = Array.from(
      document.querySelectorAll(SELECTOR),
    ) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;
          element.classList.add("is-visible");
          observer.unobserve(element);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    elements.forEach((element) => {
      if (element.classList.contains("scroll-reveal-section")) return;

      element.classList.add("scroll-reveal-section");

      const delay = Number.parseFloat(
        element.dataset.scrollRevealDelay || element.dataset.delay || "0",
      );

      if (!Number.isNaN(delay)) {
        element.style.setProperty("--scroll-reveal-delay", `${delay}ms`);
      }

      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
