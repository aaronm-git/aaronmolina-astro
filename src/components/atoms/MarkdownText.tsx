import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { z } from 'zod';

interface MarkdownTextProps {
  /** Untrusted Markdown content returned by the portfolio chat. */
  children: string;
}

const HttpUrlSchema = z.url().refine(url => {
  const parsedUrl = new URL(url);
  return parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:';
}, 'Expected an HTTP(S) URL.');

const markdownComponents: Components = {
  a({ children, href }) {
    const parsedUrl = HttpUrlSchema.safeParse(href);
    if (!parsedUrl.success) return <span>{children}</span>;

    return (
      <a
        href={parsedUrl.data}
        target="_blank"
        rel="noreferrer"
        className="text-signal-deep decoration-ink underline decoration-2 underline-offset-2 hover:text-ink focus-visible:outline-signal focus-visible:outline-3 focus-visible:outline-offset-2"
      >
        {children}
      </a>
    );
  },
  p({ children }) {
    return <p className="mb-2 last:mb-0">{children}</p>;
  },
  strong({ children }) {
    return <strong className="font-bold">{children}</strong>;
  },
  em({ children }) {
    return <em className="italic">{children}</em>;
  },
  h1({ children }) {
    return <h3 className="mb-2 text-base font-black">{children}</h3>;
  },
  h2({ children }) {
    return <h3 className="mb-2 text-base font-bold">{children}</h3>;
  },
  h3({ children }) {
    return <h4 className="mb-1 text-sm font-bold">{children}</h4>;
  },
  ul({ children }) {
    return <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>;
  },
  li({ children }) {
    return <li>{children}</li>;
  },
  blockquote({ children }) {
    return <blockquote className="border-ink mb-2 border-l-2 pl-3 italic last:mb-0">{children}</blockquote>;
  },
  code({ children }) {
    return <code className="bg-concrete border-ink rounded-sm border px-1 font-mono text-[0.85em]">{children}</code>;
  },
  pre({ children }) {
    return <pre className="bg-concrete border-ink mb-2 overflow-x-auto rounded-sm border p-2 text-xs last:mb-0">{children}</pre>;
  },
  hr() {
    return <hr className="border-ink my-3 border-t" />;
  },
  table({ children }) {
    return <div className="mb-2 overflow-x-auto last:mb-0"><table className="border-ink w-full border-collapse border text-left text-xs">{children}</table></div>;
  },
  th({ children }) {
    return <th className="border-ink bg-concrete border px-2 py-1 font-bold">{children}</th>;
  },
  td({ children }) {
    return <td className="border-ink border px-2 py-1 align-top">{children}</td>;
  },
};

/** Renders a safe subset of GitHub-flavored Markdown without allowing raw HTML. */
export default function MarkdownText({ children }: MarkdownTextProps) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{children}</ReactMarkdown>;
}
