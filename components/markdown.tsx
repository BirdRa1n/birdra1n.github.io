// components/markdown.tsx — renderização de Markdown sanitizada que segue o tema.
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import rehypeSanitize from "rehype-sanitize";

const MDPreview = dynamic(() => import("@uiw/react-md-editor").then((m) => m.default.Markdown), {
  ssr: false,
  loading: () => (
    <div className="space-y-3">
      <div className="ui-skeleton h-4 w-full" />
      <div className="ui-skeleton h-4 w-11/12" />
      <div className="ui-skeleton h-4 w-4/5" />
    </div>
  ),
});

/** Remove um `# Título` inicial — a página já exibe o título no cabeçalho. */
function stripLeadingH1(source: string) {
  return source.replace(/^\s*#\s+[^\n]*\n+/, "");
}

export function Markdown({ source, stripTitle = true }: { source: string; stripTitle?: boolean }) {
  const { resolvedTheme } = useTheme();

  return (
    <div className="prose-site" data-color-mode={resolvedTheme === "light" ? "light" : "dark"}>
      <MDPreview rehypePlugins={[rehypeSanitize]} source={stripTitle ? stripLeadingH1(source) : source} />
    </div>
  );
}
