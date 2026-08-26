import type { Variants } from "framer-motion";

/**
 * Shared fade-up animation variant used across landing page sections.
 * Supports a custom delay multiplier via the `custom` prop on motion elements.
 */
export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

/**
 * Staggered container variant — staggers children by 100ms.
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
