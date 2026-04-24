"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createRealtimeClient, type RealtimeClient } from "../lib/realtime-client";
import { getCanvasSnapshot, saveCanvasSnapshot } from "../lib/rooms-api";
import { useDrawingStore } from "../store/drawing-store";
import type { CanvasSnapshot } from "../types/drawing";
import type { DrawingCanvasController } from "../lib/canvas-controller";

const SYNC_DEBOUNCE_MS = 250;
const SAVE_DEBOUNCE_MS = 1200;

export function useFabricCanvas() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controllerRef = useRef<DrawingCanvasController | null>(null);
  const realtimeRef = useRef<RealtimeClient | null>(null);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roomIdRef = useRef("demo-room");
  const persistSnapshotRef = useRef<(snapshot: CanvasSnapshot) => void>(
    () => undefined,
  );
  const clientId = useMemo(() => crypto.randomUUID(), []);
  const [ready, setReady] = useState(false);

  const activeTool = useDrawingStore((state) => state.activeTool);
  const fillColor = useDrawingStore((state) => state.fillColor);
  const strokeColor = useDrawingStore((state) => state.strokeColor);
  const strokeWidth = useDrawingStore((state) => state.strokeWidth);
  const roomId = useDrawingStore((state) => state.roomId);
  const token = useDrawingStore((state) => state.token);
  const username = useDrawingStore((state) => state.username);
  const setSyncStatus = useDrawingStore((state) => state.setSyncStatus);
  const setSaving = useDrawingStore((state) => state.setSaving);
  const markSaved = useDrawingStore((state) => state.markSaved);

  const persistSnapshot = useCallback(
    async (snapshot: CanvasSnapshot) => {
      if (!token) {
        return;
      }

      setSaving(true);
      try {
        await saveCanvasSnapshot(roomId, snapshot, token);
        markSaved();
      } catch {
        setSaving(false);
      }
    },
    [markSaved, roomId, setSaving, token],
  );

  useEffect(() => {
    roomIdRef.current = roomId;
    persistSnapshotRef.current = (snapshot) => {
      void persistSnapshot(snapshot);
    };
  }, [persistSnapshot, roomId]);

  const handleCanvasChange = useCallback(
    (snapshot: CanvasSnapshot) => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }

      syncTimerRef.current = setTimeout(() => {
        realtimeRef.current?.sendSnapshot({
          type: "canvas:snapshot",
          roomId: roomIdRef.current,
          clientId,
          snapshot,
          sentAt: Date.now(),
        });
      }, SYNC_DEBOUNCE_MS);

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        persistSnapshotRef.current(snapshot);
      }, SAVE_DEBOUNCE_MS);
    },
    [clientId],
  );

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const wrapperElement = wrapperRef.current;
    let isCancelled = false;

    if (!canvasElement || !wrapperElement || controllerRef.current) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }
      controllerRef.current?.setDimensions(
        entry.contentRect.width,
        entry.contentRect.height,
      );
    });
    observer.observe(wrapperElement);

    void import("../lib/canvas-controller").then(
      ({ DrawingCanvasController }) => {
        if (isCancelled) {
          return;
        }

        const { width, height } = wrapperElement.getBoundingClientRect();
        controllerRef.current = new DrawingCanvasController({
          canvasElement,
          width,
          height,
          onChange: handleCanvasChange,
        });
        setReady(true);
      },
    );

    return () => {
      isCancelled = true;
      observer.disconnect();
      controllerRef.current?.dispose();
      controllerRef.current = null;
    };
  }, [handleCanvasChange]);

  useEffect(() => {
    controllerRef.current?.setTool(activeTool);
  }, [activeTool, ready]);

  useEffect(() => {
    controllerRef.current?.setStyle({ fillColor, strokeColor, strokeWidth });
  }, [fillColor, ready, strokeColor, strokeWidth]);

  useEffect(() => {
    realtimeRef.current?.disconnect();

    if (!token) {
      setSyncStatus("idle");
      return;
    }

    realtimeRef.current = createRealtimeClient({
      roomId,
      token,
      username,
      onStatusChange: setSyncStatus,
      onSnapshot: (message) => {
        if (message.clientId === clientId) {
          return;
        }
        void controllerRef.current?.loadSnapshot(message.snapshot);
      },
    });
    realtimeRef.current.connect();

    void getCanvasSnapshot(roomId, token)
      .then((response) => {
        if (response.data) {
          void controllerRef.current?.loadSnapshot(response.data);
        }
      })
      .catch(() => undefined);

    return () => {
      realtimeRef.current?.disconnect();
      realtimeRef.current = null;
    };
  }, [clientId, roomId, setSyncStatus, token, username]);

  useEffect(() => {
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const deleteSelection = useCallback(() => {
    controllerRef.current?.deleteSelection();
  }, []);

  return {
    wrapperRef,
    canvasRef,
    deleteSelection,
  };
}
