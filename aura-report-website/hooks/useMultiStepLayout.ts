import { useState } from "react";

export function useMultiStepLayout(steps: React.ReactNode[]) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  function next() {
    setCurrentIndex((i) => {
      if (i >= steps.length) return i;
      return i + 1;
    });
  }

  function prev() {
    setCurrentIndex((i) => {
      if (i <= 0) return i;
      return i - 1;
    });
  }

  function goTo(i: number) {
    if (i < 0 || i >= steps.length) return i;
    setCurrentIndex(i);
  }

  function isFirstStep() {
    return currentIndex == 0;
  }

  function isLastStep() {
    return currentIndex == steps.length - 1;
  }

  return {
    currentIndex,
    next,
    prev,
    step: steps[currentIndex],
    goTo,
    isFirstStep,
    isLastStep,
    steps,
  };
}
