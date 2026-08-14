"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/os");
  }, [router]);

  return (
    <main className="lbmOsLogout">
      <p>Signing out…</p>
    </main>
  );
}
