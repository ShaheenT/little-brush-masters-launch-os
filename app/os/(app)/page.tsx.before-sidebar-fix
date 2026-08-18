"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FolderKanban,
  LayoutDashboard,
  Mail,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Search,
  UserRound,
  Users,
} from "lucide-react";

import {
  convertLeadToClient,
  createProject,
  getClients,
  getLeads,
  getProjects,
  updateLead,
  updateProject,
} from "../../lib/storage";

import {
  PROJECT_PACKAGES,
  PROJECT_PIPELINE,
} from "../../lib/pipeline";

import type {
  Client,
  Lead,
  LeadStatus,
  Project,
  ProjectPackage,
  ProjectStatus,
} from "../../lib/types";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type View =
  | "dashboard"
  | "leads"
  | "clients"
  | "projects";

/* -------------------------------------------------------------------------- */
/* FORMATTERS                                                                 */
/* -------------------------------------------------------------------------- */

const money = new Intl.NumberFormat(
  "en-ZA",
  {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }
);

const packageNames: Record<
  string,
  string
> = Object.fromEntries(
  PROJECT_PACKAGES.map(
    (pkg) => [pkg.id, pkg.name]
  )
);

const packagePrices: Record<
  string,
  number
> = Object.fromEntries(
  PROJECT_PACKAGES
    .filter(
      (
        pkg
      ): pkg is typeof pkg & {
        price: number;
      } =>
        pkg.price !== null
    )
    .map(
      (pkg) => [
        pkg.id,
        pkg.price,
      ]
    )
);

const QUALIFIED_LEAD_STATUSES: LeadStatus[] =
  [
    "qualified",
    "proposal_sent",
    "agreement_sent",
    "agreement_signed",
    "deposit_paid",
    "booked",
    "safety_check",
    "in_progress",
    "completed",
    "media_approval",
    "testimonial",
    "referral",
    "closed",
  ];

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function packageName(
  id:
    | ProjectPackage
    | null
    | undefined
): string {
  if (!id) {
    return "Not selected";
  }

  return (
    packageNames[id] ??
    id
  );
}

function packagePrice(
  id:
    | ProjectPackage
    | null
    | undefined
): number {
  if (!id) {
    return 0;
  }

  return packagePrices[id] ?? 0;
}

