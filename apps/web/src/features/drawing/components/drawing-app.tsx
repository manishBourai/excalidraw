"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { useAuthSession } from "../../auth/hooks/use-auth-session";
import { clearStoredSession } from "../../auth/lib/auth-storage";
import { ThemeToggle } from "../../theme/components/theme-toggle";
import { useDrawingStore } from "../store/drawing-store";
import { DrawingToolbar } from "./drawing-toolbar";
import { RoomPanel } from "./room-panel";
import { StylePanel } from "./style-panel";

const CanvasStage = dynamic(
  () => import("./canvas-stage").then((mod) => mod.CanvasStage),
  {
    loading: () => (
      <div className="flex h-full min-h-[520px] items-center justify-center rounded-md border border-neutral-200 bg-[#fbfaf8] text-sm text-neutral-500 shadow-sm">
        Loading canvas
      </div>
    ),
    ssr: false,
  },
);

type DrawingAppProps = {
  roomId: string;
};

export function DrawingApp({ roomId }: DrawingAppProps) {
  const router = useRouter();
  const { session, isLoading } = useAuthSession();
  const [deleteSelection, setDeleteSelection] = useState<() => void>(
    () => () => undefined,
  );
  const setRoomId = useDrawingStore((state) => state.setRoomId);
  const setToken = useDrawingStore((state) => state.setToken);
  const setUsername = useDrawingStore((state) => state.setUsername);

  const handleDeleteSelectionReady = useCallback((handler: () => void) => {
    setDeleteSelection(() => handler);
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }

    setRoomId(roomId);
    setToken(session.token);
    setUsername(session.user.username);
  }, [roomId, session, setRoomId, setToken, setUsername]);

  function handleSignOut() {
    clearStoredSession();
    setToken("");
    router.push("/");
  }

  if (isLoading || !session) {
    return (
      <main className="grid min-h-screen place-items-center bg-neutral-100 text-sm text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
        Opening workspace
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-4 px-4 py-4">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/" className="text-xl font-semibold tracking-normal">
              Excalidraw Workspace
            </Link>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Room {roomId}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DrawingToolbar onDeleteSelection={deleteSelection} />
            <ThemeToggle />
            <Button onClick={handleSignOut} type="button" variant="secondary">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </header>

        <div className="grid flex-1 gap-4 lg:grid-cols-[1fr_18rem]">
          <CanvasStage onDeleteSelection={handleDeleteSelectionReady} />
          <div className="flex flex-col gap-4">
            <RoomPanel />
            <StylePanel />
          </div>
        </div>
      </div>
    </main>
  );
}
