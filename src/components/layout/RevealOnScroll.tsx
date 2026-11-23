"use client";

import { useEffect } from "react";

/**
 * Entrance animations for storefront blocks ([data-ws-anim], set by BlockRenderer
 * from the block's «انیمیشن ورود» setting).
 *
 * Fail-safe by design: an element is only hidden (.ws-arm) at the moment it is
 * handed to the IntersectionObserver, so anything this script never sees —
 * no JS, streamed content, an error — simply stays visible. Content that
 * streams in later is picked up by a MutationObserver. Elements already on
 * screen are never hidden (no flash). Not mounted in the builder canvas.
 */
export default function RevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("ws-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );

    const arm = (el: HTMLElement) => {
      if (el.dataset.wsArmed) return;
      el.dataset.wsArmed = "1";
      // On screen (or above it) right now: leave visible
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return;
      el.classList.add("ws-arm");
      io.observe(el);
    };
    const scan = (root: ParentNode) => root.querySelectorAll<HTMLElement>("[data-ws-anim]").forEach(arm);

    scan(document);
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return;
          if (n.matches("[data-ws-anim]")) arm(n);
          scan(n);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
      // Never leave anything hidden behind
      document.querySelectorAll(".ws-arm:not(.ws-in)").forEach((el) => el.classList.add("ws-in"));
    };
  }, []);
  return null;
}
