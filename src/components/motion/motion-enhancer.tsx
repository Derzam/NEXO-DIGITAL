"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Progressive enhancement for public sections. No section is hidden in the
 * server-rendered HTML; only below-the-fold sections are marked after mount.
 */
export function MotionEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/api")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main section:not([data-motion='off'])"),
    );
    const belowFoldSections = sections.filter(
      (section) => section.getBoundingClientRect().top > window.innerHeight * 0.72,
    );

    if (belowFoldSections.length === 0) return;

    const reveal = (section: HTMLElement) => {
      section.dataset.motion = "visible";
      observer.unobserve(section);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -8% 0px" },
    );

    for (const section of belowFoldSections) {
      section.dataset.motion = "pending";
      observer.observe(section);
    }

    const revealFocusedSection = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const section = event.target.closest<HTMLElement>(
        "main section[data-motion='pending']",
      );
      if (section) reveal(section);
    };

    const revealHoveredSection = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      const section = event.target.closest<HTMLElement>(
        "main section[data-motion='pending']",
      );
      if (section) reveal(section);
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionPreference = (event: MediaQueryListEvent) => {
      if (event.matches) {
        for (const section of belowFoldSections) {
          if (section.dataset.motion === "pending") reveal(section);
        }
      }
    };

    document.addEventListener("focusin", revealFocusedSection);
    document.addEventListener("pointerover", revealHoveredSection);
    reducedMotion.addEventListener("change", handleMotionPreference);

    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", revealFocusedSection);
      document.removeEventListener("pointerover", revealHoveredSection);
      reducedMotion.removeEventListener("change", handleMotionPreference);
      for (const section of belowFoldSections) {
        if (section.dataset.motion === "pending" || section.dataset.motion === "visible") {
          delete section.dataset.motion;
        }
      }
    };
  }, [pathname]);

  return null;
}
