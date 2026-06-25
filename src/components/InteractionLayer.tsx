import { useEffect } from "react";

import { shouldReduceEffects } from "@/lib/perf";

const INTERACTIVE_SELECTOR =
  "button, a, [data-card], .project-card, .highlight-card, .card-hover";

const TILT_SELECTOR = "[data-card], .project-card, .highlight-card, .card-hover";

export default function InteractionLayer() {
  useEffect(() => {
    if (typeof window === "undefined" || shouldReduceEffects()) return;

    const root = document.documentElement;
    const finePointer = window.matchMedia?.("(pointer: fine)")?.matches ?? true;
    if (!finePointer) return;

    let raf = 0;
    let nextX = window.innerWidth / 2;
    let nextY = window.innerHeight / 2;

    const updateCursor = () => {
      raf = 0;
      root.style.setProperty("--cursor-x", `${nextX}px`);
      root.style.setProperty("--cursor-y", `${nextY}px`);
    };

    const onPointerMove = (event: PointerEvent) => {
      nextX = event.clientX;
      nextY = event.clientY;
      if (!raf) raf = window.requestAnimationFrame(updateCursor);

      const target = event.target as Element | null;
      const interactive = target?.closest<HTMLElement>(INTERACTIVE_SELECTOR);
      const tilt = target?.closest<HTMLElement>(TILT_SELECTOR);

      if (interactive) {
        const rect = interactive.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        interactive.style.setProperty("--spot-x", `${x}px`);
        interactive.style.setProperty("--spot-y", `${y}px`);

        if (interactive.matches("button, a")) {
          const moveX = ((x / rect.width) - 0.5) * 6;
          const moveY = ((y / rect.height) - 0.5) * 5;
          interactive.style.setProperty("--magnetic-x", `${moveX}px`);
          interactive.style.setProperty("--magnetic-y", `${moveY}px`);
          interactive.classList.add("magnetic-active");
        }
      }

      if (tilt) {
        const rect = tilt.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        tilt.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
        tilt.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
        tilt.classList.add("tilt-active");
      }
    };

    const onPointerOut = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const current = target?.closest<HTMLElement>(INTERACTIVE_SELECTOR);
      if (!current) return;

      const related = event.relatedTarget as Element | null;
      if (related && current.contains(related)) return;

      current.classList.remove("magnetic-active", "tilt-active");
      current.style.removeProperty("--magnetic-x");
      current.style.removeProperty("--magnetic-y");
      current.style.removeProperty("--tilt-x");
      current.style.removeProperty("--tilt-y");
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      if (raf) window.cancelAnimationFrame(raf);
      root.style.removeProperty("--cursor-x");
      root.style.removeProperty("--cursor-y");
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="interaction-layer pointer-events-none fixed inset-0 z-[2] motion-reduce:hidden"
    />
  );
}
