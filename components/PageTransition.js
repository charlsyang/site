import { createContext, useContext, useState, useCallback } from "react";
import { motion } from "motion/react";

// Context to control exit animation direction
const TransitionContext = createContext({
  exitDirection: "up",
  setExitDown: () => {},
  resetExit: () => {},
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

export function TransitionProvider({ children }) {
  const [exitDirection, setExitDirection] = useState("up");

  const setExitDown = useCallback(() => {
    setExitDirection("down");
  }, []);

  const resetExit = useCallback(() => {
    setExitDirection("up");
  }, []);

  return (
    <TransitionContext.Provider
      value={{ exitDirection, setExitDown, resetExit }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export default function PageTransition({ children }) {
  const { exitDirection, resetExit } = usePageTransition();

  // When closing (exitDirection is "down"), the incoming page appears instantly
  const isClosing = exitDirection === "down";

  // Page container only handles opacity - no movement
  const variants = {
    initial: {
      opacity: isClosing ? 1 : 0,
    },
    enter: {
      opacity: 1,
      transition: isClosing
        ? { duration: 0 }
        : {
            duration: 0.4,
            ease: [0.17, 0.84, 0.44, 1],
          },
    },
    exit: {
      opacity: 0,
      zIndex: 1, // Exiting page stays on top
      transition: {
        duration: 0.25,
        ease: [0.65, 0.05, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={variants}
      onAnimationComplete={(definition) => {
        if (definition === "exit") {
          resetExit();
        }
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "auto",
      }}
    >
      {children}
    </motion.div>
  );
}

// Content wrapper for animations
const contentVariants = {
  initial: (isClosing) => ({
    scale: isClosing ? 1 : 0.98,
    y: isClosing ? 0 : 10,
  }),
  enter: {
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.17, 0.84, 0.44, 1],
    },
  },
  exit: (isClosing) => ({
    scale: isClosing ? 0.97 : 1,
    y: isClosing ? 0 : -10,
    transition: {
      duration: 0.25,
      ease: [0.65, 0.05, 0.36, 1],
    },
  }),
};

export function ContentTransition({ children }) {
  const { exitDirection } = usePageTransition();
  const isClosing = exitDirection === "down";

  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      custom={isClosing}
      variants={contentVariants}
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
}
