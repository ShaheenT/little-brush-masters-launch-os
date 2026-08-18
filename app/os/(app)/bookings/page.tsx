"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MagneticLink,
  MovingBorderLink,
  HoverBorderButton,
} from "../../components/LBMOSInteractive";

const bookings = [
  {
    date: "24",
    month: "AUG",
    family: "Williams Family",
    child: "Maya",
    experience: "The Little Brush Experience",
    time: "15:00 — 18:00",
    location: "Cape Town",
    status: "Confirmed",
  },
  {
    date: "30",
    month: "AUG",
    family: "Petersen Family",
    child: "Leo",
    experience: "The Signature Room",
    time: "10:00 — 13:00",
    location: "Cape Town",
    status: "Confirmed",
  },
];

export default function BookingsPage() {
  const [tab, setTab] = useState("upcoming");

  return (
    <div className="lbmAcPage">
      <header className="lbmAcPageHeader">
        <div>
          <p className="lbmAcEyebrow">LBMOS · PRIVATE EXPERIENCES</p>
          <h1>Private Bookings</h1>
          <p>
            Manage the Little Brush Masters private childhood experience
            calendar.
          </p>
        </div>

        <MagneticLink href="/os/leads">
          + New Booking
        </MagneticLink>
      </header>

      <div className="lbmAcStats">
        <div className="lbmAcStat">
          <span>Upcoming</span>
          <strong>2</strong>
        </div>
        <div className="lbmAcStat">
          <span>This month</span>
          <strong>2</strong>
        </div>
        <div className="lbmAcStat">
          <span>Capacity</span>
          <strong>Limited</strong>
        </div>
      </div>

      <div className="lbmAcTabs">
        <button
          className={`lbmAcTab ${tab === "upcoming" ? "active" : ""}`}
          onClick={() => setTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`lbmAcTab ${tab === "month" ? "active" : ""}`}
          onClick={() => setTab("month")}
        >
          This Month
        </button>
        <button
          className={`lbmAcTab ${tab === "completed" ? "active" : ""}`}
          onClick={() => setTab("completed")}
        >
          Completed
        </button>
      </div>

      <section className="lbmAcGrid">
        {bookings.map((booking) => (
          <article className="lbmAcCard" key={booking.family}>
            <div className="lbmAcCardTop">
              <div>
                <p className="lbmAcEyebrow">
                  {booking.month} · {booking.date}
                </p>
                <h3>{booking.family}</h3>
                <div className="lbmAcMeta">
                  {booking.child} · {booking.experience}
                </div>
              </div>

              <span className="lbmAcBadge">{booking.status}</span>
            </div>

            <div className="lbmAcMeta">
              {booking.time} · {booking.location}
            </div>

            <div className="lbmAcCardFooter">
              <span className="lbmAcMeta">Private experience</span>
              <MovingBorderLink href="/os/projects">
                View Booking
              </MovingBorderLink>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
