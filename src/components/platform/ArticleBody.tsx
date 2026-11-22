import { Fragment } from "react";

/**
 * Minimal, safe formatting for articles written in django-admin:
 * blank line = paragraph, "## " heading, "### " sub-heading, "- " list, **bold**.
 * Everything is rendered as React text (no HTML injection).
 */
function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i} className="font-bold text-[#0f172a]">{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>
  );
}

export default function ArticleBody({ body }: { body: string }) {
  const blocks = body.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="space-y-5 text-[17px] leading-9 text-[#334155]">
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter((l) => l.trim());
        const out: React.ReactNode[] = [];
        let list: string[] = [];
        const flush = () => {
          if (list.length) {
            out.push(
              <ul key={`l${out.length}`} className="list-disc pr-6 space-y-2 marker:text-[#7c3aed]">
                {list.map((li, j) => <li key={j}>{inline(li)}</li>)}
              </ul>
            );
            list = [];
          }
        };
        lines.forEach((line, j) => {
          const t = line.trim();
          if (t.startsWith("- ")) return void list.push(t.slice(2));
          flush();
          if (t.startsWith("### ")) out.push(<h3 key={j} className="text-xl font-bold text-[#0f172a] pt-2">{t.slice(4)}</h3>);
          else if (t.startsWith("## ")) out.push(<h2 key={j} className="text-2xl font-extrabold text-[#0f172a] pt-4">{t.slice(3)}</h2>);
          else out.push(<p key={j}>{inline(t)}</p>);
        });
        flush();
        return <Fragment key={i}>{out}</Fragment>;
      })}
    </div>
  );
}
