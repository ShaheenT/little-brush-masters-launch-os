import type {
  Client,
  Lead,
  LbmDatabase,
  Project,
} from "./types";

import {
  PROJECT_PACKAGES,
} from "./pipeline";

const STORAGE_KEY = "lbm_os_database_v1";

/* -------------------------------------------------------------------------- */
/* INTERNAL HELPERS                                                           */
/* -------------------------------------------------------------------------- */

function createEmptyDatabase(): LbmDatabase {
  return {
    leads: [],
    clients: [],
    projects: [],
  };
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readDatabase(): LbmDatabase {
  if (!isBrowser()) {
    return createEmptyDatabase();
  }

  try {
    const raw = window.localStorage.getItem(
      STORAGE_KEY
    );

    if (!raw) {
      return createEmptyDatabase();
    }

    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") {
      return createEmptyDatabase();
    }

    return {
      leads: Array.isArray(parsed.leads)
        ? parsed.leads
        : [],

      clients: Array.isArray(parsed.clients)
        ? parsed.clients
        : [],

      projects: Array.isArray(parsed.projects)
        ? parsed.projects
        : [],
    };
  } catch (error) {
    console.error(
      "LBMOS database read failed:",
      error
    );

    return createEmptyDatabase();
  }
}

function writeDatabase(
  database: LbmDatabase
): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(database)
    );
  } catch (error) {
    console.error(
      "LBMOS database write failed:",
      error
    );
  }
}

function generateId(
  prefix: string
): string {
  const randomPart = Math.random()
    .toString(36)
    .slice(2, 10);

  return `${prefix}_${Date.now()}_${randomPart}`;
}

function now(): string {
  return new Date().toISOString();
}

/* -------------------------------------------------------------------------- */
/* DATABASE                                                                   */
/* -------------------------------------------------------------------------- */

export function getDatabase(): LbmDatabase {
  return readDatabase();
}

export function getLeads(): Lead[] {
  return readDatabase().leads;
}

export function getClients(): Client[] {
  return readDatabase().clients;
}

export function getProjects(): Project[] {
  return readDatabase().projects;
}

/* -------------------------------------------------------------------------- */
/* LEADS                                                                      */
/* -------------------------------------------------------------------------- */

