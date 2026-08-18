"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FC, ReactNode } from "react";

interface BannerSlideProps {
  children: ReactNode;
}

const BannerSlide: FC<BannerSlideProps> = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();
  const offset = prefersReducedMotion ? 0 : 16;

  return (
    <motion.div
      initial={{ y: offset, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -offset, opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="absolute inset-0 flex items-center justify-center gap-2 px-4"
    >
      {children}
    </motion.div>
  );
};

export default BannerSlide;
