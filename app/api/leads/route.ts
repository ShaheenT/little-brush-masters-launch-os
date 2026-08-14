import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  createSupabaseServerClient,
} from "@/app/lib/supabase/server";

type LeadRequest = {
  parentName: string;
  parentEmail: string;
  parentPhone: string;

  childName: string;
  childAge: number;

  location: string;

  packageInterest:
    | "little_brush"
    | "signature_room"
    | "childhood_project"
    | null;

  enquiryMessage: string;

  source?: string;
};

function clean(value: unknown): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function escapeHtml(
  value: string
): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll(
      "'",
      "&#039;"
    );
}

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as Partial<LeadRequest>;

    const parentName =
      clean(body.parentName);

    const parentEmail =
      clean(body.parentEmail);

    const parentPhone =
      clean(body.parentPhone);

    const childName =
      clean(body.childName);

    const childAge =
      Number(body.childAge);

    const location =
      clean(body.location);

    const enquiryMessage =
      clean(body.enquiryMessage);

    const packageInterest =
      body.packageInterest ?? null;

    if (!parentName) {
      return NextResponse.json(
        {
          error:
            "Parent / guardian name is required.",
        },
        { status: 400 }
      );
    }

    if (!parentEmail) {
      return NextResponse.json(
        {
          error:
            "Email address is required.",
        },
        { status: 400 }
      );
    }

    if (!parentPhone) {
      return NextResponse.json(
        {
          error:
            "Mobile number is required.",
        },
        { status: 400 }
      );
    }

    if (!childName) {
      return NextResponse.json(
        {
          error:
            "Child's name is required.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(childAge) ||
      childAge < 4 ||
      childAge > 12
    ) {
      return NextResponse.json(
        {
          error:
            "Please provide a valid child's age.",
        },
        { status: 400 }
      );
    }

    if (!location) {
      return NextResponse.json(
        {
          error:
            "Project location is required.",
        },
        { status: 400 }
      );
    }

    if (!enquiryMessage) {
      return NextResponse.json(
        {
          error:
            "Please tell us what your child loves.",
        },
        { status: 400 }
      );
    }

    const supabase =
      createSupabaseServerClient();

    const { data: lead, error } =
      await supabase
        .from("leads")
        .insert({
          parent_name:
            parentName,

          parent_email:
            parentEmail,

          parent_phone:
            parentPhone,

          child_name:
            childName,

          child_age:
            childAge,

          location,

          package_interest:
            packageInterest,

          enquiry_message:
            enquiryMessage,

          source: "website",

          status: "enquiry",
        })
        .select()
        .single();

    if (error) {
      console.error(
        "Supabase lead creation failed:",
        error
      );

      return NextResponse.json(
        {
          error:
            "We could not save your enquiry. Please try again.",
        },
        { status: 500 }
      );
    }

    let emailSent = false;

    const resendApiKey =
      process.env.RESEND_API_KEY;

    const fromEmail =
      process.env.RESEND_FROM_EMAIL;

    const notificationEmail =
      process.env.LEAD_NOTIFICATION_EMAIL ||
      "littlebrushmasters@gmail.com";

    if (
      resendApiKey &&
      fromEmail
    ) {
      try {
        const resend =
          new Resend(
            resendApiKey
          );

        const { error: emailError } =
          await resend.emails.send({
            from: fromEmail,

            to: notificationEmail,

            replyTo:
              parentEmail,

            subject:
              `New Little Brush Masters enquiry — ${childName}`,

            html: `
              <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:32px;color:#202634;">

                <div style="border-bottom:1px solid #ddd;padding-bottom:20px;margin-bottom:24px;">
                  <div style="font-size:13px;letter-spacing:2px;color:#6D7280;">
                    LITTLE BRUSH MASTERS
                  </div>

                  <h1 style="margin:8px 0 0;color:#1E2A44;">
                    New Childhood Project Enquiry
                  </h1>
                </div>

                <h2 style="color:#1E2A44;">
                  Parent / Guardian
                </h2>

                <p>
                  <strong>Name:</strong>
                  ${escapeHtml(parentName)}
                </p>

                <p>
                  <strong>Email:</strong>
                  ${escapeHtml(parentEmail)}
                </p>

                <p>
                  <strong>Mobile:</strong>
                  ${escapeHtml(parentPhone)}
                </p>

                <h2 style="color:#1E2A44;">
                  Child
                </h2>

                <p>
                  <strong>Name:</strong>
                  ${escapeHtml(childName)}
                </p>

                <p>
                  <strong>Age:</strong>
                  ${childAge}
                </p>

                <p>
                  <strong>Location:</strong>
                  ${escapeHtml(location)}
                </p>

                <p>
                  <strong>Project:</strong>
                  ${escapeHtml(
                    packageInterest ||
                    "Custom / recommend for me"
                  )}
                </p>

                <h2 style="color:#1E2A44;">
                  Creative Brief
                </h2>

                <div style="background:#F8F5EF;padding:20px;border-radius:12px;white-space:pre-line;">
                  ${escapeHtml(
                    enquiryMessage
                  )}
                </div>

                <div style="margin-top:28px;padding-top:20px;border-top:1px solid #ddd;font-size:13px;color:#6D7280;">
                  <strong>Lead ID:</strong>
                  ${lead.id}<br />
                  <strong>Source:</strong>
                  Website<br />
                  <strong>Status:</strong>
                  Enquiry
                </div>

              </div>
            `,
          });

        if (!emailError) {
          emailSent = true;
        } else {
          console.error(
            "Resend email failed:",
            emailError
          );
        }
      } catch (emailError) {
        console.error(
          "Resend notification exception:",
          emailError
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        leadId: lead.id,
        emailSent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Lead API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while processing your enquiry.",
      },
      { status: 500 }
    );
  }
}
