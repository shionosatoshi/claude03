"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { bodyParts } from "@/data/bodyParts";
import { storageKeys } from "@/lib/storageKeys";
import type { BodyPartId } from "@/types/check";

export default function BodyPartsPage() {
  const [selected, setSelected] = useState<BodyPartId[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKeys.bodyParts);
    if (stored) {
      setSelected(JSON.parse(stored) as BodyPartId[]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.bodyParts, JSON.stringify(selected));
  }, [selected]);

  const togglePart = (id: BodyPartId) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <PageShell
      eyebrow="Step 1"
      title="気になる部位を選んでください"
      description="複数選択できます。選んだ部位に合わせて、姿勢・足・筋力・生活環境に関する質問を表示します。"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {bodyParts.map((part) => {
          const active = selected.includes(part.id);
          return (
            <button
              key={part.id}
              type="button"
              onClick={() => togglePart(part.id)}
              className={`min-h-28 rounded-lg border p-5 text-left transition ${
                active
                  ? "border-leaf-500 bg-leaf-50 shadow-soft"
                  : "border-slate-200 bg-white hover:border-aqua-200 hover:bg-aqua-50"
              }`}
            >
              <span className="block text-lg font-bold text-ink">{part.label}</span>
              <span className="mt-2 block text-sm leading-6 text-slate-600">{part.hint}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">{selected.length}件選択中</p>
        <Link
          href="/check/questions"
          className="inline-flex items-center justify-center rounded-lg bg-leaf-700 px-6 py-4 font-bold text-white shadow-soft hover:bg-leaf-500"
        >
          質問へ進む
        </Link>
      </div>
    </PageShell>
  );
}
