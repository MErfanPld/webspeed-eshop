import Link from "next/link";

/** Shared frame of the public admin pages (login, password recovery). */
export default function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center px-4 bg-[radial-gradient(40rem_25rem_at_80%_0%,#ede9fe,transparent),radial-gradient(30rem_20rem_at_0%_100%,#fce7f3,transparent)] bg-[#f8f7fc]"
      style={{ fontFamily: "Vazirmatn, Tahoma, system-ui, sans-serif" }}
      dir="rtl"
    >
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <div className="mx-auto h-11 w-11 rounded-xl bg-gradient-to-l from-[#7c3aed] to-[#db2777] text-white shadow-md shadow-[#7c3aed]/20 text-sm font-bold flex items-center justify-center mb-4">
            W
          </div>
          <h1 className="text-xl font-semibold text-[#111] tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-[#737373] mt-1.5 leading-6">{subtitle}</p>}
        </div>
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 sm:p-7 space-y-4 shadow-sm">{children}</div>
        <p className="text-center text-xs text-[#A3A3A3] mt-6">
          <Link href="/admin/login" className="hover:text-[#111] underline-offset-2 hover:underline">
            بازگشت به ورود
          </Link>
        </p>
      </div>
    </div>
  );
}
