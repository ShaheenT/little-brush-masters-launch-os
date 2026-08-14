import type {
  ProjectPackage,
  ProjectStatus,
} from "./pipeline";

export type {
  ProjectPackage,
  ProjectStatus,
} from "./pipeline";

/* -------------------------------------------------------------------------- */
/* LEADS                                                                      */
/* -------------------------------------------------------------------------- */

export type LeadSource =
  | "website"
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "referral"
  | "partner"
  | "other";

export type LeadStatus =
  | "enquiry"
  | "qualified"
  | "proposal_sent"
  | "agreement_sent"
  | "agreement_signed"
  | "deposit_paid"
  | "booked"
  | "safety_check"
  | "in_progress"
  | "completed"
  | "media_approval"
  | "testimonial"
  | "referral"
  | "closed";

/* -------------------------------------------------------------------------- */
/* CLIENTS                                                                    */
/* -------------------------------------------------------------------------- */

export type ClientStatus =
  | "active"
  | "completed"
  | "inactive";

/* -------------------------------------------------------------------------- */
/* PROJECTS                                                                   */
/* -------------------------------------------------------------------------- */

export type ProjectPriority =
  | "standard"
  | "priority"
  | "vip";

/* -------------------------------------------------------------------------- */
/* LEAD                                                                       */
/* -------------------------------------------------------------------------- */

export interface Lead {
  id: string;

  parentName: string;
  parentEmail: string;
  parentPhone: string;

  childName: string;
  childAge: number;

  location: string;

  packageInterest: ProjectPackage | null;

  enquiryMessage: string;

  source: LeadSource;

  status: LeadStatus;

  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/* CLIENT                                                                     */
/* -------------------------------------------------------------------------- */

export interface Client {
  id: string;

  parentName: string;
  parentEmail: string;
  parentPhone: string;

  children: {
    name: string;
    age: number;
  }[];

  address?: string;

  status: ClientStatus;

  /**
   * Original lead that created this client.
   */
  leadId?: string;

  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/* PROJECT                                                                    */
/* -------------------------------------------------------------------------- */

export interface Project {
  id: string;

  clientId: string;

  leadId?: string;

  childName: string;

  childAge: number;

  packageId: ProjectPackage;

  status: ProjectStatus;

  priority: ProjectPriority;

  projectAddress: string;

  creativeBrief?: string;

  wallCount: number;

  /**
   * Total agreed project value.
   *
   * null means quotation required.
   */
  investment: number | null;

  /**
   * Deposit required to confirm the project.
   */
  depositRequired: number | null;

  /**
   * Actual deposit received.
   */
  depositPaid: number;

  /**
   * Remaining amount due.
   */
  balanceDue: number | null;

  /**
   * Scheduled project date/time.
   */
  projectDate?: string;

  /**
   * Estimated delivery duration.
   */
  estimatedHours: number;

  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/* LOCAL DATABASE                                                             */
/* -------------------------------------------------------------------------- */

export interface LbmDatabase {
  leads: Lead[];
  clients: Client[];
  projects: Project[];
}