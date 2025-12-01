export default function WorkflowsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8 space-y-4">
      <h1 className="text-2xl font-semibold">Workflows</h1>
      <p className="text-sm text-slate-500">Monitor review/approval steps, due dates, and decisions.</p>
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <p className="text-slate-600 dark:text-slate-200">Stepper visualizations and audit info will render here.</p>
      </div>
    </main>
  );
}
