"use client";

import Link from "next/link";
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
  useState,
} from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
};

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
  className?: string;
};

type NoiseProps = {
  children: ReactNode;
  className?: string;
};

/* -------------------------------------------------------
   Noise Background
------------------------------------------------------- */

export function NoiseBackground({
  children,
  className = "",
}: NoiseProps) {
  return (
    <div className={`lbmOsNoiseBackground ${className}`}>
      <div
        className="lbmOsNoiseOverlay"
        aria-hidden="true"
      />
      <div className="lbmOsNoiseContent">
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   Magnetic Button
------------------------------------------------------- */

export function MagneticButton({
  children,
  className = "",
  ...props
}: ButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      {...props}
      type={props.type ?? "button"}
      onMouseDown={(event) => {
        setPressed(true);
        props.onMouseDown?.(event);
      }}
      onMouseUp={(event) => {
        setPressed(false);
        props.onMouseUp?.(event);
      }}
      onMouseLeave={(event) => {
        setPressed(false);
        props.onMouseLeave?.(event);
      }}
      className={`lbmOsInteractiveButton ${
        pressed ? "isPressed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------
   Magnetic Link
------------------------------------------------------- */

export function MagneticLink({
  children,
  className = "",
  ...props
}: LinkProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <Link
      {...props}
      onMouseDown={(event) => {
        setPressed(true);
        props.onMouseDown?.(event);
      }}
      onMouseUp={(event) => {
        setPressed(false);
        props.onMouseUp?.(event);
      }}
      onMouseLeave={(event) => {
        setPressed(false);
        props.onMouseLeave?.(event);
      }}
      className={`lbmOsInteractiveLink ${
        pressed ? "isPressed" : ""
      } ${className}`}
    >
      {children}
    </Link>
  );
}

/* -------------------------------------------------------
   Hover Border Button
------------------------------------------------------- */

export function HoverBorderButton({
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={props.type ?? "button"}
      className={`lbmOsHoverBorderButton ${className}`}
    >
      <span className="lbmOsHoverBorderGlow" />
      <span className="lbmOsHoverBorderContent">
        {children}
      </span>
    </button>
  );
}

/* -------------------------------------------------------
   Moving Border Link
------------------------------------------------------- */

export function MovingBorderLink({
  children,
  className = "",
  ...props
}: LinkProps) {
  return (
    <Link
      {...props}
      className={`lbmOsMovingBorderLink ${className}`}
    >
      <span className="lbmOsMovingBorderTrack" />
      <span className="lbmOsMovingBorderContent">
        {children}
      </span>
    </Link>
  );
}

/* -------------------------------------------------------
   Stateful Button
------------------------------------------------------- */

export function StatefulButton({
  children,
  className = "",
  onClick,
  ...props
}: ButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    if (loading) return;

    setLoading(true);

    try {
      await onClick?.(event);
    } finally {
      window.setTimeout(() => {
        setLoading(false);
      }, 700);
    }
  }

  return (
    <button
      {...props}
      type={props.type ?? "button"}
      disabled={loading || props.disabled}
      onClick={handleClick}
      className={`lbmOsInteractiveButton ${
        loading ? "isLoading" : ""
      } ${className}`}
    >
      {loading ? (
        <span
          className="lbmOsButtonLoader"
          aria-label="Loading"
        />
      ) : (
        children
      )}
    </button>
  );
}
