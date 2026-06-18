import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "からだ原因マップ",
  description: "身体の違和感について、見直し候補を整理するセルフチェックサービス"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="min-h-screen font-sans antialiased">
        <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
            <Link href="/" className="text-base font-bold text-ink sm:text-lg">
              からだ原因マップ
            </Link>
            <nav className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <Link href="/check/body-parts" className="rounded-full px-3 py-2 hover:bg-aqua-50 hover:text-aqua-700">
                チェック
              </Link>
              <Link href="/about" className="rounded-full px-3 py-2 hover:bg-leaf-50 hover:text-leaf-700">
                About
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
