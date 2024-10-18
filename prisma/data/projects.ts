import { add, startOfToday } from "date-fns";

const today = startOfToday();

export const projectData = [
  {
    id: "proj-01",
    title: "Project One",
    purpose: "To get the people excited",
    proofDate: add(today, { days: 7 }),
    completionDate: add(today, { days: 14 }),
    mailDate: add(today, { days: 17 }),
    budget: 75,
    printerQuote: false,
    meeting: false,
    additionalInfo: "I want to make sure this is on your radar.",
    approver: { connect: { id: "user-01" } },
    contact: { connect: { id: "user-01" } },
    invoice: { connect: { id: "user-01" } },
    audience: {
      connect: [{ id: "aud-01" }, { id: "aud-02" }],
    },
  },
];
