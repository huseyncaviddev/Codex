import Link from 'next/link';

const filters = ['Discipline', 'Type', 'Status', 'Organization'];

export default function DocumentsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Document Register</h1>
          <p className="text-sm text-slate-500">Searchable, filterable register scoped per project.</p>
        </div>
        <Link href="#" className="rounded-md bg-blue-600 px-4 py-2 text-white shadow">Upload / New Document</Link>
      </div>
      <div className="flex gap-3 flex-wrap">
        {filters.map((filter) => (
          <button key={filter} className="rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1 text-sm">{filter}</button>
        ))}
      </div>
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="grid grid-cols-6 gap-2 px-4 py-3 text-xs uppercase tracking-wide text-slate-500">
          <span>Doc No</span>
          <span>Title</span>
          <span>Discipline</span>
          <span>Status</span>
          <span>Revision</span>
          <span>Actions</span>
        </div>
        <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-3 text-sm text-slate-600 dark:text-slate-200">
          Example entries load here via React Query.
        </div>
      </div>
    </main>
  );
}
