"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { getStoredSession } from "../lib/auth-storage";

export function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (getStoredSession()) {
      router.replace("/draw");
    }
  }, [router]);

  return null;
}
