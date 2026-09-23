import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06150f] px-6 text-center text-white">
      <div className="max-w-xl">
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-emerald-300/80">
          404
        </p>
        <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-6xl">
          This page is not available.
        </h1>
        <p className="mb-8 text-base text-white/70 md:text-lg">
          The jewelry collection is still here — return to the home page to
          continue browsing.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-400/10 px-6 py-3 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/20"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
