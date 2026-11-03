"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

const motionItemSelector = [
  ".proposal-grid-card",
  ".interior-service-tile",
  ".industry-story",
  ".solution-chain > div",
].join(",");

type MotionItemSnapshot = {
  motionItem: string | null;
  delay: string;
  delayPriority: string;
};

/**
 * Progressive enhancement for public sections. Server-rendered content remains
 * visible; only below-the-fold sections receive motion state after the observer
 * is ready. One observer is owned by each public route mount and is fully
 * disconnected when the App Router changes pathname.
 */
export function MotionEnhancer() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/api")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main section:not([data-motion='off'])",
      ),
    );
    const belowFoldSections = sections.filter(
      (section) => section.getBoundingClientRect().top > window.innerHeight * 0.72,
    );

    if (belowFoldSections.length === 0) return;

    const previousSectionState = new Map<HTMLElement, string | null>();
    const previousInstantState = new Map<HTMLElement, string | null>();
    const previousItemState = new Map<HTMLElement, MotionItemSnapshot>();
    const pendingInstantFrames = new Map<HTMLElement, number>();
    let observer: IntersectionObserver;

    const prepareMotionItems = (section: HTMLElement) => {
      const items = Array.from(
        section.querySelectorAll<HTMLElement>(motionItemSelector),
      );

      items.forEach((item, index) => {
        if (!previousItemState.has(item)) {
          previousItemState.set(item, {
            motionItem: item.getAttribute("data-motion-item"),
            delay: item.style.getPropertyValue("--motion-delay"),
            delayPriority: item.style.getPropertyPriority("--motion-delay"),
          });
        }
        item.dataset.motionItem = "pending";
        item.style.setProperty(
          "--motion-delay",
          `${Math.min(index * 85, 340)}ms`,
        );
      });
    };

    const reveal = (section: HTMLElement, immediate = false) => {
      const isPending = section.dataset.motion === "pending";
      if (!isPending && !immediate) return;
      if (!isPending && immediate) {
        const isTransitioning = section
          .getAnimations({ subtree: true })
          .some((animation) => animation.playState === "running");
        if (!isTransitioning) return;
      }
      if (immediate) section.dataset.motionInstant = "true";
      if (isPending) {
        section.dataset.motion = "visible";
        section
          .querySelectorAll<HTMLElement>("[data-motion-item='pending']")
          .forEach((item) => {
            item.dataset.motionItem = "visible";
          });
      }

      if (immediate) {
        // Apply the final state with transitions disabled before the next paint,
        // so the element under a pointer/focus cannot move away from the input.
        void getComputedStyle(section).transform;
        const frame = window.requestAnimationFrame(() => {
          pendingInstantFrames.delete(section);
          const previousState = previousInstantState.get(section);
          if (previousState === null || previousState === undefined) {
            section.removeAttribute("data-motion-instant");
          } else {
            section.setAttribute("data-motion-instant", previousState);
          }
        });
        pendingInstantFrames.set(section, frame);
      }
      observer.unobserve(section);
    };

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -8% 0px" },
    );

    for (const section of belowFoldSections) {
      previousSectionState.set(section, section.getAttribute("data-motion"));
      previousInstantState.set(section, section.getAttribute("data-motion-instant"));
      prepareMotionItems(section);
      section.dataset.motion = "pending";
      observer.observe(section);
    }

    const revealFocusedSection = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const section = event.target.closest<HTMLElement>(
        "main section[data-motion='pending'], main section[data-motion='visible']",
      );
      if (section) reveal(section, true);
    };

    const revealHoveredSection = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      const section = event.target.closest<HTMLElement>(
        "main section[data-motion='pending'], main section[data-motion='visible']",
      );
      if (section) reveal(section, true);
    };

    const revealInteractedSection = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      const section = event.target.closest<HTMLElement>(
        "main section[data-motion='pending'], main section[data-motion='visible']",
      );
      if (section) reveal(section, true);
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionPreference = (event: MediaQueryListEvent) => {
      if (event.matches) {
        for (const section of belowFoldSections) reveal(section);
      }
    };

    document.addEventListener("focusin", revealFocusedSection);
    document.addEventListener("pointerover", revealHoveredSection);
    document.addEventListener("pointerdown", revealInteractedSection, true);
    reducedMotion.addEventListener("change", handleMotionPreference);

    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", revealFocusedSection);
      document.removeEventListener("pointerover", revealHoveredSection);
      document.removeEventListener("pointerdown", revealInteractedSection, true);
      reducedMotion.removeEventListener("change", handleMotionPreference);

      for (const frame of pendingInstantFrames.values()) {
        window.cancelAnimationFrame(frame);
      }
      pendingInstantFrames.clear();

      for (const [section, previousState] of previousSectionState) {
        if (previousState === null) section.removeAttribute("data-motion");
        else section.setAttribute("data-motion", previousState);
      }

      for (const [section, previousState] of previousInstantState) {
        if (previousState === null) section.removeAttribute("data-motion-instant");
        else section.setAttribute("data-motion-instant", previousState);
      }

      for (const [item, previousState] of previousItemState) {
        if (previousState.motionItem === null) {
          item.removeAttribute("data-motion-item");
        } else {
          item.setAttribute("data-motion-item", previousState.motionItem);
        }
        if (previousState.delay) {
          item.style.setProperty(
            "--motion-delay",
            previousState.delay,
            previousState.delayPriority,
          );
        } else {
          item.style.removeProperty("--motion-delay");
        }
      }
    };
  }, [pathname]);

  return null;
}
