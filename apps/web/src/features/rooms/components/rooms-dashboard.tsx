"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, LogOut, Plus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { clearStoredSession } from "@/src/features/auth/lib/auth-storage";
import { useAuthSession } from "@/src/features/auth/hooks/use-auth-session";
import { ThemeToggle } from "@/src/features/theme/components/theme-toggle";
import { createRoom, getMyRooms } from "@/src/features/drawing/lib/rooms-api";
import type { Room } from "@/src/features/drawing/types/drawing";

export function RoomsDashboard() {
  const router = useRouter();
  const { session, isLoading } = useAuthSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const [isFetching, setFetching] = useState(false);
  const [isCreating, setCreating] = useState(false);

  useEffect(() => {
    if (!session) {
      return;
    }

    setFetching(true);
    void getMyRooms(session.token)
      .then((response) => setRooms(response.data))
      .catch((roomsError) =>
        setError(
          roomsError instanceof Error
            ? roomsError.message
            : "Could not load rooms.",
        ),
      )
      .finally(() => setFetching(false));
  }, [session]);

  async function handleCreateRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !roomId.trim()) {
      return;
    }

    const nextRoomId = roomId.trim();
    setError("");
    setCreating(true);

    try {
      await createRoom(nextRoomId, session.token);
      router.push(`/draw/${encodeURIComponent(nextRoomId)}`);
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Could not create room.",
      );
    } finally {
      setCreating(false);
    }
  }

  function handleSignOut() {
    clearStoredSession();
    router.push("/");
  }

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-neutral-100 text-sm text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
        Loading rooms
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link className="text-xl font-semibold" href="/">
              Excalidraw Workspace
            </Link>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Welcome back, {session?.user.username}. Pick up where you left off.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={handleSignOut} type="button" variant="secondary">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[22rem_1fr]">
          <Card className="dark:border-neutral-800 dark:bg-neutral-900">
            <CardHeader>
              <CardTitle>Create room</CardTitle>
              <CardDescription>
                Start a new shared canvas with a memorable room id.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleCreateRoom}>
                <div className="space-y-2">
                  <Label htmlFor="roomId">Room id</Label>
                  <Input
                    id="roomId"
                    onChange={(event) => setRoomId(event.target.value)}
                    placeholder="design-review"
                    required
                    value={roomId}
                  />
                </div>
                <Button className="w-full" disabled={isCreating} type="submit">
                  {isCreating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Create room
                </Button>
              </form>
              {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
            </CardContent>
          </Card>

          <Card className="dark:border-neutral-800 dark:bg-neutral-900">
            <CardHeader>
              <CardTitle>Your rooms</CardTitle>
              <CardDescription>
                Rooms you created or worked in previously.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isFetching ? (
                <div className="flex min-h-48 items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading rooms
                </div>
              ) : rooms.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {rooms.map((room) => (
                    <Link
                      className="group rounded-md border border-neutral-200 bg-neutral-50 p-4 transition hover:border-teal-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-teal-500"
                      href={`/draw/${encodeURIComponent(room.roomId)}`}
                      key={room.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="font-medium">{room.roomId}</h2>
                          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            {room._count?.messages ?? 0} saved updates
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-teal-600" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-48 items-center justify-center rounded-md border border-dashed border-neutral-200 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                  Create your first room to start drawing.
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
