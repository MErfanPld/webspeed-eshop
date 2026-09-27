import BuilderShell from "@/builder/components/BuilderShell";

type Props = {
  params: Promise<{ pageId: string }>;
};

export default async function AdminBuilderPage({ params }: Props) {
  const { pageId } = await params;
  return <BuilderShell pageId={pageId} />;
}
