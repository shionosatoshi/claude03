export function NoticeBox({ compact = false }: { compact?: boolean }) {
  return (
    <section className="rounded-lg border border-aqua-100 bg-aqua-50 px-5 py-4 text-sm leading-7 text-slate-700">
      <p className={compact ? "font-medium" : "font-semibold text-ink"}>
        このサービスは医療診断・治療を目的としたものではありません。
      </p>
      <p className={compact ? "mt-2" : "mt-3"}>
        強い痛み、しびれ、麻痺、発熱、外傷後の痛み、排尿・排便障害、急激な悪化がある場合は、医療機関に相談してください。
      </p>
    </section>
  );
}
