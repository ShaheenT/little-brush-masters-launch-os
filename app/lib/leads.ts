import type { Lead } from "./types";
import { createLead as createStoredLead } from "./storage";

export interface CreateLeadInput {
  parentName: string;
  parentEmail?: string;
  parentPhone?: string;

  childName: string;
  childAge: number;

  location?: string;

  packageInterest: Lead["packageInterest"];

  enquiryMessage: string;

  source?: Lead["source"];
}

export function createLead(input: CreateLeadInput): Lead {
  return createStoredLead({
    parentName: input.parentName.trim(),

    parentEmail:
      input.parentEmail?.trim() || "",

    parentPhone:
      input.parentPhone?.trim() || "",

    childName:
      input.childName.trim(),

    childAge:
      Number(input.childAge),

    location:
      input.location?.trim() || "",

    packageInterest:
      input.packageInterest,

    enquiryMessage:
      input.enquiryMessage.trim(),

    source:
      input.source ?? "website",

    status:
      "enquiry",
  });
}