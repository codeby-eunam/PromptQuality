import { headers } from "next/headers";
import { messages, normalizeLocale } from "@/lib/i18n";

export default function SharePage({ params }: { params: { id: string } }) {
  const acceptLanguage = headers().get("accept-language");
  const t = messages[normalizeLocale(acceptLanguage)];

  return (
    <main className="min-h-screen bg-panel px-4 py-8">
      <section className="mx-auto max-w-2xl rounded-lg border border-line bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-leaf">{t.appName}</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">
          {t.shareTitle}
        </h1>
        <p className="mt-4 text-sm leading-6 text-ink/65">
          {t.shareDescription}
        </p>
        <div className="mt-5 rounded-md bg-panel p-4 text-sm text-ink/70">
          {t.resultId}: {params.id}
        </div>
      </section>
    </main>
  );
}
