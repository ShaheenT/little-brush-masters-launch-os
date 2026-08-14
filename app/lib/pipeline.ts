export const PROJECT_PIPELINE = [
  { id: "enquiry", label: "Enquiry" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal_sent", label: "Proposal Sent" },
  { id: "agreement_sent", label: "Agreement Sent" },
  { id: "agreement_signed", label: "Agreement Signed" },
  { id: "deposit_paid", label: "Deposit Paid" },
  { id: "booked", label: "Booked" },
  { id: "safety_check", label: "Safety Check" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "media_approval", label: "Media Approval" },
  { id: "testimonial", label: "Testimonial" },
  { id: "referral", label: "Referral" },
  { id: "closed", label: "Closed" },
] as const;

export type ProjectStatus =
  (typeof PROJECT_PIPELINE)[number]["id"];

/**
 * Little Brush Masters commercial packages.
 *
 * Fixed-price packages have a defined price.
 * Quote-based services use price: null.
 *
 * IMPORTANT:
 * null means "requires quotation".
 * It does NOT mean free.
 */
export const PROJECT_PACKAGES = [
  {
    id: "little_brush",
    name: "The Little Brush",
    price: 6850,
    pricing: "fixed",
    description: "One-wall Childhood Project experience",
    type: "package",
  },
  {
    id: "signature_room",
    name: "The Signature Room",
    price: 9850,
    pricing: "fixed",
    description: "Premium multi-element room transformation",
    type: "package",
  },
  {
    id: "childhood_project",
    name: "The Childhood Project",
    price: 14850,
    pricing: "fixed",
    description: "Complete premium creative room experience",
    type: "package",
  },
  {
    id: "additional_wall",
    name: "Additional Wall",
    price: null,
    pricing: "quote",
    description: "Additional wall quoted according to scope",
    type: "add_on",
  },
  {
    id: "custom_project",
    name: "Custom Project",
    price: null,
    pricing: "quote",
    description: "Bespoke project requiring custom quotation",
    type: "custom",
  },
] as const;

export type ProjectPackage =
  (typeof PROJECT_PACKAGES)[number]["id"];