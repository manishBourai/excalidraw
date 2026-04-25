"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getStoredSession, type AuthSession } from "../lib/auth-storage";

export function useAuthSession() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const storedSession = getStoredSession();

    if (!storedSession) {
      setLoading(false);
      router.replace("/signin");
      return;
    }

    setSession(storedSession);
    setLoading(false);
  }, [router]);

  return { session, isLoading };
}
