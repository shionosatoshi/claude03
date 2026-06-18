"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { questions } from "@/data/questions";
import { storageKeys } from "@/lib/storageKeys";
import type { BodyPartId } from "@/types/check";

export default function QuestionsPage() {
  const [bodyPartIds, setBodyPartIds] = useState<BodyPartId[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    const storedParts = window.localStorage.getItem(storageKeys.bodyParts);
    const storedAnswers = window.localStorage.getItem(storageKeys.answers);
    if (storedParts) {
      setBodyPartIds(JSON.parse(storedParts) as BodyPartId[]);
    }
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers) as string[]);
    }
  }, []);

  const visibleQuestions = useMemo(() => {
    if (bodyPartIds.length === 0) {
      return questions;
    }
    return questions.filter((question) => question.bodyParts.some((part) => bodyPartIds.includes(part)));
  }, [bodyPartIds]);

  useEffect(() => {
    const visibleIds = new Set(visibleQuestions.map((question) => question.id));
    setAnswers((current) => current.filter((answer) => visibleIds.has(answer)));
  }, [visibleQuestions]);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.answers, JSON.stringify(answers));
  }, [answers]);

  const toggleAnswer = (id: string) => {
    setAnswers((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <PageShell
      eyebrow="Step 2"
      title="あてはまる項目を選んでください"
      description="今の状態に近いものだけで大丈夫です。回答内容から、見直し候補のスコアを整理します。"
    >
      <div className="grid gap-3">
        {visibleQuestions.map((question) => {
          const checked = answers.includes(question.id);
          return (
            <label
              key={question.id}
              className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition ${
                checked ? "border-aqua-500 bg-aqua-50 shadow-soft" : "border-slate-200 bg-white hover:border-leaf-200"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleAnswer(question.id)}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-leaf-700 focus:ring-leaf-500"
              />
              <span className="text-base font-semibold leading-7 text-ink">{question.label}</span>
            </label>
          );
        })}
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/check/body-parts"
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-4 font-bold text-slate-700 hover:bg-slate-50"
        >
          部位を選び直す
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="text-sm text-slate-600">{answers.length}件選択中</p>
          <Link
            href="/result"
            className="inline-flex items-center justify-center rounded-lg bg-leaf-700 px-6 py-4 font-bold text-white shadow-soft hover:bg-leaf-500"
          >
            結果を見る
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
