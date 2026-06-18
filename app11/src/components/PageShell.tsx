export function PageShell({
  eyebrow,
  title,
  description,
  children
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
      <div className="mb-8 max-w-3xl">
        {eyebrow ? <p className="mb-3 text-sm font-semibold text-aqua-700">{eyebrow}</p> : null}
        <h1 className="text-3xl font-bold leading-tight text-ink sm:text-4xl">{title}</h1>
        {description ? <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">{description}</p> : null}
      </div>
      {children}
    </main>
  );
}
