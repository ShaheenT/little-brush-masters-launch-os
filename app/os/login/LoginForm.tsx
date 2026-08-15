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
  const [resetLoading, setResetLoading] = useState(false);

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const next = searchParams.get("next") || "/os";

  const isDevelopment =
    process.env.NODE_ENV === "development";

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

      window.location.assign(next);
    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong while signing in. Please try again."
      );

      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    const recoveryEmail = email.trim();

    setError("");

    if (!recoveryEmail) {
      setError("Enter your email address first, then select Forgot password?.");
      return;
    }

    setResetLoading(true);

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/os/reset-password`;

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          recoveryEmail,
          { redirectTo }
        );

      if (resetError) {
        console.error("Password reset request error:", resetError);
        setError(
          resetError.message ||
            "Unable to send the password reset email. Please try again."
        );
        setResetLoading(false);
        return;
      }

      router.push(
        `/os/reset-password?sent=1&email=${encodeURIComponent(recoveryEmail)}`
      );
    } catch (err) {
      console.error("Password reset request failed:", err);
      setError(
        "Something went wrong while requesting the password reset. Please try again."
      );
      setResetLoading(false);
    }
  }

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
      <div className="lbmLoginBackground">
        <div className="lbmPaintBlob lbmPaintBlobOne" />
        <div className="lbmPaintBlob lbmPaintBlobTwo" />
        <div className="lbmPaintBlob lbmPaintBlobThree" />
        <div className="lbmBrushStroke" />
        <div className="lbmSpark lbmSparkOne">✦</div>
        <div className="lbmSpark lbmSparkTwo">✧</div>
        <div className="lbmSpark lbmSparkThree">•</div>
      </div>

      <div className="lbmLoginShell">
        <section className="lbmLoginBrandPanel">
          <div className="lbmLoginBrand">
            <div className="lbmLoginLogo">
              <img
                src="/images/lbm-logonbg.png"
                alt="Little Brush Masters"
              />
            </div>

            <div className="lbmLoginBrandText">
              <strong>LITTLE BRUSH</strong>
              <span>MASTERS</span>
            </div>
          </div>

          <div className="lbmBrandContent">
            <div className="lbmBrandEyebrow">
              <Sparkles size={13} />
              <span>LITTLE BRUSH MASTERS</span>
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
              The private command centre for managing Little Brush Masters
              experiences, families, projects and creative memories.
            </p>
          </div>

          <div className="lbmBrandFooter">
            <div className="lbmFooterPaint">
              <Paintbrush size={14} />
            </div>
            <span>CREATE · PAINT · REMEMBER</span>
          </div>
        </section>

        <section className="lbmLoginPanel">
          <div className="lbmLoginPanelInner">
            <div className="lbmSecureHeader">
              <div className="lbmSecureStatus">
                <span className="lbmSecureDot" />
                <span>SECURE COMMAND CENTRE</span>
              </div>
              <span className="lbmSecureCode">LBMOS / 01</span>
            </div>

            <div className="lbmLoginHeading">
              <span className="lbmLoginEyebrow">WELCOME BACK</span>
              <h2>
                Enter your
                <br />
                <em>creative space.</em>
              </h2>
              <p>
                Sign in to continue managing your Little Brush Masters
                experiences.
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="lbmLoginForm"
            >
              <div className="lbmField">
                <label htmlFor="email">Email address</label>
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
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    disabled={loading || devLoading || resetLoading}
                  />
                </div>
              </div>

              <div className="lbmField">
                <div className="lbmPasswordLabel">
                  <label htmlFor="password">Password</label>

                  <button
                    type="button"
                    className="lbmForgotButton"
                    onClick={handleForgotPassword}
                    disabled={loading || devLoading || resetLoading}
                  >
                    {resetLoading
                      ? "Sending reset link…"
                      : "Forgot password?"}
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
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    disabled={loading || devLoading || resetLoading}
                  />

                  <button
                    type="button"
                    className="lbmPasswordToggle"
                    onClick={() => setShowPassword((current) => !current)}
                    disabled={loading || devLoading || resetLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="lbmLoginError" role="alert">
                  <span>!</span>
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="lbmSignInButton"
                disabled={loading || devLoading || resetLoading}
              >
                <span>
                  {loading
                    ? "Opening Command Centre…"
                    : "Enter Command Centre"}
                </span>
                {!loading && <ArrowRight size={19} strokeWidth={1.6} />}
              </button>
            </form>

            {isDevelopment && (
              <div className="lbmDevelopment">
                <div className="lbmDevelopmentDivider">
                  <span />
                  <small>DEVELOPMENT</small>
                  <span />
                </div>

                <button
                  type="button"
                  className="lbmDevButton"
                  onClick={handleDevLogin}
                  disabled={loading || devLoading || resetLoading}
                >
                  {devLoading
                    ? "Opening Command Centre…"
                    : "Open Development Session"}
                </button>

                <button
                  type="button"
                  className="lbmClearSession"
                  onClick={clearDevSession}
                >
                  Clear development session
                </button>
              </div>
            )}

            <div className="lbmLoginFooter">
              <span className="lbmFooterLine" />
              <span>LITTLE BRUSH MASTERS™</span>
              <span className="lbmFooterLine" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
