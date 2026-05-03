"use client";

import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

type ScrollRevealProps = PropsWithChildren<{
  className?: string;
  delay?: number;
}>;

export default function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20,
        mass: 0.6,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
