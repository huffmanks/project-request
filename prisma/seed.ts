import { Prisma, PrismaClient } from "@prisma/client";

import {
  audienceData,
  projectData,
  taskAttributeData,
  taskData,
  taskTypeData,
  userData,
} from "./config";

const prisma = new PrismaClient();

const audiences: Prisma.AudienceCreateInput[] = audienceData;
const projects: Prisma.ProjectCreateInput[] = projectData;
const taskAttributes: Prisma.TaskAttributeCreateInput[] = taskAttributeData;
const tasks: Prisma.TaskCreateInput[] = taskData;
const taskTypes: Prisma.TaskTypeCreateInput[] = taskTypeData;
const users: Prisma.UserCreateInput[] = userData;

async function main() {
  console.log("⛏️   Start seeding...");

  await Promise.all(
    audiences.map(async (audience) => {
      return prisma.audience.create({
        data: audience,
      });
    })
  );

  await Promise.all(
    taskTypes.map(async (taskType) => {
      return prisma.taskType.create({
        data: taskType,
      });
    })
  );

  await Promise.all(
    users.map(async (user) => {
      return prisma.user.create({
        data: user,
      });
    })
  );

  await Promise.all(
    projects.map(async (project) => {
      return prisma.project.create({
        data: project,
      });
    })
  );

  await Promise.all(
    tasks.map(async (task) => {
      return prisma.task.create({
        data: task,
      });
    })
  );

  await Promise.all(
    taskAttributes.map(async (taskAttribute) => {
      return prisma.taskAttribute.create({
        data: taskAttribute,
      });
    })
  );

  console.log("🌱  Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
