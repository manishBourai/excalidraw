export type DrawingTool = "select" | "rectangle" | "circle" | "free-draw";

export type SyncStatus = "idle" | "connecting" | "connected" | "offline";

export type CanvasSnapshot = {
  version: string;
  objects: unknown[];
};

export type CanvasSyncMessage = {
  type: "canvas:snapshot";
  roomId: string;
  clientId: string;
  snapshot: CanvasSnapshot;
  sentAt: number;
};

export type Room = {
  id: string;
  roomId: string;
  adminId: string;
  createdAt: string;
  _count?: {
    messages: number;
  };
};
