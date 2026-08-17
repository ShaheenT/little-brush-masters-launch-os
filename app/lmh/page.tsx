import type { Metadata } from "next";
import Link from "next/link";
import "./lmh.css";

export const metadata: Metadata = {
  title: "Little Masters Holding Co. — Global Children. Infinite Possibility.",
  description:
    "Little Masters Holding Co. is a global children's dream-building and innovation ecosystem company creating experiences, intellectual property, ventures and platforms for the next generation.",
};

export default function LMHPage() {
  return (
    <div className="lmh-site">
      <header className="lmh-header">
        <Link href="/" className="lmh-brand" aria-label="Little Masters Holding Co.">
          <span className="lmh-brand-mark" aria-hidden="true" />
          <span className="lmh-brand-copy">
            <small>Global Ecosystem Company</small>
            <strong>Little Masters Holding Co.</strong>
          </span>
        </Link>

        <nav className="lmh-nav" aria-label="Main navigation">
          <a href="#vision">Vision</a>
          <a href="#ecosystem">Ecosystem</a>
          <a href="#platform">Architecture</a>
          <a href="#global">Global</a>
          <a href="#contact" className="lmh-header-cta">
            Partner With Us
          </a>
        </nav>
      </header>

      <main>
        <section className="lmh-hero" id="vision">
          <div className="lmh-hero-copy">
            <div className="lmh-eyebrow">
              A global children&apos;s innovation ecosystem
            </div>

            <h1>
              Building the world
              <br />
              <em>children dream about.</em>
            </h1>

            <p className="lmh-hero-lead">
              Little Masters Holding Co. is a global ecosystem company
              creating premium experiences, intellectual property, ventures
              and innovation platforms designed around the imagination of the
              next generation.
            </p>

            <div className="lmh-hero-actions">
              <a className="lmh-btn lmh-btn-gold" href="#ecosystem">
                Explore the ecosystem
              </a>
              <a className="lmh-btn lmh-btn-ghost" href="#contact">
                Strategic partnerships
              </a>
            </div>
          </div>

          <div className="lmh-hero-visual" aria-hidden="true">
            <div className="lmh-orbit">
              <div className="lmh-orbit-ring" />

              <span className="lmh-orbit-label lmh-label-top">Imagine</span>
              <span className="lmh-orbit-label lmh-label-right">Create</span>
              <span className="lmh-orbit-label lmh-label-bottom">Build</span>
              <span className="lmh-orbit-label lmh-label-left">Impact</span>

              <div className="lmh-planet">
                <div className="lmh-planet-content">
                  <span>Little Masters</span>
                  <strong>
                    Infinite
                    <br />
                    Possibility
                  </strong>
                  <small>Children · Creativity · Future</small>
                </div>
              </div>
            </div>
          </div>

          <div className="lmh-hero-index">01 / VISION</div>
        </section>

        <section className="lmh-statement">
          <div className="lmh-statement-grid">
            <div className="lmh-section-number">01 — THE BELIEF</div>

            <div>
              <h2>
                Childhood is not a market to be served. It is a{" "}
                <em>future to be built.</em>
              </h2>

              <p>
                We believe the greatest ideas often begin with curiosity, play,
                imagination and the confidence to ask &quot;what if?&quot;.
                Little Masters exists to build the environments, brands and
                ventures that allow children to imagine bigger — while giving
                families, communities and partners meaningful ways to
                participate in that future.
              </p>
            </div>
          </div>
        </section>

        <section className="lmh-ecosystem" id="ecosystem">
          <div className="lmh-section-head">
            <div>
              <div className="lmh-kicker">The ecosystem</div>
              <h2>
                More than brands.
                <br />
                A living architecture.
              </h2>
            </div>

            <p>
              Our portfolio is designed as an interconnected ecosystem where
              experiences generate community, community generates intellectual
              property, and intellectual property creates new ventures.
            </p>
          </div>

          <div className="lmh-ecosystem-grid">
            <article className="lmh-eco-card">
              <div className="lmh-card-top">
                <span>01 / EXPERIENCES</span>
                <span className="lmh-card-icon">✦</span>
              </div>
              <span className="lmh-card-line" />
              <h3>Dream Experiences</h3>
              <p>
                Premium, memorable environments where children create,
                discover, express themselves and experience the extraordinary.
              </p>
            </article>

            <article className="lmh-eco-card">
              <div className="lmh-card-top">
                <span>02 / IP &amp; BRANDS</span>
                <span className="lmh-card-icon">◈</span>
              </div>
              <span className="lmh-card-line" />
              <h3>Future IP</h3>
              <p>
                Original characters, worlds, stories, products and brand
                systems engineered to travel across generations and markets.
              </p>
            </article>

            <article className="lmh-eco-card">
              <div className="lmh-card-top">
                <span>03 / VENTURES</span>
                <span className="lmh-card-icon">∞</span>
              </div>
              <span className="lmh-card-line" />
              <h3>Venture Studio</h3>
              <p>
                New businesses born from unmet needs, emerging technology,
                cultural shifts and the limitless imagination of young minds.
              </p>
            </article>

            <article className="lmh-eco-card">
              <div className="lmh-card-top">
                <span>04 / INNOVATION</span>
                <span className="lmh-card-icon">⌁</span>
              </div>
              <span className="lmh-card-line" />
              <h3>Innovation Lab</h3>
              <p>
                Experimentation across AI, digital products, education,
                creativity and emerging technology for the next generation.
              </p>
            </article>

            <article className="lmh-eco-card">
              <div className="lmh-card-top">
                <span>05 / COMMUNITY</span>
                <span className="lmh-card-icon">○</span>
              </div>
              <span className="lmh-card-line" />
              <h3>Global Community</h3>
              <p>
                A growing network connecting children, families, creators,
                educators, venues, investors and organisations around
                possibility.
              </p>
            </article>

            <article className="lmh-eco-card">
              <div className="lmh-card-top">
                <span>06 / IMPACT</span>
                <span className="lmh-card-icon">↗</span>
              </div>
              <span className="lmh-card-line" />
              <h3>Future Impact</h3>
              <p>
                Building pathways for creativity, confidence,
                entrepreneurship and opportunity to become part of every
                child&apos;s future.
              </p>
            </article>
          </div>
        </section>

        <section className="lmh-platform" id="platform">
          <div className="lmh-platform-layout">
            <div>
              <div className="lmh-eyebrow lmh-eyebrow-dark">Architecture</div>

              <h2>
                One vision.
                <br />
                <em>Many possibilities.</em>
              </h2>

              <p className="lmh-platform-intro">
                The holding company provides the strategic architecture behind
                the ecosystem — allowing individual brands and ventures to
                move independently while sharing a common philosophy,
                technology, operating intelligence and global ambition.
              </p>
            </div>

            <div className="lmh-platform-list">
              <div className="lmh-platform-item">
                <span className="lmh-num">01</span>
                <div>
                  <h3>Experience Engine</h3>
                  <p>
                    Designing premium physical and digital experiences that
                    children remember.
                  </p>
                </div>
                <span className="lmh-arrow">↗</span>
              </div>

              <div className="lmh-platform-item">
                <span className="lmh-num">02</span>
                <div>
                  <h3>Intellectual Property Engine</h3>
                  <p>
                    Turning original ideas, characters and worlds into
                    scalable global assets.
                  </p>
                </div>
                <span className="lmh-arrow">↗</span>
              </div>

              <div className="lmh-platform-item">
                <span className="lmh-num">03</span>
                <div>
                  <h3>Venture Engine</h3>
                  <p>
                    Identifying opportunities and building businesses around
                    tomorrow&apos;s needs.
                  </p>
                </div>
                <span className="lmh-arrow">↗</span>
              </div>

              <div className="lmh-platform-item">
                <span className="lmh-num">04</span>
                <div>
                  <h3>Technology Engine</h3>
                  <p>
                    Applying AI, digital platforms and emerging technology to
                    amplify the ecosystem.
                  </p>
                </div>
                <span className="lmh-arrow">↗</span>
              </div>

              <div className="lmh-platform-item">
                <span className="lmh-num">05</span>
                <div>
                  <h3>Capital &amp; Partnerships</h3>
                  <p>
                    Connecting aligned capital, operators and institutions
                    with high-conviction opportunities.
                  </p>
                </div>
                <span className="lmh-arrow">↗</span>
              </div>
            </div>
          </div>
        </section>

        <section className="lmh-global" id="global">
          <div className="lmh-global-content">
            <div className="lmh-eyebrow">
              Born in Africa · Built for the world
            </div>

            <h2>
              From one child&apos;s
              <br />
              imagination to a <em>global movement.</em>
            </h2>

            <p>
              We are building a company without geographic limits — beginning
              in Africa and designed from day one for international
              partnerships, licensing, experiences, technology and investment.
            </p>

            <div className="lmh-locations">
              <span className="lmh-location">Cape Town</span>
              <span className="lmh-location">Johannesburg</span>
              <span className="lmh-location">Dubai</span>
              <span className="lmh-location">London</span>
              <span className="lmh-location">New York</span>
              <span className="lmh-location">Singapore</span>
              <span className="lmh-location">Global</span>
            </div>
          </div>
        </section>

        <section className="lmh-cta" id="contact">
          <div className="lmh-cta-inner">
            <div>
              <h2>
                The future belongs to the children brave enough to imagine it.
              </h2>

              <a
                className="lmh-btn lmh-btn-dark"
                href="mailto:hello@littlemastersholding.com"
              >
                Build the future with us ↗
              </a>
            </div>

            <p>
              Little Masters Holding Co. welcomes aligned strategic partners,
              investors, creators, operators, institutions and innovators who
              believe childhood deserves extraordinary possibilities.
            </p>
          </div>
        </section>
      </main>

      <footer className="lmh-footer">
        <span>© 2026 Little Masters Holding Co.</span>
        <span>
          Global Children · Infinite Possibility · Built for Tomorrow
        </span>
      </footer>
    </div>
  );
}
