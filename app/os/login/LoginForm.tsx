"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Paintbrush,
  Sparkles,
} from "lucide-react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { createClient } from "../../../lib/supabase/client";

import "./login.css";

const DEV_COOKIE = "lbm_dev_session";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [devLoading, setDevLoading] = useState(false);

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const next = searchParams.get("next") || "/os";

  const isDevelopment =
    process.env.NODE_ENV === "development";

  /*
   * ---------------------------------------------------------
   * DEVELOPMENT SESSION CHECK
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!isDevelopment) return;

    const cookies = document.cookie
      .split(";")
      .map((cookie) => cookie.trim());

    const hasDevSession = cookies.some(
      (cookie) =>
        cookie === `${DEV_COOKIE}=1`
    );

    if (hasDevSession) {
      router.replace(next);
    }
  }, [isDevelopment, next, router]);

  /*
   * ---------------------------------------------------------
   * SUPABASE LOGIN
   * ---------------------------------------------------------
   */

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const {
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        setError(
          loginError.message ||
            "Unable to sign in. Please check your credentials."
        );

        setLoading(false);
        return;
      }

      /*
       * Hard navigation ensures the new Supabase
       * authentication cookies are available to middleware.
       */
      window.location.assign(next);
    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong while signing in. Please try again."
      );

      setLoading(false);
    }
  }

  /*
   * ---------------------------------------------------------
   * DEVELOPMENT LOGIN
   * ---------------------------------------------------------
   */

  function handleDevLogin() {
    if (!isDevelopment) {
      setError(
        "Development login is not available in production."
      );

      return;
    }

    setError("");
    setDevLoading(true);

    document.cookie = [
      `${DEV_COOKIE}=1`,
      "Path=/",
      "Max-Age=86400",
      "SameSite=Lax",
    ].join("; ");

    window.setTimeout(() => {
      window.location.assign(next);
    }, 100);
  }

  /*
   * ---------------------------------------------------------
   * CLEAR DEVELOPMENT SESSION
   * ---------------------------------------------------------
   */

  function clearDevSession() {
    document.cookie = [
      `${DEV_COOKIE}=`,
      "Path=/",
      "Max-Age=0",
      "SameSite=Lax",
    ].join("; ");

    setError("");
  }

  return (
    <main className="lbmLoginPage">

      {/* --------------------------------------------------
          Decorative background
          -------------------------------------------------- */}

      <div className="lbmLoginBackground">
        <div className="lbmPaintBlob lbmPaintBlobOne" />
        <div className="lbmPaintBlob lbmPaintBlobTwo" />
        <div className="lbmPaintBlob lbmPaintBlobThree" />

        <div className="lbmBrushStroke" />

        <div className="lbmSpark lbmSparkOne">
          ✦
        </div>

        <div className="lbmSpark lbmSparkTwo">
          ✧
        </div>

        <div className="lbmSpark lbmSparkThree">
          •
        </div>
      </div>

      {/* --------------------------------------------------
          Login shell
          -------------------------------------------------- */}

      <div className="lbmLoginShell">

        {/* ------------------------------------------------
            BRAND PANEL
            ------------------------------------------------ */}

        <section className="lbmLoginBrandPanel">

          <div className="lbmLoginBrand">

            <div className="lbmLoginLogo">
  <img
    src="/images/lbm-logonbg.png"
    alt="Little Brush Masters"
  />
</div>

            <div className="lbmLoginBrandText">
  <strong>
    LITTLE BRUSH
  </strong>

  <span>
    MASTERS
  </span>
</div>

          </div>

          <div className="lbmBrandContent">

            <div className="lbmBrandEyebrow">
              <Sparkles size={13} />
              <span>
                LITTLE BRUSH MASTERS
              </span>
            </div>

            <h1>
              Where
              <br />
              <em>imagination</em>
              <br />
              becomes
              <br />
              <strong>memory.</strong>
            </h1>

            <div className="lbmGoldLine" />

            <p>
              The private command centre for
              managing Little Brush Masters
              experiences, families, projects
              and creative memories.
            </p>

          </div>

          <div className="lbmBrandFooter">

            <div className="lbmFooterPaint">
              <Paintbrush size={14} />
            </div>

            <span>
              CREATE · PAINT · REMEMBER
            </span>

          </div>

        </section>

        {/* ------------------------------------------------
            LOGIN PANEL
            ------------------------------------------------ */}

        <section className="lbmLoginPanel">

          <div className="lbmLoginPanelInner">

            {/* Secure status */}

            <div className="lbmSecureHeader">

              <div className="lbmSecureStatus">
                <span className="lbmSecureDot" />

                <span>
                  SECURE COMMAND CENTRE
                </span>
              </div>

              <span className="lbmSecureCode">
                LBMOS / 01
              </span>

            </div>

            {/* Heading */}

            <div className="lbmLoginHeading">

              <span className="lbmLoginEyebrow">
                WELCOME BACK
              </span>

              <h2>
                Enter your
                <br />
                <em>creative space.</em>
              </h2>

              <p>
                Sign in to continue managing
                your Little Brush Masters
                experiences.
              </p>

            </div>

            {/* Form */}

            <form
              onSubmit={handleLogin}
              className="lbmLoginForm"
            >

              {/* Email */}

              <div className="lbmField">

                <label htmlFor="email">
                  Email address
                </label>

                <div className="lbmInputWrap">

                  <Mail
                    size={17}
                    strokeWidth={1.6}
                    className="lbmInputIcon"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                    disabled={
                      loading ||
                      devLoading
                    }
                  />

                </div>

              </div>

              {/* Password */}

              <div className="lbmField">

                <div className="lbmPasswordLabel">

                  <label htmlFor="password">
                    Password
                  </label>

                  <button
                    type="button"
                    className="lbmForgotButton"
                    onClick={() =>
                      router.push(
                        "/os/reset-password"
                      )
                    }
                    disabled={
                      loading ||
                      devLoading
                    }
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="lbmInputWrap">

                  <LockKeyhole
                    size={17}
                    strokeWidth={1.6}
                    className="lbmInputIcon"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    required
                    disabled={
                      loading ||
                      devLoading
                    }
                  />

                  <button
                    type="button"
                    className="lbmPasswordToggle"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    disabled={
                      loading ||
                      devLoading
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>

              {/* Error */}

              {error && (
                <div
                  className="lbmLoginError"
                  role="alert"
                >
                  <span>!</span>

                  <p>
                    {error}
                  </p>
                </div>
              )}

              {/* Sign in */}

              <button
                type="submit"
                className="lbmSignInButton"
                disabled={
                  loading ||
                  devLoading
                }
              >

                <span>
                  {loading
                    ? "Opening Command Centre…"
                    : "Enter Command Centre"}
                </span>

                {!loading && (
                  <ArrowRight
                    size={19}
                    strokeWidth={1.6}
                  />
                )}

              </button>

            </form>

            {/* Development login */}

            {isDevelopment && (
              <div className="lbmDevelopment">

                <div className="lbmDevelopmentDivider">
                  <span />
                  <small>
                    DEVELOPMENT
                  </small>
                  <span />
                </div>

                <button
                  type="button"
                  className="lbmDevButton"
                  onClick={handleDevLogin}
                  disabled={
                    loading ||
                    devLoading
                  }
                >
                  {devLoading
                    ? "Opening Command Centre…"
                    : "Open Development Session"}
                </button>

                <button
                  type="button"
                  className="lbmClearSession"
                  onClick={
                    clearDevSession
                  }
                >
                  Clear development session
                </button>

              </div>
            )}

            {/* Footer */}

            <div className="lbmLoginFooter">

              <span className="lbmFooterLine" />

              <span>
                LITTLE BRUSH MASTERS™
              </span>

              <span className="lbmFooterLine" />

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}