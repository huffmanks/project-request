import { Prisma } from "@prisma/client";

export const audiences: Prisma.AudienceCreateInput[] = [
  { id: "aud-01", title: "Prospective students" },
  { id: "aud-02", title: "Current students" },
  { id: "aud-03", title: "Faculty/staff" },
  { id: "aud-04", title: "Alumni" },
  { id: "aud-05", title: "Parents/Wofford families" },
  { id: "aud-06", title: "Donors" },
  { id: "aud-07", title: "Wofford community" },
  { id: "aud-08", title: "Outside community" },
  { id: "aud-09", title: "Other" },
];
