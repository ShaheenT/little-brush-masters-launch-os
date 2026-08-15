import Image from "next/image";
import "./brushy.css";

export default function BrushyPage() {
  return (
    <main className="brushy-page">
      <div
        className="brushy-background brushy-background-one"
        aria-hidden="true"
      />

      <div
        className="brushy-background brushy-background-two"
        aria-hidden="true"
      />

      <section className="brushy-container">
        <header className="brushy-header">
          <div className="brushy-logo-mark">
            <Image
              src="/images/lbm-logonbg.png"
              alt="Little Brush Masters"
              width={180}
              height={180}
              priority
              className="brushy-logo-image"
            />
          </div>
        </header>

        <section className="brushy-content">
          <div className="brushy-visual">
            <div
              className="brushy-orbit brushy-orbit-one"
              aria-hidden="true"
            />

            <div
              className="brushy-orbit brushy-orbit-two"
              aria-hidden="true"
            />

            <Image
              src="/images/Brushy.png"
              alt="Brushy, the Little Brush Masters mascot"
              width={520}
              height={520}
              priority
              className="brushy-image"
            />
          </div>

          <div className="brushy-message">
            <p className="brushy-eyebrow">
              A LITTLE SECRET FROM BRUSHY
            </p>

            <h1>
              Brushy has a
              <span>secret for you…</span>
            </h1>

            <p className="brushy-introduction">
              Something magical is coming to Cape Town.
            </p>

            <div className="brushy-release">
              <strong>
                10 Little Brush Master experiences
              </strong>

              <span>
                have been released.
              </span>
            </div>

            <div className="brushy-details">
              <div>
                <span>LOCATION</span>
                <strong>Cape Town</strong>
              </div>

              <div>
                <span>AVAILABILITY</span>
                <strong>Limited</strong>
              </div>

              <div>
                <span>AGES</span>
                <strong>6–12</strong>
              </div>
            </div>

            <a
              href="https://wa.me/27637545023?text=Hi%20Little%20Brush%20Masters%2C%20Brushy%20sent%20me!%20I%27d%20like%20to%20claim%20a%20spot%20for%20my%20child."
              target="_blank"
              rel="noopener noreferrer"
              className="brushy-button"
              aria-label="Claim a Little Brush Masters spot on WhatsApp"
            >
              <span>Claim a Spot</span>
              <span className="brushy-arrow" aria-hidden="true">
                →
              </span>
            </a>

            <p className="brushy-note">
              A childhood experience worth remembering.
            </p>
          </div>
        </section>

        <footer className="brushy-footer">
          <span>Little Brush Masters</span>
          <span aria-hidden="true">•</span>
          <span>Creative experiences for little artists</span>
        </footer>
      </section>
    </main>
  );
}