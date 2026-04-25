import { httpRequest } from "./http-client";
import type { CanvasSnapshot, Room } from "../types/drawing";

type ApiResponse<T> = {
  message: string;
  data: T;
};

export function createRoom(roomId: string, token: string) {
  return httpRequest<ApiResponse<Room>>("/api/room", {
    method: "POST",
    token,
    body: JSON.stringify({ room: roomId }),
  });
}

export function getMyRooms(token: string) {
  return httpRequest<ApiResponse<Room[]>>("/api/room/my", {
    method: "GET",
    token,
  });
}

export function deleteRoom(roomId: string, token: string) {
  return httpRequest<ApiResponse<null>>(
    `/api/room/${encodeURIComponent(roomId)}`,
    {
      method: "DELETE",
      token,
    },
  );
}

export function saveCanvasSnapshot(
  roomId: string,
  snapshot: CanvasSnapshot,
  token: string,
) {
  return httpRequest<ApiResponse<CanvasSnapshot>>(
    `/api/room/${encodeURIComponent(roomId)}/canvas`,
    {
      method: "PUT",
      token,
      body: JSON.stringify({ snapshot }),
    },
  );
}

export function getCanvasSnapshot(roomId: string, token: string) {
  return httpRequest<ApiResponse<CanvasSnapshot | null>>(
    `/api/room/${encodeURIComponent(roomId)}/canvas`,
    {
      method: "GET",
      token,
    },
  );
}
