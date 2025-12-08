import { Sidebar } from "./Sidebar";

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="lg:pl-64">
        <div className="px-4 py-6 lg:px-8 lg:py-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
