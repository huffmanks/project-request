import { Prisma } from "@prisma/client";

export const taskAttributes: Prisma.TaskAttributeCreateInput[] = [
  {
    id: "attr-01",
    key: "preferredSize",
    value: "8.5x11",
    task: {
      connect: {
        id: "task-01",
      },
    },
  },
  {
    id: "attr-02",
    key: "quantity",
    value: "100",
    task: {
      connect: {
        id: "task-01",
      },
    },
  },
  {
    id: "attr-03",
    key: "copy",
    value: "Lorem ipsum.",
    task: {
      connect: {
        id: "task-01",
      },
    },
  },
  {
    id: "attr-04",
    key: "file",
    value: "https://example.com/docs/word.docx",
    task: {
      connect: {
        id: "task-01",
      },
    },
  },
];
