"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Circle, MousePointer2, Pencil, Square } from "lucide-react";

import { buttonClassName } from "@/src/components/ui/button";

const previewTools = [MousePointer2, Square, Circle, Pencil];

export function HomeHero() {
  return (
    <section className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="relative">
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45 }}
        >
          Collaborative whiteboard
        </motion.p>
        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 max-w-xl text-5xl font-semibold leading-tight tracking-normal sm:text-6xl"
          initial={{ opacity: 0, y: 18 }}
          transition={{ delay: 0.08, duration: 0.55 }}
        >
          Sketch ideas together with a calmer canvas.
        </motion.h1>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 max-w-lg text-base leading-7 text-neutral-600 dark:text-neutral-400"
          initial={{ opacity: 0, y: 18 }}
          transition={{ delay: 0.16, duration: 0.55 }}
        >
          Move from quick notes to shared diagrams with live room sync, clean
          tools, and a workspace that stays out of your way.
        </motion.p>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 18 }}
          transition={{ delay: 0.24, duration: 0.55 }}
        >
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
        </motion.div>
      </div>

      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="relative min-h-[460px] overflow-hidden rounded-md border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
        initial={{ opacity: 0, x: 24 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            {previewTools.map((Icon, index) => (
              <motion.span
                animate={{ y: [0, -2, 0] }}
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-md border",
                  index === 1
                    ? "border-teal-600 bg-teal-600 text-white"
                    : "border-neutral-200 text-neutral-600 dark:border-neutral-800 dark:text-neutral-300",
                ].join(" ")}
                key={index}
                transition={{
                  duration: 2.6,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 1.6,
                  delay: index * 0.14,
                }}
              >
                <Icon className="h-4 w-4" />
              </motion.span>
            ))}
          </div>
          <motion.div
            animate={{ opacity: [0.45, 1, 0.45] }}
            className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300"
            transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY }}
          >
            Live sync
          </motion.div>
        </div>

        <div className="relative mt-4 h-[356px] overflow-hidden rounded-md bg-[#fbfaf8] dark:bg-neutral-950">
          <motion.div
            animate={{ x: [0, 10, 0], y: [0, -8, 0], rotate: [0, 1.5, 0] }}
            className="absolute left-12 top-14 h-28 w-44 rounded-md border-4 border-neutral-900 bg-teal-100 dark:border-neutral-100 dark:bg-teal-950"
            transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            animate={{ x: [0, -8, 0], y: [0, 10, 0], scale: [1, 1.02, 1] }}
            className="absolute right-20 top-20 h-32 w-32 rounded-full border-4 border-blue-600 bg-blue-100 dark:bg-blue-950"
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.svg
            animate={{ pathLength: [0, 1], opacity: [0.45, 1, 1] }}
            aria-hidden="true"
            className="absolute bottom-12 left-16 h-28 w-72 text-red-500"
            fill="none"
            initial={{ pathLength: 0, opacity: 0.4 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            viewBox="0 0 300 110"
          >
            <motion.path
              d="M10 76 C56 6, 90 12, 120 64 S204 118, 286 30"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="8"
            />
          </motion.svg>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            className="absolute bottom-8 right-8 rounded-md border border-neutral-200 bg-white/90 px-4 py-3 text-sm shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90"
            transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY }}
          >
            <p className="font-medium">Room: design-review</p>
            <p className="mt-1 text-neutral-500 dark:text-neutral-400">
              3 collaborators active
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
