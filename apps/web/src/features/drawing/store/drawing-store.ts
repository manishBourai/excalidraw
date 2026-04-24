import { create } from "zustand";

import type { DrawingTool, SyncStatus } from "../types/drawing";

type DrawingState = {
  activeTool: DrawingTool;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  roomId: string;
  token: string;
  username: string;
  syncStatus: SyncStatus;
  isSaving: boolean;
  lastSavedAt?: number;
  setActiveTool: (tool: DrawingTool) => void;
  setFillColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setRoomId: (roomId: string) => void;
  setToken: (token: string) => void;
  setUsername: (username: string) => void;
  setSyncStatus: (status: SyncStatus) => void;
  setSaving: (isSaving: boolean) => void;
  markSaved: () => void;
};

export const useDrawingStore = create<DrawingState>((set) => ({
  activeTool: "select",
  fillColor: "rgba(20, 184, 166, 0.18)",
  strokeColor: "#0f172a",
  strokeWidth: 3,
  roomId: "demo-room",
  token: "",
  username: "Designer",
  syncStatus: "idle",
  isSaving: false,
  setActiveTool: (activeTool) => set({ activeTool }),
  setFillColor: (fillColor) => set({ fillColor }),
  setStrokeColor: (strokeColor) => set({ strokeColor }),
  setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
  setRoomId: (roomId) => set({ roomId }),
  setToken: (token) => set({ token }),
  setUsername: (username) => set({ username }),
  setSyncStatus: (syncStatus) => set({ syncStatus }),
  setSaving: (isSaving) => set({ isSaving }),
  markSaved: () => set({ isSaving: false, lastSavedAt: Date.now() }),
}));
