"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { createClient } from "../../../lib/supabase/client";

type RecoveryState =
  | "checking"
  | "ready"
  | "success"
  | "error";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [state, setState] =
    useState<RecoveryState>("checking");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const supabase = createClient();

    async function establishRecoverySession() {
      try {
        /*
         * Supabase password recovery links using the
         * implicit/legacy flow place the session tokens
         * inside the URL hash:
         *
         * #access_token=...
         * &refresh_token=...
         * &type=recovery
         *
         * The hash is never sent to the server.
         */

        const hash =
          window.location.hash.substring(1);

        const params =
          new URLSearchParams(hash);

        const accessToken =
          params.get("access_token");

        const refreshToken =
          params.get("refresh_token");

        const type =
          params.get("type");

        /*
         * If this is a recovery link, establish the
         * Supabase session from the tokens first.
         */
        if (
          type === "recovery" &&
          accessToken &&
          refreshToken
        ) {
          const {
            error: sessionError,
          } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!mounted) return;

          if (sessionError) {
            console.error(
              "Password recovery session error:",
              sessionError
            );

            setError(
              "This password reset link is invalid or has expired. Please request a new reset link."
            );

            setState("error");
            return;
          }

          /*
           * The tokens have now been exchanged for a
           * Supabase client session.
           *
           * Remove the sensitive hash from the browser
           * address bar immediately.
           */
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }

        /*
         * Confirm that a valid Supabase session now exists.
         */
        const {
          data: { session },
          error: sessionCheckError,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (sessionCheckError || !session) {
          setError(
            "This password reset link is missing, invalid, or has expired. Please request a new reset link."
          );

          setState("error");
          return;
        }

        /*
         * Recovery session successfully established.
         */
        setState("ready");
      } catch (err) {
        console.error(
          "Password recovery initialization failed:",
          err
        );

        if (!mounted) return;

        setError(
          "We could not prepare the password reset. Please request a new reset link."
        );

        setState("error");
      }
    }

    establishRecoverySession();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (password.length < 8) {
      setError(
        "Your password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "The passwords do not match."
      );
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();

      /*
       * Verify that the recovery session still exists
       * before attempting to update the password.
       */
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setError(
          "Your password reset session has expired. Please request a new reset link."
        );

        setSaving(false);
        setState("error");
        return;
      }

      /*
       * Update the authenticated user's password.
       */
      const {
        error: updateError,
      } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        console.error(
          "Password update error:",
          updateError
        );

        setError(
          updateError.message ||
            "Unable to update your password. Please try again."
        );

        setSaving(false);
        return;
      }

      /*
       * Password has been successfully changed.
       *
       * IMPORTANT:
       * Do NOT sign the user out here.
       *
       * Supabase has already authenticated the user
       * through the recovery session. Keeping that
       * session allows the user to continue directly
       * into LBMOS.
       */
      setState("success");
      setSaving(false);

      /*
       * Give the user a short confirmation before
       * entering the Command Centre.
       */
      window.setTimeout(() => {
        router.replace("/os");
        router.refresh();
      }, 1200);
    } catch (err) {
      console.error(
        "Password update failed:",
        err
      );

      setError(
        "Something went wrong while updating your password. Please try again."
      );

      setSaving(false);
    }
  }

  /*
   * Loading / session preparation
   */
  if (state === "checking") {
    return (
      <main className="lbmOsLoginPage">
        <div className="lbmOsLoginCard">

          <Brand />

          <div className="lbmOsLoginHeader">
            <p className="lbmOsEyebrow">
              LBMOS · SECURE ACCESS
            </p>

            <h1>
              Preparing reset
            </h1>

            <p>
              Preparing your secure password
              reset session…
            </p>
          </div>

        </div>
      </main>
    );
  }

  /*
   * Error state
   */
  if (state === "error") {
    return (
      <main className="lbmOsLoginPage">
        <div className="lbmOsLoginCard">

          <Brand />

          <div className="lbmOsLoginHeader">
            <p className="lbmOsEyebrow">
              LBMOS · SECURE ACCESS
            </p>

            <h1>
              Reset link unavailable
            </h1>

            <p>
              {error}
            </p>
          </div>

          <div
            style={{
              marginTop: "24px",
              textAlign: "center",
            }}
          >
            <a
              href="/os/login"
              className="lbmOsButton primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
              }}
            >
              Return to secure login
            </a>
          </div>

        </div>
      </main>
    );
  }

  /*
   * Successful password update
   */
  if (state === "success") {
    return (
      <main className="lbmOsLoginPage">
        <div className="lbmOsLoginCard">

          <Brand />

          <div className="lbmOsLoginHeader">
            <p className="lbmOsEyebrow">
              LBMOS · SECURE ACCESS
            </p>

            <h1>
              Password updated
            </h1>

            <p>
              Your password has been changed
              successfully.
            </p>

            <p>
              Entering Command Centre…
            </p>
          </div>

        </div>
      </main>
    );
  }

  /*
   * Ready state — display password form
   */
  return (
    <main className="lbmOsLoginPage">
      <div className="lbmOsLoginCard">

        <Brand />

        <div className="lbmOsLoginHeader">
          <p className="lbmOsEyebrow">
            LBMOS · SECURE ACCESS
          </p>

          <h1>
            Set new password
          </h1>

          <p>
            Create a new password for your
            Command Centre account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="lbmOsLoginForm"
        >

          <label htmlFor="password">
            New password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            minLength={8}
            required
            disabled={saving}
            autoFocus
          />

          <label htmlFor="confirmPassword">
            Confirm new password
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            minLength={8}
            required
            disabled={saving}
          />

          {error && (
            <div
              className="lbmOsLoginError"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="lbmOsButton primary"
            disabled={saving}
          >
            {saving
              ? "Updating password…"
              : "Set new password"}
          </button>

        </form>

        <div
          style={{
            marginTop: "18px",
            textAlign: "center",
          }}
        >
          <a
            href="/os/login"
            style={{
              fontSize: "13px",
              opacity: 0.7,
              textDecoration: "none",
            }}
          >
            Return to secure login
          </a>
        </div>

      </div>
    </main>
  );
}

/*
 * Shared LBMOS brand component.
 */
function Brand() {
  return (
    <div className="lbmOsBrand">

      <div className="lbmOsBrandMark">
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
  );
}