"use client";

import { ReactNode, createContext, useContext, useState } from "react";

interface StepperContextType {
  currentStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
}

const StepperContext = createContext<StepperContextType | undefined>(undefined);

interface StepperProviderProps {
  children: ReactNode;
}

export const StepperProvider = ({ children }: StepperProviderProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const goToNextStep = () => setCurrentStep((prev) => prev + 1);
  const goToPreviousStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const goToStep = (step: number) => setCurrentStep(step);

  return (
    <StepperContext.Provider value={{ currentStep, goToNextStep, goToPreviousStep, goToStep }}>
      {children}
    </StepperContext.Provider>
  );
};

export const useStepper = (): StepperContextType => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a StepperProvider");
  }
  return context;
};
