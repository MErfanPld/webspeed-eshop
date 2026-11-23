import ContentEditor from "@/components/admin/platform/ContentEditor";
import { requirePlatformAdmin } from "@/lib/api/platform-admin";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  await requirePlatformAdmin();
  return <ContentEditor />;
}
