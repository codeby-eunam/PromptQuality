export default function SharePage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-panel px-4 py-8">
      <section className="mx-auto max-w-2xl rounded-lg border border-line bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-leaf">PromptQuality</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">공유 결과</h1>
        <p className="mt-4 text-sm leading-6 text-ink/65">
          공유 가능한 결과 페이지 구조입니다. MVP 이후에는 Supabase의
          share_links.slug와 score_results를 연결해 실제 결과를 렌더링합니다.
        </p>
        <div className="mt-5 rounded-md bg-panel p-4 text-sm text-ink/70">
          결과 ID: {params.id}
        </div>
      </section>
    </main>
  );
}
