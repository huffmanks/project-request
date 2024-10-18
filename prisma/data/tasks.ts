import { Prisma } from "@prisma/client";

export const tasks: Prisma.TaskCreateInput[] = [
  {
    id: "task-01",
    project: {
      connect: {
        id: "proj-01",
      },
    },
    taskType: {
      connect: {
        id: "type-01",
      },
    },
  },
];
