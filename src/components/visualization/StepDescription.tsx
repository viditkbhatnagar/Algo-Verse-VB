"use client";

import { AnimatePresence, motion } from "framer-motion";

interface StepDescriptionProps {
  description: string;
}

export function StepDescription({ description }: StepDescriptionProps) {
  return (
    <div className="min-h-[2.5rem] flex items-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={description}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="text-sm text-muted-foreground"
        >
          {description}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
