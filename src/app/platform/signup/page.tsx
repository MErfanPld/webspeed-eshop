import type { Metadata } from "next";
import SignupForm from "@/components/platform/SignupForm";
import { platformConfig, type PlatformPlan } from "@/lib/platform";
import { serverApiOrNull } from "@/lib/api/server";

export const metadata: Metadata = { title: "ساخت فروشگاه" };
export const dynamic = "force-dynamic";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  const { suffix, panelUrl } = platformConfig();
  const plans = (await serverApiOrNull<{ plans: PlatformPlan[] }>("/platform/plans").catch(() => null))?.plans ?? [];
  return (
    <div className="mx-auto max-w-xl px-4 py-14">
      <h1 className="text-3xl font-extrabold text-center">ساخت فروشگاه</h1>
      <p className="text-center text-[#64748b] mt-2">کمتر از یک دقیقه طول می‌کشد.</p>
      <SignupForm plans={plans} initialPlan={plan} suffix={suffix} panelUrl={panelUrl} trialDays={Number(process.env.TRIAL_DAYS || 14)} />
    </div>
  );
}
