import Link from 'next/link';

const sections = [
  { href: '/documents', title: 'Document Register', description: 'Browse project documents with filters and statuses.' },
  { href: '/transmittals', title: 'Transmittals', description: 'Track outgoing/incoming communications and attachments.' },
  { href: '/workflows', title: 'Workflows', description: 'Monitor review and approval workflows with per-step status.' },
  { href: '/admin', title: 'Admin', description: 'Manage organizations, users, and project roles.' },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-500">EDMS Overview</p>
        <h1 className="text-3xl font-semibold mt-2">Engineering Document Management Workspace</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          Multi-organization collaboration hub for construction projects, with secure registers, transmittals, and workflows.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:border-blue-400">
            <h2 className="text-xl font-medium mb-1">{section.title}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">{section.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
