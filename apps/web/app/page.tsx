import Link from "next/link";
import { ArrowRight, Circle, MousePointer2, Pencil, Square } from "lucide-react";

import { buttonClassName } from "@/src/components/ui/button";
import { ThemeToggle } from "@/src/features/theme/components/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f4f1] text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="fixed right-5 top-5 z-10">
        <ThemeToggle />
      </div>
      <section className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700">
            Collaborative whiteboard
          </p>
          <h1 className="mt-4 max-w-xl text-5xl font-semibold leading-tight tracking-normal sm:text-6xl">
            Sketch ideas together without the noise.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-neutral-600 dark:text-neutral-400">
            A focused drawing workspace with Fabric.js tools, live room sync,
            and saved canvas state.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className={buttonClassName()} href="/signup">
              Start drawing
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              className={buttonClassName({ variant: "secondary" })}
              href="/signin"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="relative min-h-[440px] rounded-md border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 dark:border-neutral-800">
            {[MousePointer2, Square, Circle, Pencil].map((Icon, index) => (
              <span
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-md border",
                  index === 1
                    ? "border-teal-600 bg-teal-600 text-white"
                    : "border-neutral-200 text-neutral-600 dark:border-neutral-800 dark:text-neutral-300",
                ].join(" ")}
                key={index}
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
          <div className="relative mt-4 h-[340px] overflow-hidden rounded-md bg-[#fbfaf8] dark:bg-neutral-950">
            <div className="absolute left-14 top-16 h-28 w-44 rounded-md border-4 border-neutral-900 bg-teal-100" />
            <div className="absolute right-20 top-20 h-32 w-32 rounded-full border-4 border-blue-600 bg-blue-100" />
            <svg
              aria-hidden="true"
              className="absolute bottom-12 left-20 h-28 w-64 text-red-500"
              fill="none"
              viewBox="0 0 260 110"
            >
              <path
                d="M8 78 C48 6, 75 9, 108 64 S177 118, 246 32"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="8"
              />
            </svg>
          </div>
        </div>
      </section>
    </main>
  );
}
