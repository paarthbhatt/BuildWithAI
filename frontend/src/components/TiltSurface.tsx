"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { PropsWithChildren } from "react";

type TiltSurfaceProps = PropsWithChildren<{
  className?: string;
  maxTilt?: number;
}>;

export default function TiltSurface({ children, className = "", maxTilt = 10 }: TiltSurfaceProps) {
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 200, damping: 22, mass: 0.6 });
  const rotateY = useSpring(rawRotateY, { stiffness: 200, damping: 22, mass: 0.6 });
  const transform = useMotionTemplate`perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  return (
    <motion.div
      className={className}
      style={{ transform, transformStyle: "preserve-3d" }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;

        rawRotateY.set(px * maxTilt);
        rawRotateX.set(py * -maxTilt);
      }}
      onMouseLeave={() => {
        rawRotateX.set(0);
        rawRotateY.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
