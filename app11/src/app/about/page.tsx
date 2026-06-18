import { NoticeBox } from "@/components/NoticeBox";
import { PageShell } from "@/components/PageShell";

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="からだ原因マップについて"
      description="身体の違和感を、痛い場所だけでなく、足・姿勢・筋力・生活環境のつながりから整理するセルフチェックサービスです。"
    >
      <div className="grid gap-5">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-ink">できること</h2>
          <p className="mt-3 leading-8 text-slate-700">
            気になる部位と日常の状態を選ぶことで、7つの原因候補タイプから見直し候補を表示します。結果は身体の状態を決めつけるものではなく、セルフケアや環境調整を考えるためのヒントです。
          </p>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-ink">大切な注意事項</h2>
          <p className="mt-3 leading-8 text-slate-700">
            このサービスは医療上の判断を行うものではありません。痛みや不調が強い場合、長く続く場合、日常生活に支障がある場合は、医療機関や専門家への相談も検討してください。
          </p>
        </section>
        <NoticeBox />
      </div>
    </PageShell>
  );
}
