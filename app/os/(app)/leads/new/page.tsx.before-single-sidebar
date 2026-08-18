"use client";

import { useState } from "react";
import Link from "next/link";
import OSNav from "../../../components/OSNav";

export default function NewLeadPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="lbmOsLayout">
      <OSNav />

      <main className="lbmOsMain">
        <header className="lbmOsHeader">
          <div>
            <p className="lbmOsEyebrow">
              LBMOS · LEADS
            </p>
            <h1>New Lead</h1>
            <p>
              Capture a new family enquiry.
            </p>
          </div>

          <Link
            href="/os/leads"
            className="lbmOsButton secondary"
          >
            Back to leads
          </Link>
        </header>

        <section className="lbmOsCard">
          <form
            onSubmit={handleSubmit}
            className="lbmOsForm"
          >
            <label>
              Parent / Guardian name
              <input
                name="full_name"
                required
                placeholder="Full name"
              />
            </label>

            <label>
              Email
              <input
                name="email"
                type="email"
                placeholder="parent@example.com"
              />
            </label>

            <label>
              WhatsApp / Phone
              <input
                name="phone"
                placeholder="+27..."
              />
            </label>

            <label>
              Child's name
              <input
                name="child_name"
                placeholder="Child's name"
              />
            </label>

            <label>
              Enquiry
              <textarea
                name="message"
                rows={5}
                placeholder="Tell us about the project..."
              />
            </label>

            {submitted && (
              <div className="lbmOsSuccess">
                Lead captured locally. Supabase
                persistence will be connected next.
              </div>
            )}

            <button
              type="submit"
              className="lbmOsButton primary"
            >
              Create Lead
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