export function createLead(
  input: Omit<
    Lead,
    "id" | "createdAt" | "updatedAt"
  >
): Lead {
  const database = readDatabase();

  const timestamp = now();

  const lead: Lead = {
    ...input,
    id: generateId("lead"),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  database.leads.push(lead);

  writeDatabase(database);

  return lead;
}

export function updateLead(
  id: string,
  updates: Partial<
    Omit<Lead, "id" | "createdAt">
  >
): Lead | null {
  const database = readDatabase();

  const index = database.leads.findIndex(
    (lead) => lead.id === id
  );

  if (index === -1) {
    return null;
  }

  const existing =
    database.leads[index];

  const updated: Lead = {
    ...existing,
    ...updates,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: now(),
  };

  database.leads[index] = updated;

  writeDatabase(database);

  return updated;
}

/* -------------------------------------------------------------------------- */
/* CLIENTS                                                                    */
/* -------------------------------------------------------------------------- */

export function createClient(
  input: Omit<
    Client,
    "id" | "createdAt" | "updatedAt"
  >
): Client {
  const database = readDatabase();

  const timestamp = now();

  const client: Client = {
    ...input,
    id: generateId("client"),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  database.clients.push(client);

  writeDatabase(database);

  return client;
}

export function updateClient(
  id: string,
  updates: Partial<
    Omit<Client, "id" | "createdAt">
  >
): Client | null {
  const database = readDatabase();

  const index = database.clients.findIndex(
    (client) => client.id === id
  );

  if (index === -1) {
    return null;
  }

  const existing =
    database.clients[index];

  const updated: Client = {
    ...existing,
    ...updates,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: now(),
  };

  database.clients[index] = updated;

  writeDatabase(database);

  return updated;
}

/* -------------------------------------------------------------------------- */
/* PROJECTS                                                                   */
/* -------------------------------------------------------------------------- */

export function createProject(
  input: Omit<
    Project,
    "id" | "createdAt" | "updatedAt"
  >
): Project {
  const database = readDatabase();

  const timestamp = now();

  const project: Project = {
    ...input,
    id: generateId("project"),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  database.projects.push(project);

  writeDatabase(database);

  return project;
}

export function updateProject(
  id: string,
  updates: Partial<
    Omit<Project, "id" | "createdAt">
  >
): Project | null {
  const database = readDatabase();

  const index = database.projects.findIndex(
    (project) => project.id === id
  );

  if (index === -1) {
    return null;
  }

  const existing =
    database.projects[index];

  const updated: Project = {
    ...existing,
    ...updates,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: now(),
  };

  database.projects[index] = updated;

  writeDatabase(database);

  return updated;
}

/* -------------------------------------------------------------------------- */
/* LEAD → CLIENT                                                              */
/* -------------------------------------------------------------------------- */

export function convertLeadToClient(
  leadId: string
): Client | null {
  const database = readDatabase();

  const lead = database.leads.find(
    (item) => item.id === leadId
  );

  if (!lead) {
    return null;
  }

  /*
   * First check the relationship.
   */
  const existingByLead =
    database.clients.find(
      (client) =>
        client.leadId === lead.id
    );

  if (existingByLead) {
    return existingByLead;
  }

  /*
   * Then check the parent's email.
   *
   * This prevents duplicate family records.
   */
  const normalizedEmail =
    lead.parentEmail
      .trim()
      .toLowerCase();

  const existingByEmail =
    database.clients.find(
      (client) =>
        client.parentEmail
          .trim()
          .toLowerCase() ===
        normalizedEmail
    );

  if (existingByEmail) {
    return existingByEmail;
  }

  const timestamp = now();

  const client: Client = {
    id: generateId("client"),

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

    createdAt: timestamp,

    updatedAt: timestamp,
  };

  database.clients.push(client);

  database.leads =
    database.leads.map(
      (item) =>
        item.id === leadId
          ? {
              ...item,
              status: "qualified",
              updatedAt: timestamp,
            }
          : item
    );

  writeDatabase(database);

  return client;
}

/* -------------------------------------------------------------------------- */
/* LEAD → CLIENT → PROJECT                                                    */
/* -------------------------------------------------------------------------- */

export function convertLeadToProject(
  leadId: string
): Project | null {
  const database = readDatabase();

  const lead = database.leads.find(
    (item) => item.id === leadId
  );

  if (!lead) {
    return null;
  }

  if (!lead.packageInterest) {
    return null;
  }

  /*
   * Prevent duplicate projects.
   */
  const existingProject =
    database.projects.find(
      (project) =>
        project.leadId === lead.id
    );

  if (existingProject) {
    return existingProject;
  }

  /*
   * Locate or create client.
   */
  let client =
    database.clients.find(
      (item) =>
        item.leadId === lead.id
    );

  const timestamp = now();

  if (!client) {
    const normalizedEmail =
      lead.parentEmail
        .trim()
        .toLowerCase();

    client =
      database.clients.find(
        (item) =>
          item.parentEmail
            .trim()
            .toLowerCase() ===
          normalizedEmail
      );
  }

  if (!client) {
    client = {
      id: generateId("client"),

      parentName:
        lead.parentName,

      parentEmail:
        lead.parentEmail,

      parentPhone:
        lead.parentPhone,

      children: [
        {
          name: lead.childName,
          age: lead.childAge,
        },
      ],

      address:
        lead.location ||
        undefined,

      status: "active",

      leadId: lead.id,

      createdAt: timestamp,

      updatedAt: timestamp,
    };

    database.clients.push(client);
  }

  const packageDefinition =
    PROJECT_PACKAGES.find(
      (item) =>
        item.id ===
        lead.packageInterest
    );

  const investment =
    packageDefinition?.price ?? null;

  const wallCount =
    lead.packageInterest ===
    "little_brush"
      ? 1
      : lead.packageInterest ===
        "signature_room"
      ? 2
      : lead.packageInterest ===
        "childhood_project"
      ? 3
      : 1;

  const depositRequired =
    investment !== null
      ? investment * 0.5
      : null;

  const project: Project = {
    id: generateId("project"),

    clientId: client.id,

    leadId: lead.id,

    childName:
      lead.childName,

    childAge:
      lead.childAge,

    packageId:
      lead.packageInterest,

    status: "qualified",

    priority: "standard",

    projectAddress:
      client.address ??
      lead.location,

    creativeBrief:
      lead.enquiryMessage ||
      undefined,

    wallCount,

    investment,

    depositRequired,

    depositPaid: 0,

    balanceDue:
      investment,

    projectDate:
      undefined,

    estimatedHours: 4,

    createdAt:
      timestamp,

    updatedAt:
      timestamp,
  };

  database.projects.push(project);

  database.leads =
    database.leads.map(
      (item) =>
        item.id === leadId
          ? {
              ...item,
              status: "qualified",
              updatedAt:
                timestamp,
            }
          : item
    );

  writeDatabase(database);

  return project;
}

/* -------------------------------------------------------------------------- */
/* DATABASE UTILITIES                                                         */
/* -------------------------------------------------------------------------- */

export function clearDatabase(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(
      STORAGE_KEY
    );
  } catch (error) {
    console.error(
      "LBMOS database clear failed:",
      error
    );
  }
}

export function resetDatabase(): void {
  if (!isBrowser()) {
    return;
  }

  writeDatabase(
    createEmptyDatabase()
  );
}