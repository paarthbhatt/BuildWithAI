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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
