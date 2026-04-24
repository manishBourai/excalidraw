import { io, type Socket } from "socket.io-client";

import type { CanvasSyncMessage } from "../types/drawing";
import type { SyncStatus } from "../types/drawing";

const DEFAULT_WS_URL = "http://localhost:8080";

export const wsApiBaseUrl = process.env.NEXT_PUBLIC_WS_API_URL ?? DEFAULT_WS_URL;

type RealtimeClientOptions = {
  roomId: string;
  token: string;
  username: string;
  onSnapshot: (message: CanvasSyncMessage) => void;
  onStatusChange: (status: SyncStatus) => void;
};

export type RealtimeClient = {
  connect: () => void;
  sendSnapshot: (message: CanvasSyncMessage) => void;
  disconnect: () => void;
};

export function createRealtimeClient({
  roomId,
  token,
  username,
  onSnapshot,
  onStatusChange,
}: RealtimeClientOptions): RealtimeClient {
  let socket: Socket | null = null;

  return {
    connect() {
      if (!token || socket?.connected) {
        return;
      }

      onStatusChange("connecting");
      socket = io(wsApiBaseUrl, {
        transports: ["websocket"],
        query: { token, name: username },
      });

      socket.on("connect", () => {
        socket?.emit("joinRoom", roomId, () => {
          onStatusChange("connected");
        });
      });

      socket.on("connect_error", () => onStatusChange("offline"));
      socket.on("disconnect", () => onStatusChange("offline"));
      socket.on("chat", (rawMessage: string | CanvasSyncMessage) => {
        const message =
          typeof rawMessage === "string"
            ? (JSON.parse(rawMessage) as CanvasSyncMessage)
            : rawMessage;

        if (message.type === "canvas:snapshot") {
          onSnapshot(message);
        }
      });
    },

    sendSnapshot(message) {
      socket?.emit("chat", JSON.stringify(message), roomId);
    },

    disconnect() {
      socket?.emit("leave", roomId, () => undefined);
      socket?.disconnect();
      socket = null;
      onStatusChange("idle");
    },
  };
}
