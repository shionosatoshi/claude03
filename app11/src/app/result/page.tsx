"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { NoticeBox } from "@/components/NoticeBox";
import { PageShell } from "@/components/PageShell";
import { questions } from "@/data/questions";
import { getTopResults } from "@/lib/calculateResult";
import { storageKeys } from "@/lib/storageKeys";

export default function ResultPage() {
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKeys.answers);
    if (stored) {
      setAnswers(JSON.parse(stored) as string[]);
    }
  }, []);

  const results = useMemo(() => getTopResults(answers, questions, 3), [answers]);
  const hasAnswers = answers.length > 0;

  return (
    <PageShell
      eyebrow="Result"
      title="原因候補マップ"
      description="回答からスコアが高かった上位3つのタイプです。断定ではなく、次に見直す場所を整理するための候補として確認してください。"
    >
      <div className="mb-6">
        <NoticeBox compact />
      </div>
      {!hasAnswers ? (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-ink">回答がまだありません</h2>
          <p className="mt-3 leading-7 text-slate-600">
            部位選択と質問回答を行うと、原因候補タイプと見直し候補が表示されます。
          </p>
          <Link
            href="/check/body-parts"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-leaf-700 px-6 py-4 font-bold text-white hover:bg-leaf-500"
          >
            セルフチェックを始める
          </Link>
        </section>
      ) : (
        <div className="grid gap-5">
          {results.map((result) => (
            <article key={result.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-aqua-700">候補 {result.rank}</p>
                  <h2 className="mt-1 text-2xl font-bold text-ink">{result.title}</h2>
                </div>
                <div className="w-fit rounded-full bg-leaf-50 px-4 py-2 text-sm font-bold text-leaf-700">
                  スコア {result.score}
                </div>
              </div>
              <p className="mt-4 leading-8 text-slate-700">{result.description}</p>
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <section className="rounded-lg bg-slate-50 p-4">
                  <h3 className="font-bold text-ink">見直し候補</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                    {result.reviewCandidates.map((item) => (
                      <li key={item}>・{item}</li>
                    ))}
                  </ul>
                </section>
                <section className="rounded-lg bg-aqua-50 p-4">
                  <h3 className="font-bold text-ink">セルフケア例</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                    {result.selfCareExamples.map((item) => (
                      <li key={item}>・{item}</li>
                    ))}
                  </ul>
                </section>
                <section className="rounded-lg bg-leaf-50 p-4">
                  <h3 className="font-bold text-ink">相談目安</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{result.consultationGuide}</p>
                </section>
              </div>
            </article>
          ))}
        </div>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/check/questions"
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-4 font-bold text-slate-700 hover:bg-slate-50"
        >
          回答を見直す
        </Link>
        <Link
          href="/check/body-parts"
          className="inline-flex items-center justify-center rounded-lg bg-aqua-700 px-6 py-4 font-bold text-white hover:bg-aqua-500"
        >
          最初から確認する
        </Link>
      </div>
    </PageShell>
  );
}
