import { HomeRedirect } from "@/src/features/auth/components/home-redirect";
import { HomeHero } from "@/src/features/home/components/home-hero";
import { ThemeToggle } from "@/src/features/theme/components/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f4f1] text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <HomeRedirect />
      <div className="fixed right-5 top-5 z-10">
        <ThemeToggle />
      </div>
      <HomeHero />
    </main>
  );
}
