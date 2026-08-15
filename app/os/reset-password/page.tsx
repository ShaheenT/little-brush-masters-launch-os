"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

type RecoveryState = "checking" | "request" | "sent" | "ready" | "success" | "error";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState<RecoveryState>("checking");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    async function establishRecoverySession() {
      try {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const type = params.get("type");

        if (type === "recovery" && accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!mounted) return;

          if (sessionError) {
            console.error("Password recovery session error:", sessionError);
            setError("This password reset link is invalid or has expired. Please request a new reset link.");
            setState("error");
            return;
          }

          window.history.replaceState({}, document.title, window.location.pathname);
        }

        const {
          data: { session },
          error: sessionCheckError,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (sessionCheckError) {
          setError("We could not verify your password reset session. Please request a new reset link.");
          setState("error");
          return;
        }

        setState(session ? "ready" : "request");
      } catch (err) {
        console.error("Password recovery initialization failed:", err);
        if (!mounted) return;
        setError("We could not prepare password recovery. Please request a new reset link.");
        setState("error");
      }
    }

    establishRecoverySession();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleRequestReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/os/reset-password`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (resetError) {
        setError(resetError.message || "Unable to send the password reset email.");
        setSaving(false);
        return;
      }

      setState("sent");
      setSaving(false);
    } catch (err) {
      console.error("Password reset request failed:", err);
      setError("Something went wrong while sending the reset email. Please try again.");
      setSaving(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setError("Your password reset session has expired. Please request a new reset link.");
        setSaving(false);
        setState("request");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        console.error("Password update error:", updateError);
        setError(updateError.message || "Unable to update your password. Please try again.");
        setSaving(false);
        return;
      }

      setState("success");
      setSaving(false);

      window.setTimeout(() => {
        router.replace("/os");
        router.refresh();
      }, 1200);
    } catch (err) {
      console.error("Password update failed:", err);
      setError("Something went wrong while updating your password. Please try again.");
      setSaving(false);
    }
  }

  if (state === "checking") {
    return <Shell title="Preparing reset" description="Preparing your secure password reset session…" />;
  }

  if (state === "sent") {
    return (
      <Shell
        eyebrow="LBMOS · SECURE ACCESS"
        title="Check your email"
        description="If an account exists for that email address, Supabase has sent a secure password reset link. Open it to continue."
      >
        <a href="/os/login" className="lbmOsButton primary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none", width: "100%" }}>
          Return to secure login
        </a>
      </Shell>
    );
  }

  if (state === "error") {
    return (
      <Shell eyebrow="LBMOS · SECURE ACCESS" title="Reset link unavailable" description={error}>
        <a href="/os/reset-password" className="lbmOsButton primary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none", width: "100%" }}>
          Request a new reset link
        </a>
      </Shell>
    );
  }

  if (state === "success") {
    return <Shell eyebrow="LBMOS · SECURE ACCESS" title="Password updated" description="Your password has been changed successfully. Entering Command Centre…" />;
  }

  if (state === "request") {
    return (
      <Shell eyebrow="LBMOS · SECURE ACCESS" title="Reset your password" description="Enter the email address associated with your Little Brush Masters Command Centre account. We’ll send you a secure reset link.">
        <form onSubmit={handleRequestReset} className="lbmOsLoginForm">
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" required disabled={saving} autoFocus />
          {error && <div className="lbmOsLoginError" role="alert">{error}</div>}
          <button type="submit" className="lbmOsButton primary" disabled={saving}>
            {saving ? "Sending reset link…" : "Send reset link"}
          </button>
        </form>
        <div style={{ marginTop: "18px", textAlign: "center" }}>
          <a href="/os/login" style={{ fontSize: "13px", opacity: 0.7, textDecoration: "none" }}>Return to secure login</a>
        </div>
      </Shell>
    );
  }

  return (
    <Shell eyebrow="LBMOS · SECURE ACCESS" title="Set new password" description="Create a new password for your Command Centre account.">
      <form onSubmit={handleSubmit} className="lbmOsLoginForm">
        <label htmlFor="password">New password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required disabled={saving} autoFocus />
        <label htmlFor="confirmPassword">Confirm new password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} required disabled={saving} />
        {error && <div className="lbmOsLoginError" role="alert">{error}</div>}
        <button type="submit" className="lbmOsButton primary" disabled={saving}>
          {saving ? "Updating password…" : "Set new password"}
        </button>
      </form>
    </Shell>
  );
}

function Shell({ eyebrow = "LBMOS · SECURE ACCESS", title, description, children }: { eyebrow?: string; title: string; description: string; children?: React.ReactNode }) {
  return (
    <main className="lbmOsLoginPage">
      <div className="lbmOsLoginCard">
        <Brand />
        <div className="lbmOsLoginHeader">
          <p className="lbmOsEyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {children && <div style={{ marginTop: "24px" }}>{children}</div>}
      </div>
    </main>
  );
}

function Brand() {
  return (
    <div className="lbmOsBrand">
      <div className="lbmOsBrandMark">LB</div>
      <div>
        <strong>LITTLE BRUSH</strong>
        <span>MASTERS</span>
      </div>
    </div>
  );
}
