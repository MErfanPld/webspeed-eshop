import PasswordForm from "@/components/admin/team/PasswordForm";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import { getAdminSession } from "@/lib/api/admin";

export const dynamic = "force-dynamic";

export default async function AdminAccountPage() {
  const session = await getAdminSession();
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <AdminPageHeader title="حساب کاربری" description={session?.user.email} />
      <PasswordForm />
    </div>
  );
}
