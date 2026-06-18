import Image from "next/image";
import Link from "next/link";
import { NoticeBox } from "@/components/NoticeBox";
import { resultTypes } from "@/data/resultTypes";

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/20" />
        <Image
          src="/images/hero-karada-map.png"
          alt="姿勢、足、デスク環境、生活習慣のつながりをタブレットで確認する人"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="relative mx-auto flex min-h-[680px] max-w-5xl items-center px-5 py-12 sm:min-h-[720px]">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold text-aqua-700">セルフチェック MVP</p>
            <h1 className="text-4xl font-bold leading-tight text-ink sm:text-6xl">からだ原因マップ</h1>
            <p className="mt-5 max-w-xl text-lg leading-9 text-slate-600">
              腰痛・肩こり・首こり・猫背・足の疲れなどについて、痛い場所だけでなく、足・姿勢・筋力・生活環境のつながりから見直し候補を整理します。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/check/body-parts"
                className="inline-flex items-center justify-center rounded-lg bg-leaf-700 px-6 py-4 text-base font-bold text-white shadow-soft transition hover:bg-leaf-500"
              >
                セルフチェックを始める
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-4 text-base font-bold text-slate-700 transition hover:border-aqua-200 hover:bg-aqua-50"
              >
                サービスについて
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-skysoft/70">
        <div className="mx-auto grid max-w-5xl gap-4 px-5 py-10 sm:grid-cols-3">
          {["気になる部位を選ぶ", "生活や姿勢の質問に答える", "原因候補マップを見る"].map((item, index) => (
            <div key={item} className="rounded-lg border border-white bg-white/85 px-5 py-5 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-aqua-100 text-sm font-bold text-aqua-700">
                {index + 1}
              </span>
              <h2 className="mt-4 text-lg font-bold text-ink">{item}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {index === 0
                  ? "首、肩、腰、足裏など、今気になっている場所を複数選べます。"
                  : index === 1
                    ? "足・姿勢・筋力・生活環境に関する質問から、状態を整理します。"
                    : "スコア上位のタイプを、改善のヒントと一緒に表示します。"}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-6 max-w-2xl">
          <p className="text-sm font-semibold text-leaf-700">7つの原因候補タイプ</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">痛い場所だけで見ないための整理軸</h2>
          <p className="mt-3 leading-8 text-slate-600">
            体の違和感は、足元、デスク環境、運動フォーム、生活習慣などが重なっている可能性があります。結果では上位3つの見直し候補を表示します。
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {resultTypes.map((type) => (
            <div key={type.id} className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-ink">{type.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{type.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-5 pb-10">
        <NoticeBox />
      </section>
    </main>
  );
}
