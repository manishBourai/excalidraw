"use client";

import { Link2, Loader2, Save } from "lucide-react";
import { useState } from "react";

import { Button } from "@/src/components/ui/button";
import { createRoom } from "../lib/rooms-api";
import { useDrawingStore } from "../store/drawing-store";

export function RoomPanel() {
  const roomId = useDrawingStore((state) => state.roomId);
  const token = useDrawingStore((state) => state.token);
  const username = useDrawingStore((state) => state.username);
  const syncStatus = useDrawingStore((state) => state.syncStatus);
  const isSaving = useDrawingStore((state) => state.isSaving);
  const lastSavedAt = useDrawingStore((state) => state.lastSavedAt);
  const setRoomId = useDrawingStore((state) => state.setRoomId);
  const setUsername = useDrawingStore((state) => state.setUsername);
  const [message, setMessage] = useState("");

  async function handleCreateRoom() {
    if (!token || !roomId) {
      setMessage("Add an auth token and room id first.");
      return;
    }

    try {
      await createRoom(roomId, token);
      setMessage("Room is ready.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create room.");
    }
  }

  return (
    <aside className="w-full rounded-md border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:w-72">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">Session</h2>
        <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs capitalize text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          {syncStatus}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Room</span>
          <input
            className="mt-1 h-10 w-full rounded-md border border-neutral-200 px-3 text-sm outline-none transition focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50"
            onChange={(event) => setRoomId(event.target.value)}
            value={roomId}
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Name</span>
          <input
            className="mt-1 h-10 w-full rounded-md border border-neutral-200 px-3 text-sm outline-none transition focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50"
            onChange={(event) => setUsername(event.target.value)}
            value={username}
          />
        </label>

        <Button
          className="w-full"
          disabled={!token}
          onClick={handleCreateRoom}
          type="button"
          variant="secondary"
        >
          <Link2 className="h-4 w-4" />
          Create room
        </Button>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        {isSaving ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Save className="h-3.5 w-3.5" />
        )}
        <span>
          {lastSavedAt
            ? `Saved ${new Date(lastSavedAt).toLocaleTimeString()}`
            : "Waiting for changes"}
        </span>
      </div>
      {message ? <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">{message}</p> : null}
    </aside>
  );
}
