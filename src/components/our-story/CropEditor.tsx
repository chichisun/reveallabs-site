"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "our-story-crops";

type CropMap = Record<string, { x: number; y: number }>;

function loadCrops(): CropMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCrops(crops: CropMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(crops));
  } catch {
    /* ignore */
  }
}

function applyCrops(crops: CropMap) {
  const imgs = document.querySelectorAll<HTMLImageElement>(
    ".story-beat .story-beat-photo img",
  );
  imgs.forEach((img) => {
    const beatEl = img.closest<HTMLElement>(".story-beat");
    const idx = beatEl?.dataset.beat ?? "";
    const crop = crops[idx];
    if (crop) {
      img.style.objectPosition = `${crop.x}% ${crop.y}%`;
    }
  });
}

export function CropEditor() {
  const [active, setActive] = useState(false);
  const [crops, setCrops] = useState<CropMap>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [hint, setHint] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("crop") !== "1") return;
    setActive(true);
    setCrops(loadCrops());
  }, []);

  useEffect(() => {
    if (!active) return;
    applyCrops(crops);
  }, [active, crops]);

  useEffect(() => {
    if (!active) return;

    const beats = document.querySelectorAll<HTMLElement>(".story-beat");
    const disposers: Array<() => void> = [];

    beats.forEach((beat) => {
      const idx = beat.dataset.beat ?? "";
      const photoEl = beat.querySelector<HTMLElement>(".story-beat-photo");
      const img = photoEl?.querySelector<HTMLImageElement>("img");
      if (!photoEl || !img) return;

      // Ensure the card can be dragged on (disable any parallax transition
      // that would fight us while dragging).
      photoEl.style.cursor = "grab";

      let startX = 0;
      let startY = 0;
      let startPx = 50;
      let startPy = 50;
      let pointerId: number | null = null;

      const onDown = (e: PointerEvent) => {
        const current = loadCrops();
        const seed = current[idx] ?? { x: 50, y: 50 };
        startX = e.clientX;
        startY = e.clientY;
        startPx = seed.x;
        startPy = seed.y;
        pointerId = e.pointerId;
        photoEl.setPointerCapture(e.pointerId);
        photoEl.style.cursor = "grabbing";
        setDragging(idx);
      };

      const onMove = (e: PointerEvent) => {
        if (pointerId === null) return;
        const rect = photoEl.getBoundingClientRect();
        // Invert direction: dragging the image up reveals the bottom
        // (object-position Y increases).
        const dxPct = ((startX - e.clientX) / rect.width) * 100;
        const dyPct = ((startY - e.clientY) / rect.height) * 100;
        const newX = Math.max(0, Math.min(100, startPx + dxPct));
        const newY = Math.max(0, Math.min(100, startPy + dyPct));
        img.style.objectPosition = `${newX}% ${newY}%`;
        const next = { ...loadCrops(), [idx]: { x: newX, y: newY } };
        saveCrops(next);
        setCrops(next);
      };

      const onUp = () => {
        if (pointerId !== null) {
          photoEl.releasePointerCapture(pointerId);
          pointerId = null;
        }
        photoEl.style.cursor = "grab";
        setDragging(null);
      };

      photoEl.addEventListener("pointerdown", onDown);
      photoEl.addEventListener("pointermove", onMove);
      photoEl.addEventListener("pointerup", onUp);
      photoEl.addEventListener("pointercancel", onUp);
      disposers.push(() => {
        photoEl.style.cursor = "";
        photoEl.removeEventListener("pointerdown", onDown);
        photoEl.removeEventListener("pointermove", onMove);
        photoEl.removeEventListener("pointerup", onUp);
        photoEl.removeEventListener("pointercancel", onUp);
      });
    });

    return () => disposers.forEach((d) => d());
  }, [active]);

  if (!active) return null;

  const entries = Object.entries(crops).sort(([a], [b]) => Number(a) - Number(b));
  const yearByIndex: Record<string, string> = {
    "0": "1970",
    "1": "1998",
    "2": "2011",
    "3": "2014",
    "4": "2026",
  };

  const copyCss = async () => {
    const rules = entries
      .map(([idx, { x, y }]) => {
        const year = yearByIndex[idx] ?? idx;
        return `/* ${year} */\n.story-beat[data-beat="${idx}"] .story-beat-photo img {\n  object-position: ${x.toFixed(1)}% ${y.toFixed(1)}%;\n}`;
      })
      .join("\n");
    try {
      await navigator.clipboard.writeText(rules);
      setHint("copied");
      setTimeout(() => setHint(""), 1500);
    } catch {
      setHint("copy failed");
    }
  };

  const reset = () => {
    saveCrops({});
    setCrops({});
    document
      .querySelectorAll<HTMLImageElement>(".story-beat .story-beat-photo img")
      .forEach((img) => {
        img.style.objectPosition = "";
      });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 92,
        right: 16,
        zIndex: 100,
        background: "rgba(28, 27, 23, 0.92)",
        color: "#F2F1ED",
        padding: "14px 16px",
        borderRadius: 10,
        fontFamily: "var(--font-space-mono), monospace",
        fontSize: 11,
        lineHeight: 1.55,
        minWidth: 220,
        boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.6 }}>
        Crop editor {dragging != null && `· beat ${dragging}`}
      </div>
      <div style={{ marginBottom: 10, opacity: 0.75 }}>
        Drag any photo to reposition.
      </div>
      {["0", "1", "2", "3", "4"].map((idx) => {
        const c = crops[idx];
        const y = yearByIndex[idx];
        return (
          <div key={idx} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span style={{ opacity: 0.6 }}>{y}</span>
            <span>
              {c ? `${c.x.toFixed(0)}%  ${c.y.toFixed(0)}%` : "—"}
            </span>
          </div>
        );
      })}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          type="button"
          onClick={copyCss}
          style={{
            flex: 1,
            background: "#F2F1ED",
            color: "#1C1B17",
            border: "none",
            padding: "8px 10px",
            borderRadius: 6,
            fontFamily: "inherit",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {hint || "Copy CSS"}
        </button>
        <button
          type="button"
          onClick={reset}
          style={{
            background: "transparent",
            color: "#F2F1ED",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "8px 10px",
            borderRadius: 6,
            fontFamily: "inherit",
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
