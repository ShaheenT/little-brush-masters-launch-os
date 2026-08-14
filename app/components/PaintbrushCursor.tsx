"use client";

import { useEffect, useRef } from "react";

export default function PaintbrushCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const paintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const paint = paintRef.current;

    if (!cursor || !paint) return;

    // Disable on touch devices
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches;

    if (isTouchDevice) return;

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      paint.style.left = `${mouseX}px`;
      paint.style.top = `${mouseY}px`;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;

      cursor.style.transform = `
        translate3d(${currentX}px, ${currentY}px, 0)
        rotate(-18deg)
      `;

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animation = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animation);
    };
  }, []);

  return (
    <>
      {/* Paintbrush */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="paintbrushCursor"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Handle */}
          <rect
            x="21"
            y="4"
            width="7"
            height="25"
            rx="3.5"
            fill="#1E2A44"
          />

          {/* Gold collar */}
          <rect
            x="19"
            y="25"
            width="11"
            height="6"
            rx="2"
            fill="#D4AF37"
          />

          {/* Bristles */}
          <path
            d="M19 30H30L35 43C35.8 45.1 34.2 47 32 47H17C14.8 47 13.2 45.1 14 43L19 30Z"
            fill="#F8F5EF"
          />

          {/* Bristle detail */}
          <path
            d="M18 32L17 44M22 32V45M26 32V45M30 32L32 44"
            stroke="#D4AF37"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Tiny paint mark */}
      <div
        ref={paintRef}
        aria-hidden="true"
        className="paintCursorTrail"
      />
    </>
  );
}