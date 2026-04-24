import Link from "next/link";

import { AuthForm } from "@/src/features/auth/components/auth-form";
import { ThemeToggle } from "@/src/features/theme/components/theme-toggle";

export default function SignupPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-neutral-100 px-4 py-10 dark:bg-neutral-950">
      <div className="fixed right-5 top-5">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <Link
          className="mb-6 inline-block text-sm font-medium text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50"
          href="/"
        >
          Back home
        </Link>
        <AuthForm mode="signup" />
      </div>
    </main>
  );
}
