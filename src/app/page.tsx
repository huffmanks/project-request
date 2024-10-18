import { StepperProvider } from "@/context/stepper";
import prisma from "@/lib/db";

import Stepper from "@/components/custom/stepper";

import ProjectRequestForm from "./form";

export default async function Home() {
  const audiences = await prisma.audience.findMany({ orderBy: { title: "asc" } });
  const taskTypes = await prisma.taskType.findMany({ orderBy: { title: "asc" } });

  const steps = [{ label: "Label one" }, { label: "Label two" }];

  return (
    <StepperProvider>
      <Stepper steps={steps}>
        <h1 className="mb-6 text-2xl font-semibold">Project Request</h1>
        <ProjectRequestForm
          audiences={audiences}
          taskTypes={taskTypes}
        />
      </Stepper>
    </StepperProvider>
  );
}
