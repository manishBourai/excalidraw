"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, LogOut, Plus, Trash2, DoorOpen } from "lucide-react";
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
import {
  createRoom,
  deleteRoom,
  getCanvasSnapshot,
  getMyRooms,
} from "@/src/features/drawing/lib/rooms-api";
import type { Room } from "@/src/features/drawing/types/drawing";

export function RoomsDashboard() {
  const router = useRouter();
  const { session, isLoading } = useAuthSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [error, setError] = useState("");
  const [isFetching, setFetching] = useState(false);
  const [isCreating, setCreating] = useState(false);
  const [isJoining, setJoining] = useState(false);
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);

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

  async function refreshRooms() {
    if (!session) {
      return;
    }

    setFetching(true);
    try {
      const response = await getMyRooms(session.token);
      setRooms(response.data);
    } catch (roomsError) {
      setError(
        roomsError instanceof Error
          ? roomsError.message
          : "Could not load rooms.",
      );
    } finally {
      setFetching(false);
    }
  }

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

  async function handleDeleteRoom(room: Room) {
    if (!session) {
      return;
    }

    setError("");
    setDeletingRoomId(room.id);

    try {
      await deleteRoom(room.roomId, session.token);
      await refreshRooms();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete room.",
      );
    } finally {
      setDeletingRoomId(null);
    }
  }

  async function handleJoinRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !joinRoomId.trim()) {
      return;
    }

    const nextRoomId = joinRoomId.trim();
    setError("");
    setJoining(true);

    try {
      await getCanvasSnapshot(nextRoomId, session.token);
      router.push(`/draw/${encodeURIComponent(nextRoomId)}`);
    } catch (joinError) {
      setError(
        joinError instanceof Error ? joinError.message : "Could not join room.",
      );
    } finally {
      setJoining(false);
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
          <div className="flex flex-col gap-4">
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
              </CardContent>
            </Card>

            <Card className="dark:border-neutral-800 dark:bg-neutral-900">
              <CardHeader>
                <CardTitle>Join room</CardTitle>
                <CardDescription>
                  Open an existing room by its room id.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleJoinRoom}>
                  <div className="space-y-2">
                    <Label htmlFor="joinRoomId">Room id</Label>
                    <Input
                      id="joinRoomId"
                      onChange={(event) => setJoinRoomId(event.target.value)}
                      placeholder="roadmap-sync"
                      required
                      value={joinRoomId}
                    />
                  </div>
                  <Button className="w-full" disabled={isJoining} type="submit" variant="secondary">
                    {isJoining ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <DoorOpen className="h-4 w-4" />
                    )}
                    Join room
                  </Button>
                </form>
                {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
              </CardContent>
            </Card>
          </div>

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
                    <div
                      className="group rounded-md border border-neutral-200 bg-neutral-50 p-4 transition hover:border-teal-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-teal-500"
                      key={room.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="font-medium">{room.roomId}</h2>
                            <span
                              className={[
                                "rounded-full px-2 py-0.5 text-[11px] font-medium",
                                room.adminId === session?.user.id
                                  ? "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                                  : "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
                              ].join(" ")}
                            >
                              {room.adminId === session?.user.id ? "Owner" : "Shared"}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            {room._count?.messages ?? 0} saved updates
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {room.adminId === session?.user.id ? (
                            <Button
                              aria-label={`Delete ${room.roomId}`}
                              onClick={() => void handleDeleteRoom(room)}
                              size="icon"
                              title="Delete room"
                              type="button"
                              variant="ghost"
                            >
                              {deletingRoomId === room.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          ) : null}
                          <Link
                            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-teal-600 dark:text-neutral-300 dark:hover:text-teal-400"
                            href={`/draw/${encodeURIComponent(room.roomId)}`}
                          >
                            Open
                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
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
