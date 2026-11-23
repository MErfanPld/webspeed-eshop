import ArticlesManager from "@/components/admin/platform/ArticlesManager";
import { adminApi } from "@/lib/api/admin";
import { requirePlatformAdmin } from "@/lib/api/platform-admin";
import type { AdminArticle } from "@/components/admin/platform/ArticlesManager";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  await requirePlatformAdmin();
  const { articles } = await adminApi<{ articles: AdminArticle[] }>("/platform/admin/articles");
  return <ArticlesManager articles={articles} />;
}
