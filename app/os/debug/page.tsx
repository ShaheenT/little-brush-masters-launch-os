import { createClient } from "../../../lib/supabase/server";

export default async function DebugPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  let profile = null;
  let profileError = null;

  if (user) {
    const result = await supabase
      .from("profiles")
      .select("id, full_name, role, is_active")
      .eq("id", user.id)
      .single();

    profile = result.data;
    profileError = result.error;
  }

  return (
    <main style={{ padding: 40, fontFamily: "monospace" }}>
      <h1>LBMOS Auth Diagnostic</h1>

      <h2>Authenticated User</h2>
      <pre>
        {JSON.stringify(
          {
            id: user?.id ?? null,
            email: user?.email ?? null,
            userError,
          },
          null,
          2
        )}
      </pre>

      <h2>Profile</h2>
      <pre>
        {JSON.stringify(
          {
            profile,
            profileError,
          },
          null,
          2
        )}
      </pre>
    </main>
  );
}