function packageWallCount(
  packageId: ProjectPackage
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

function formatDate(
  value: string
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Unknown date";
  }

  return date.toLocaleDateString(
    "en-ZA",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function isQualifiedLead(
  lead: Lead
): boolean {
  return QUALIFIED_LEAD_STATUSES.includes(
    lead.status
  );
}

function getNextProjectStage(
  status: ProjectStatus
) {
  const index =
    PROJECT_PIPELINE.findIndex(
      (stage) =>
        stage.id === status
    );

  if (
    index < 0 ||
    index >=
      PROJECT_PIPELINE.length - 1
  ) {
    return null;
  }

  return PROJECT_PIPELINE[
    index + 1
  ];
}

/* -------------------------------------------------------------------------- */
/* MAIN PAGE                                                                  */
/* -------------------------------------------------------------------------- */

export default function LbmOsPage() {
  const [view, setView] =
    useState<View>(
      "dashboard"
    );

  const [leads, setLeads] =
    useState<Lead[]>([]);

  const [clients, setClients] =
    useState<Client[]>([]);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [
    selectedLead,
    setSelectedLead,
  ] = useState<Lead | null>(
    null
  );

  const [
    selectedProject,
    setSelectedProject,
  ] =
    useState<Project | null>(
      null
    );

  const [search, setSearch] =
    useState("");

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* DATA REFRESH                                                             */
  /* ------------------------------------------------------------------------ */

  const refresh =
    useCallback(() => {
      setRefreshing(true);

      try {
        setLeads(getLeads());
        setClients(getClients());
        setProjects(
          getProjects()
        );
      } catch (error) {
        console.error(
          "LBMOS refresh failed:",
          error
        );
      } finally {
        window.setTimeout(
          () => {
            setRefreshing(false);
          },
          250
        );
      }
    }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /* ------------------------------------------------------------------------ */
  /* METRICS                                                                  */
  /* ------------------------------------------------------------------------ */

  const qualifiedLeads =
    useMemo(
      () =>
        leads.filter(
          isQualifiedLead
        ),
      [leads]
    );

  const activeProjects =
    useMemo(
      () =>
        projects.filter(
          (project) =>
            project.status !==
              "closed" &&
            project.status !==
              "completed"
        ),
      [projects]
    );

  const pipelineValue =
    useMemo(
      () =>
        projects.reduce(
          (
            total,
            project
          ) =>
            total +
            (project.investment ??
              0),
          0
        ),
      [projects]
    );

  const depositsCollected =
    useMemo(
      () =>
        projects.reduce(
          (
            total,
            project
          ) =>
            total +
            project.depositPaid,
          0
        ),
      [projects]
    );

  const outstanding =
    useMemo(
      () =>
        projects.reduce(
          (
            total,
            project
          ) => {
            if (
              project.balanceDue ===
              null
            ) {
              return total;
            }

            return (
              total +
              Math.max(
                project.balanceDue -
                  project.depositPaid,
                0
              )
            );
          },
          0
        ),
      [projects]
    );

  /* ------------------------------------------------------------------------ */
  /* LEAD SEARCH                                                              */
  /* ------------------------------------------------------------------------ */

  const filteredLeads =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      if (!term) {
        return leads;
      }

      return leads.filter(
        (lead) =>
          [
            lead.parentName,
            lead.parentEmail,
            lead.parentPhone,
            lead.childName,
            lead.location,
            packageName(
              lead.packageInterest
            ),
            lead.enquiryMessage,
            lead.source,
            lead.status,
          ]
            .join(" ")
            .toLowerCase()
            .includes(term)
      );
    }, [leads, search]);

  /* ------------------------------------------------------------------------ */
  /* LEAD ACTIONS                                                             */
  /* ------------------------------------------------------------------------ */

  function qualifyLead(
    lead: Lead
  ) {
    const updated =
      updateLead(
        lead.id,
        {
          status:
            "qualified",
        }
      );

    if (!updated) {
      return;
    }

    setSelectedLead(
      updated
    );

    refresh();
  }

  function convertClient(
    lead: Lead
  ) {
    const client =
      convertLeadToClient(
        lead.id
      );

    if (!client) {
      return;
    }

    refresh();

    setSelectedLead({
      ...lead,
      status: "qualified",
    });

    setView("clients");
  }

  function createProjectFromLead(
    lead: Lead
  ) {
    /*
     * Find existing client first.
     */
    let client =
      clients.find(
        (item) =>
          item.leadId ===
          lead.id
      );

    /*
     * If no client exists,
     * convert the lead.
     */
    if (!client) {
      client =
        convertLeadToClient(
          lead.id
        ) ?? undefined;
    }

    if (!client) {
      return;
    }

    /*
     * Prevent creating a second
     * project for the same lead.
     */
    const existingProject =
      projects.find(
        (project) =>
          project.leadId ===
          lead.id
      );

    if (existingProject) {
      setSelectedProject(
        existingProject
      );

      setSelectedLead(null);

      setView("projects");

      return;
    }

    const selectedPackage: ProjectPackage =
      lead.packageInterest ??
      "little_brush";

    const investment =
      packagePrice(
        selectedPackage
      );

    const depositRequired =
      investment > 0
        ? investment * 0.5
        : null;

    const project =
      createProject({
        clientId:
          client.id,

        leadId:
          lead.id,

        childName:
          lead.childName,

        childAge:
          lead.childAge,

        packageId:
          selectedPackage,

        status:
          "qualified",

        priority:
          "standard",

        projectAddress:
          client.address ??
          lead.location,

        creativeBrief:
          lead.enquiryMessage ||
          undefined,

        wallCount:
          packageWallCount(
            selectedPackage
          ),

        investment:
          investment > 0
            ? investment
            : null,

        depositRequired,

        depositPaid: 0,

        balanceDue:
          investment > 0
            ? investment
            : null,

        projectDate:
          undefined,

        estimatedHours: 4,
      });

    updateLead(
      lead.id,
      {
        status:
          "qualified",
      }
    );

    refresh();

    setSelectedLead(null);

    setSelectedProject(
      project
    );

    setView("projects");
  }

  /* ------------------------------------------------------------------------ */
  /* PROJECT ACTIONS                                                          */
  /* ------------------------------------------------------------------------ */

  function advanceProject(
    project: Project
  ) {
    const nextStage =
      getNextProjectStage(
        project.status
      );

    if (!nextStage) {
      return;
    }

    const updated =
      updateProject(
        project.id,
        {
          status:
            nextStage.id,
        }
      );

    if (!updated) {
      return;
    }

    setSelectedProject(
      updated
    );

    refresh();
  }

  /* ------------------------------------------------------------------------ */
  /* NAVIGATION                                                                */
  /* ------------------------------------------------------------------------ */

  function openLead(
    lead: Lead
  ) {
    setSelectedLead(
      lead
    );

    setView("leads");
  }

  function changeView(
    nextView: View
  ) {
    setView(nextView);

    if (nextView !== "leads") {
      setSelectedLead(
        null
      );
    }

    if (
      nextView !==
      "projects"
    ) {
      setSelectedProject(
        null
      );
    }
  }

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="lbmOs">
      <aside className="osSidebar">
        <div>
          <div className="osBrand">
            <div className="osBrandMark">
              LB
            </div>

            <div>
              <strong>
                LITTLE BRUSH
              </strong>

              <span>
                MASTERS
              </span>
            </div>
          </div>

          <div className="osBrandSub">
            LBMOS · COMMAND CENTRE
          </div>

          <nav className="osNav">
            <button
              type="button"
              className={
                view ===
                "dashboard"
                  ? "active"
                  : ""
              }
              onClick={() =>
                changeView(
                  "dashboard"
                )
              }
            >
              <LayoutDashboard
                size={18}
              />

              Dashboard
            </button>

            <button
              type="button"
              className={
                view === "leads"
                  ? "active"
                  : ""
              }
              onClick={() =>
                changeView(
                  "leads"
                )
              }
            >
              <Users size={18} />

              Lead Inbox

              <span>
                {leads.length}
              </span>
            </button>

            <button
              type="button"
              className={
                view ===
                "clients"
                  ? "active"
                  : ""
              }
              onClick={() =>
                changeView(
                  "clients"
                )
              }
            >
              <UserRound
                size={18}
              />

              Clients

              <span>
                {clients.length}
              </span>
            </button>

            <button
              type="button"
              className={
                view ===
                "projects"
                  ? "active"
                  : ""
              }
              onClick={() =>
                changeView(
                  "projects"
                )
              }
            >
              <FolderKanban
                size={18}
              />

              Projects

              <span>
                {projects.length}
              </span>
            </button>
          </nav>
        </div>

        <div className="osSidebarBottom">
          <div className="osCapacity">
            <span className="capacityDot" />

            <div>
              <strong>
                Private bookings
              </strong>

              <small>
                Limited monthly
                capacity
              </small>
            </div>
          </div>
        </div>
      </aside>

      <section className="osMain">
        <header className="osHeader">
          <div>
            <p className="osEyebrow">
              LITTLE BRUSH MASTERS
            </p>

            <h1>
              {view ===
                "dashboard" &&
                "Command Centre"}

              {view ===
                "leads" &&
                "Lead Inbox"}

              {view ===
                "clients" &&
                "Clients"}

              {view ===
                "projects" &&
                "Projects"}
            </h1>
          </div>

          <div className="osHeaderActions">
            <button
              type="button"
              className="osRefresh"
              onClick={
                refresh
              }
              disabled={
                refreshing
              }
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "spin"
                    : ""
                }
              />

              Refresh
            </button>
          </div>
        </header>

        {view ===
          "dashboard" && (
          <Dashboard
            leads={leads}
            projects={projects}
            activeProjects={
              activeProjects
            }
            qualifiedLeads={
              qualifiedLeads
            }
            pipelineValue={
              pipelineValue
            }
            depositsCollected={
              depositsCollected
            }
            outstanding={
              outstanding
            }
            openLead={
              openLead
            }
            setView={
              changeView
            }
          />
        )}

        {view === "leads" && (
          <section>
            <div className="osToolbar">
              <div className="searchBox">
                <Search
                  size={17}
                />

                <input
                  value={search}
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target
                        .value
                    )
                  }
                  placeholder="Search parent, child, location or package..."
                />
              </div>

              <div className="osResultCount">
                {
                  filteredLeads.length
                }{" "}
                lead
                {filteredLeads.length ===
                1
                  ? ""
                  : "s"}
              </div>
            </div>

            <div className="osContentGrid">
              <div className="osList">
                {filteredLeads.length ===
                0 ? (
                  <EmptyState
                    title="No leads yet"
                    copy="Website enquiries will appear here automatically."
                  />
                ) : (
                  filteredLeads
                    .slice()
                    .sort(
                      (
                        a,
                        b
                      ) =>
                        new Date(
                          b.createdAt
                        ).getTime() -
                        new Date(
                          a.createdAt
                        ).getTime()
                    )
                    .map(
                      (
                        lead
                      ) => (
                        <LeadCard
                          key={
                            lead.id
                          }
                          lead={
                            lead
                          }
                          selected={
                            selectedLead?.id ===
                            lead.id
                          }
                          onClick={() =>
                            openLead(
                              lead
                            )
                          }
                        />
                      )
                    )
                )}
              </div>

              <LeadDetail
                lead={
                  selectedLead
                }
                clients={
                  clients
                }
                onQualify={
                  qualifyLead
                }
                onConvert={
                  convertClient
                }
                onCreateProject={
                  createProjectFromLead
                }
              />
            </div>
          </section>
        )}

        {view ===
          "clients" && (
          <section>
            <div className="osSectionIntro">
              <div>
                <p className="osEyebrow">
                  CLIENT DATABASE
                </p>

                <h2>
                  Families
                  you've
                  converted
                </h2>
              </div>

              <strong>
                {clients.length}{" "}
                families
              </strong>
            </div>

            <div className="clientGrid">
              {clients.length ===
              0 ? (
                <EmptyState
                  title="No clients yet"
                  copy="Convert a qualified lead into a client to start building the family database."
                />
              ) : (
                clients.map(
                  (
                    client
                  ) => (
                    <ClientCard
                      key={
                        client.id
                      }
                      client={
                        client
                      }
                      projects={
                        projects
                      }
                    />
                  )
                )
              )}
            </div>
          </section>
        )}

        {view ===
          "projects" && (
          <section>
            <div className="osSectionIntro">
              <div>
                <p className="osEyebrow">
                  PROJECT PIPELINE
                </p>

                <h2>
                  Every Childhood
                  Project in
                  motion
                </h2>
              </div>

              <strong>
                {projects.length}{" "}
                projects
              </strong>
            </div>

            <div className="pipelineBoard">
              {PROJECT_PIPELINE.map(
                (
                  stage
                ) => {
                  const stageProjects =
                    projects.filter(
                      (
                        project
                      ) =>
                        project.status ===
                        stage.id
                    );

                  return (
                    <div
                      className="pipelineColumn"
                      key={
                        stage.id
                      }
                    >
                      <div className="pipelineColumnHead">
                        <span>
                          {
                            stage.label
                          }
                        </span>

                        <strong>
                          {
                            stageProjects.length
                          }
                        </strong>
                      </div>

                      {stageProjects.map(
                        (
                          project
                        ) => (
                          <button
                            type="button"
                            className={`projectCard ${
                              selectedProject?.id ===
                              project.id
                                ? "selected"
                                : ""
                            }`}
                            key={
                              project.id
                            }
                            onClick={() =>
                              setSelectedProject(
                                project
                              )
                            }
                          >
                            <div className="projectCardTop">
                              <span>
                                {
                                  project.childName
                                }
                              </span>

                              <small>
                                {project.investment !==
                                null
                                  ? money.format(
                                      project.investment
                                    )
                                  : "Quote"}
                              </small>
                            </div>

                            <strong>
                              {packageName(
                                project.packageId
                              )}
                            </strong>

                            <small>
                              {
                                project.wallCount
                              }{" "}
                              wall
                              {project.wallCount ===
                              1
                                ? ""
                                : "s"}
                            </small>
                          </button>
                        )
                      )}

                      {stageProjects.length ===
                        0 && (
                        <div className="pipelineEmpty">
                          Empty
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>

            <ProjectDetail
              project={
                selectedProject
              }
              clients={
                clients
              }
              onAdvance={
                advanceProject
              }
            />
          </section>
        )}
      </section>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* DASHBOARD                                                                  */
/* -------------------------------------------------------------------------- */

function Dashboard({
  leads,
  projects,
  activeProjects,
  qualifiedLeads,
  pipelineValue,
  depositsCollected,
  outstanding,
  openLead,
  setView,
}: {
  leads: Lead[];
  projects: Project[];
  activeProjects: Project[];
  qualifiedLeads: Lead[];
  pipelineValue: number;
  depositsCollected: number;
  outstanding: number;
  openLead: (
    lead: Lead
  ) => void;
  setView: (
    view: View
  ) => void;
}) {
  const latestLeads =
    leads
      .slice()
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      )
      .slice(0, 5);

  return (
    <>
      <div className="metricGrid">
        <Metric
          icon={
            <Users size={19} />
          }
          label="Total Leads"
          value={String(
            leads.length
          )}
          detail={`${qualifiedLeads.length} qualified`}
        />

        <Metric
          icon={
            <BriefcaseBusiness
              size={19}
            />
          }
          label="Active Projects"
          value={String(
            activeProjects.length
          )}
          detail={`${projects.length} total projects`}
        />

        <Metric
          icon={
            <CircleDollarSign
              size={19}
            />
          }
          label="Pipeline Value"
          value={money.format(
            pipelineValue
          )}
          detail="Total project value"
        />

        <Metric
          icon={
            <CheckCircle2
              size={19}
            />
          }
          label="Deposits Collected"
          value={money.format(
            depositsCollected
          )}
          detail={`${money.format(
            outstanding
          )} outstanding`}
        />
      </div>

      <div className="dashboardGrid">
        <section className="osPanel">
          <div className="panelHeader">
            <div>
              <p className="osEyebrow">
                INBOX
              </p>

              <h3>
                Latest enquiries
              </h3>
            </div>

            <button
              type="button"
              className="panelLink"
              onClick={() =>
                setView(
                  "leads"
                )
              }
            >
              View all
              <ArrowRight
                size={15}
              />
            </button>
          </div>

          {latestLeads.length ===
          0 ? (
            <EmptyState
              title="Your first family is waiting"
              copy="Website enquiries will appear in this inbox."
            />
          ) : (
            <div className="miniList">
              {latestLeads.map(
                (
                  lead
                ) => (
                  <button
                    type="button"
                    key={
                      lead.id
                    }
                    className="miniLead"
                    onClick={() =>
                      openLead(
                        lead
                      )
                    }
                  >
                    <div>
                      <strong>
                        {
                          lead.parentName
                        }
                      </strong>

                      <span>
                        {
                          lead.childName
                        }{" "}
                        · age{" "}
                        {
                          lead.childAge
                        }
                      </span>
                    </div>

                    <div className="miniLeadRight">
                      <StatusBadge
                        status={
                          lead.status
                        }
                      />

                      <ChevronRight
                        size={
                          16
                        }
                      />
                    </div>
                  </button>
                )
              )}
            </div>
          )}
        </section>

        <section className="osPanel">
          <div className="panelHeader">
            <div>
              <p className="osEyebrow">
                REVENUE
              </p>

              <h3>
                Commercial
                position
              </h3>
            </div>
          </div>

          <div className="revenueRows">
            <RevenueRow
              label="Pipeline"
              value={
                pipelineValue
              }
            />

            <RevenueRow
              label="Deposits received"
              value={
                depositsCollected
              }
            />

            <RevenueRow
              label="Outstanding"
              value={
                outstanding
              }
            />
          </div>

          <div className="revenueNote">
            <Clock3 size={16} />
            Target:
            R100,000/month
          </div>
        </section>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* METRIC                                                                     */
/* -------------------------------------------------------------------------- */

function Metric({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="metric">
      <div className="metricIcon">
        {icon}
      </div>

      <div className="metricLabel">
        {label}
      </div>

      <strong className="metricValue">
        {value}
      </strong>

      <span className="metricDetail">
        {detail}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* REVENUE                                                                    */
/* -------------------------------------------------------------------------- */

function RevenueRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="revenueRow">
      <span>
        {label}
      </span>

      <strong>
        {money.format(
          value
        )}
      </strong>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* LEAD CARD                                                                  */
/* -------------------------------------------------------------------------- */

function LeadCard({
  lead,
  selected,
  onClick,
}: {
  lead: Lead;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`leadCard ${
        selected
          ? "selected"
          : ""
      }`}
      onClick={onClick}
    >
      <div className="leadCardTop">
        <div>
          <strong>
            {
              lead.parentName
            }
          </strong>

          <span>
            {
              lead.childName
            }
            , age{" "}
            {
              lead.childAge
            }
          </span>
        </div>

        <StatusBadge
          status={
            lead.status
          }
        />
      </div>

      <div className="leadCardMeta">
        <span>
          <MapPin
            size={14}
          />

          {lead.location ||
            "Location not provided"}
        </span>

        <span>
          {packageName(
            lead.packageInterest
          )}
        </span>
      </div>

      <small>
        {formatDate(
          lead.createdAt
        )}
      </small>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* LEAD DETAIL                                                                */
/* -------------------------------------------------------------------------- */

function LeadDetail({
  lead,
  clients,
  onQualify,
  onConvert,
  onCreateProject,
}: {
  lead: Lead | null;
  clients: Client[];
  onQualify: (
    lead: Lead
  ) => void;
  onConvert: (
    lead: Lead
  ) => void;
  onCreateProject: (
    lead: Lead
  ) => void;
}) {
  if (!lead) {
    return (
      <aside className="detailPanel emptyDetail">
        <Users size={28} />

        <h3>
          Select a lead
        </h3>

        <p>
          Select an enquiry
          from the inbox to
          qualify, convert
          and create a
          project.
        </p>
      </aside>
    );
  }

  const existingClient =
    clients.find(
      (client) =>
        client.leadId ===
        lead.id
    );

  const existingProjectText =
    existingClient
      ? "This lead has already been converted into a client."
      : null;

  const qualified =
    isQualifiedLead(
      lead
    );

  return (
    <aside className="detailPanel">
      <div className="detailHeader">
        <div>
          <p className="osEyebrow">
            LEAD
          </p>

          <h2>
            {
              lead.parentName
            }
          </h2>

          <span>
            {
              lead.childName
            }
            , age{" "}
            {
              lead.childAge
            }
          </span>
        </div>

        <StatusBadge
          status={
            lead.status
          }
        />
      </div>

      <div className="detailFacts">
        <Fact
          icon={
            <Mail size={16} />
          }
          label="Email"
          value={
            lead.parentEmail
          }
        />

        <Fact
          icon={
            <Phone size={16} />
          }
          label="Mobile"
          value={
            lead.parentPhone
          }
        />

        <Fact
          icon={
            <MapPin
              size={16}
            />
          }
          label="Location"
          value={
            lead.location ||
            "Not supplied"
          }
        />

        <Fact
          icon={
            <BriefcaseBusiness
              size={16}
            />
          }
          label="Package"
          value={packageName(
            lead.packageInterest
          )}
        />
      </div>

      <div className="detailBlock">
        <span>
          Enquiry
        </span>

        <p>
          {lead.enquiryMessage ||
            "No enquiry notes."}
        </p>
      </div>

      <div className="detailBlock">
        <span>
          Source
        </span>

        <p>
          {lead.source}
        </p>
      </div>

      <div className="detailActions">
        {!qualified && (
          <button
            type="button"
            className="osButton primary"
            onClick={() =>
              onQualify(
                lead
              )
            }
          >
            <CheckCircle2
              size={16}
            />

            Qualify Lead
          </button>
        )}

        {!existingClient && (
          <button
            type="button"
            className="osButton secondary"
            onClick={() =>
              onConvert(
                lead
              )
            }
          >
            <UserRound
              size={16}
            />

            Convert to Client
          </button>
        )}

        <button
          type="button"
          className="osButton secondary"
          onClick={() =>
            onCreateProject(
              lead
            )
          }
        >
          <Plus size={16} />

          Create Project
        </button>
      </div>

      {existingProjectText && (
        <div className="conversionNotice">
          <CheckCircle2
            size={16}
          />

          {
            existingProjectText
          }
        </div>
      )}
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* CLIENT CARD                                                                */
/* -------------------------------------------------------------------------- */

function ClientCard({
  client,
  projects,
}: {
  client: Client;
  projects: Project[];
}) {
  const clientProjects =
    projects.filter(
      (project) =>
        project.clientId ===
        client.id
    );

  const value =
    clientProjects.reduce(
      (
        total,
        project
      ) =>
        total +
        (project.investment ??
          0),
      0
    );

  const initials =
    client.parentName
      .trim()
      .charAt(0)
      .toUpperCase() ||
    "?";

  return (
    <article className="clientCard">
      <div className="clientAvatar">
        {initials}
      </div>

      <div className="clientMain">
        <div className="clientTop">
          <div>
            <h3>
              {
                client.parentName
              }
            </h3>

            <span>
              {
                client.parentEmail
              }
            </span>

            {client.parentPhone && (
              <span>
                {
                  client.parentPhone
                }
              </span>
            )}
          </div>

          <span className="clientStatus">
            {
              client.status
            }
          </span>
        </div>

        <div className="clientChildren">
          {client.children.map(
            (
              child
            ) => (
              <span
                key={`${child.name}-${child.age}`}
              >
                {
                  child.name
                }{" "}
                ·{" "}
                {
                  child.age
                }
              </span>
            )
          )}
        </div>

        <div className="clientFooter">
          <span>
            {
              clientProjects.length
            }{" "}
            project
            {clientProjects.length ===
            1
              ? ""
              : "s"}
          </span>

          <strong>
            {money.format(
              value
            )}
          </strong>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* PROJECT DETAIL                                                             */
/* -------------------------------------------------------------------------- */

function ProjectDetail({
  project,
  clients,
  onAdvance,
}: {
  project: Project | null;
  clients: Client[];
  onAdvance: (
    project: Project
  ) => void;
}) {
  if (!project) {
    return (
      <section className="projectDetail emptyDetail">
        <FolderKanban
          size={28}
        />

        <h3>
          Select a project
        </h3>

        <p>
          Select a project
          above to manage its
          commercial and
          delivery pipeline.
        </p>
      </section>
    );
  }

  const client =
    clients.find(
      (item) =>
        item.id ===
        project.clientId
    );

  const stageIndex =
    PROJECT_PIPELINE.findIndex(
      (stage) =>
        stage.id ===
        project.status
    );

  const nextStage =
    getNextProjectStage(
      project.status
    );

  const investment =
    project.investment ??
    0;

  const depositRequired =
    project.depositRequired ??
    0;

  const balanceRemaining =
    project.balanceDue !==
    null
      ? Math.max(
          project.balanceDue -
            project.depositPaid,
          0
        )
      : null;

  return (
    <section className="projectDetail">
      <div className="projectDetailHeader">
        <div>
          <p className="osEyebrow">
            PROJECT CONTROL
          </p>

          <h2>
            {
              project.childName
            }
            's Childhood
            Project
          </h2>

          <span>
            {
              client?.parentName ??
              "Client"
            }{" "}
            ·{" "}
            {packageName(
              project.packageId
            )}
          </span>
        </div>

        <StatusBadge
          status={
            project.status
          }
        />
      </div>

      <div className="projectDetailStats">
        <div>
          <span>
            Investment
          </span>

          <strong>
            {project.investment !==
            null
              ? money.format(
                  investment
                )
              : "Quote"}
          </strong>
        </div>

        <div>
          <span>
            Deposit Required
          </span>

          <strong>
            {project.depositRequired !==
            null
              ? money.format(
                  depositRequired
                )
              : "Quote"}
          </strong>
        </div>

        <div>
          <span>
            Paid
          </span>

          <strong>
            {money.format(
              project.depositPaid
            )}
          </strong>
        </div>

        <div>
          <span>
            Balance
          </span>

          <strong>
            {balanceRemaining !==
            null
              ? money.format(
                  balanceRemaining
                )
              : "Quote"}
          </strong>
        </div>
      </div>

      <div className="projectDetailMeta">
        <Fact
          icon={
            <MapPin
              size={16}
            />
          }
          label="Project address"
          value={
            project.projectAddress ||
            "Not supplied"
          }
        />

        <Fact
          icon={
            <BriefcaseBusiness
              size={16}
            />
          }
          label="Package"
          value={packageName(
            project.packageId
          )}
        />

        <Fact
          icon={
            <Clock3
              size={16}
            />
          }
          label="Estimated time"
          value={`${project.estimatedHours} hours`}
        />
      </div>

      {project.creativeBrief && (
        <div className="detailBlock">
          <span>
            Creative brief
          </span>

          <p>
            {
              project.creativeBrief
            }
          </p>
        </div>
      )}

      <div className="projectProgress">
        {PROJECT_PIPELINE.map(
          (
            stage,
            index
          ) => (
            <div
              className={`progressStage ${
                index <=
                stageIndex
                  ? "done"
                  : ""
              } ${
                index ===
                stageIndex
                  ? "current"
                  : ""
              }`}
              key={
                stage.id
              }
            >
              <span />

              <small>
                {
                  stage.label
                }
              </small>
            </div>
          )
        )}
      </div>

      <div className="projectDetailActions">
        {nextStage ? (
          <button
            type="button"
            className="osButton primary"
            onClick={() =>
              onAdvance(
                project
              )
            }
          >
            Move to{" "}
            {
              nextStage.label
            }

            <ArrowRight
              size={16}
            />
          </button>
        ) : (
          <div className="completedNotice">
            <CheckCircle2
              size={16}
            />

            Project closed.
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* FACT                                                                       */
/* -------------------------------------------------------------------------- */

function Fact({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="fact">
      <div className="factIcon">
        {icon}
      </div>

      <div>
        <span>
          {label}
        </span>

        <strong>
          {
            value ||
            "Not provided"
          }
        </strong>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* STATUS BADGE                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span
      className={`statusBadge status-${status}`}
    >
      {status.replaceAll(
        "_",
        " "
      )}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* EMPTY STATE                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState({
  title,
  copy,
}: {
  title: string;
  copy: string;
}) {
  return (
    <div className="emptyState">
      <div className="emptyStateIcon">
        <FolderKanban
          size={22}
        />
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {copy}
      </p>
    </div>
  );
}