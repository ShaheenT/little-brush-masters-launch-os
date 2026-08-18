"use client";

import { useState } from "react";
import { StatefulButton } from "../../components/LBMOSInteractive";

const tabs = [
  ["business", "Business"],
  ["notifications", "Notifications"],
  ["integrations", "Integrations"],
  ["account", "Account"],
] as const;

export default function SettingsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number][0]>("business");

  return (
    <div className="lbmAcPage">
      <header className="lbmAcPageHeader">
        <div>
          <p className="lbmAcEyebrow">LBMOS · ADMINISTRATION</p>
          <h1>Settings</h1>
          <p>
            Configure the Little Brush Masters operating system and
            business environment.
          </p>
        </div>
      </header>

      <div className="lbmAcTabs">
        {tabs.map(([value, label]) => (
          <button
            key={value}
            className={`lbmAcTab ${tab === value ? "active" : ""}`}
            onClick={() => setTab(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="lbmAcCard">
        {tab === "business" && (
          <>
            <div className="lbmAcCardTop">
              <div>
                <p className="lbmAcEyebrow">BUSINESS PROFILE</p>
                <h2>Little Brush Masters</h2>
              </div>
            </div>

            <div className="lbmAcGrid">
              <label>
                Business email
                <input
                  className="lbmAcSearch"
                  defaultValue="hello@littlebrushmasters.co.za"
                />
              </label>

              <label>
                WhatsApp
                <input
                  className="lbmAcSearch"
                  defaultValue="+27 63 754 5023"
                />
              </label>
            </div>

            <div className="lbmAcCardFooter">
              <span className="lbmAcMeta">
                Changes are saved to the LBMOS configuration.
              </span>

              <StatefulButton>Save Changes</StatefulButton>
            </div>
          </>
        )}

        {tab === "notifications" && (
          <>
            <p className="lbmAcEyebrow">NOTIFICATIONS</p>
            <h2>Operational alerts</h2>
            <p className="lbmAcMeta">
              Configure lead, booking and project notifications.
            </p>
          </>
        )}

        {tab === "integrations" && (
          <>
            <p className="lbmAcEyebrow">INTEGRATIONS</p>
            <h2>Connected services</h2>
            <p className="lbmAcMeta">
              Supabase, WhatsApp and future business integrations will
              be managed here.
            </p>
          </>
        )}

        {tab === "account" && (
          <>
            <p className="lbmAcEyebrow">ACCOUNT</p>
            <h2>Administrator account</h2>
            <p className="lbmAcMeta">
              Authentication, security and account preferences.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
