"use client";

import { useStepper } from "@/context/stepper";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: {
    label: string;
  }[];
  children: React.ReactNode;
}

export default function Stepper({ steps, children }: StepperProps) {
  const { currentStep } = useStepper();
  return (
    <main className="mx-auto grid w-full max-w-3xl grid-cols-[250px_1fr] gap-24 p-8">
      <aside className="rounded-sm border bg-muted p-8">
        <ul>
          {steps.map((step, index) => (
            <li
              key={step.label}
              className="mb-6 list-none">
              <h2 className="mb-2 text-sm font-bold uppercase text-muted-foreground">
                Step {index + 1}
              </h2>
              <p className={cn("font-semibold", currentStep === index && "text-primary")}>
                {step.label}
              </p>
            </li>
          ))}
        </ul>
      </aside>
      <section className="">{children}</section>
    </main>
  );
}
