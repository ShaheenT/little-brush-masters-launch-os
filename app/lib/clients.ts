import type { Client, Lead } from "./types";
import { createClient } from "./storage";

export function createClientFromLead(
  lead: Lead
): Client {
  return createClient({
    parentName: lead.parentName,

    parentEmail: lead.parentEmail,

    parentPhone: lead.parentPhone,

    children: [
      {
        name: lead.childName,
        age: lead.childAge,
      },
    ],

    address:
      lead.location || undefined,

    status: "active",

    leadId: lead.id,
  });
}