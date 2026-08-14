import type {
  Project,
  Lead,
  Client,
} from "./types";

import {
  PROJECT_PACKAGES,
} from "./pipeline";

import {
  createProject,
} from "./storage";

/**
 * Return the commercial price for a Little Brush Masters package.
 *
 * Fixed-price packages return their configured price.
 * Custom / additional-wall projects return 0 and should
 * subsequently receive a project-specific quotation.
 */
export function getPackagePrice(
  packageId: Project["packageId"]
): number {
  const selected = PROJECT_PACKAGES.find(
    (pkg) => pkg.id === packageId
  );

  return selected?.price ?? 0;
}

/**
 * Determine the number of walls included in a package.
 */
export function getPackageWallCount(
  packageId: Project["packageId"]
): number {
  switch (packageId) {
    case "little_brush":
      return 1;

    case "signature_room":
      return 2;

    case "childhood_project":
      return 3;

    case "additional_wall":
      return 1;

    case "custom_project":
      return 1;

    default:
      return 1;
  }
}

/**
 * Create and persist a Project from an existing Lead + Client.
 *
 * This helper delegates persistence to storage.ts so there is
 * only one database-writing implementation in LBMOS.
 */
export function createProjectFromLead(
  lead: Lead,
  client: Client,
  packageId: Project["packageId"]
): Project {
  const investment =
    getPackagePrice(packageId);

  const wallCount =
    getPackageWallCount(packageId);

  return createProject({
    clientId: client.id,

    leadId: lead.id,

    childName:
      lead.childName,

    childAge:
      lead.childAge,

    packageId,

    status:
      "qualified",

    priority:
      "standard",

    projectAddress:
      client.address ??
      lead.location,

    creativeBrief:
      lead.enquiryMessage,

    wallCount,

    investment:
      investment > 0
        ? investment
        : null,

    depositRequired:
      investment > 0
        ? investment * 0.5
        : null,

    depositPaid:
      0,

    balanceDue:
      investment > 0
        ? investment
        : null,

    projectDate:
      undefined,

    estimatedHours:
      4,
  });
}