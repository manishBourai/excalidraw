"use client";

import { useDrawingStore } from "../store/drawing-store";

const strokeColors = ["#0f172a", "#dc2626", "#2563eb", "#059669", "#a16207"];
const fillColors = [
  "rgba(20, 184, 166, 0.18)",
  "rgba(220, 38, 38, 0.16)",
  "rgba(37, 99, 235, 0.16)",
  "rgba(245, 158, 11, 0.2)",
  "rgba(255, 255, 255, 0)",
];

export function StylePanel() {
  const fillColor = useDrawingStore((state) => state.fillColor);
  const strokeColor = useDrawingStore((state) => state.strokeColor);
  const strokeWidth = useDrawingStore((state) => state.strokeWidth);
  const setFillColor = useDrawingStore((state) => state.setFillColor);
  const setStrokeColor = useDrawingStore((state) => state.setStrokeColor);
  const setStrokeWidth = useDrawingStore((state) => state.setStrokeWidth);

  return (
    <aside className="w-full rounded-md border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:w-72">
      <div className="space-y-5">
        <section>
          <h2 className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">Stroke</h2>
          <div className="mt-3 flex gap-2">
            {strokeColors.map((color) => (
              <button
                aria-label={`Stroke ${color}`}
                className="h-8 w-8 rounded-full border border-neutral-200 ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:border-neutral-700 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-50"
                key={color}
                onClick={() => setStrokeColor(color)}
                style={{
                  backgroundColor: color,
                  boxShadow:
                    color === strokeColor ? "0 0 0 2px #0f172a" : undefined,
                }}
                type="button"
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">Fill</h2>
          <div className="mt-3 flex gap-2">
            {fillColors.map((color) => (
              <button
                aria-label={`Fill ${color}`}
                className="h-8 w-8 rounded-full border border-neutral-200 ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:border-neutral-700 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-50"
                key={color}
                onClick={() => setFillColor(color)}
                style={{
                  background: color.includes("255, 255, 255")
                    ? "linear-gradient(135deg, #fff 0 45%, #ef4444 45% 55%, #fff 55%)"
                    : color,
                  boxShadow:
                    color === fillColor ? "0 0 0 2px #0f172a" : undefined,
                }}
                type="button"
              />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">Width</h2>
            <span className="tabular-nums text-sm text-neutral-500 dark:text-neutral-400">
              {strokeWidth}px
            </span>
          </div>
          <input
            className="mt-3 w-full accent-teal-600"
            max={12}
            min={1}
            onChange={(event) => setStrokeWidth(Number(event.target.value))}
            type="range"
            value={strokeWidth}
          />
        </section>
      </div>
    </aside>
  );
}
