import prisma from "@/lib/db";

import { ProjectRequestForm } from "./form";

export default async function Home() {
  const audiences = await prisma.audience.findMany();
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <section className="mx-auto w-full max-w-2xl">
        <h1 className="mb-6 text-2xl font-semibold">Project Request</h1>
        <ProjectRequestForm audiences={audiences} />
      </section>
    </main>
  );
}
