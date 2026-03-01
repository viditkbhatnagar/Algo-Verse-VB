"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children, ...props }) => (
            <p
              {...props}
              className="mb-3 text-muted-foreground leading-relaxed"
            >
              {children}
            </p>
          ),
          code: ({ children, className: codeClassName, ...props }) => {
            const isInline = !codeClassName;
            if (isInline) {
              return (
                <code
                  {...props}
                  className="rounded bg-surface px-1.5 py-0.5 text-xs font-mono text-accent"
                >
                  {children}
                </code>
              );
            }
            return (
              <code {...props} className={codeClassName}>
                {children}
              </code>
            );
          },
          strong: ({ children, ...props }) => (
            <strong {...props} className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          ul: ({ children, ...props }) => (
            <ul {...props} className="list-disc pl-5 mb-3 space-y-1 text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol {...props} className="list-decimal pl-5 mb-3 space-y-1 text-muted-foreground">
              {children}
            </ol>
          ),
          h3: ({ children, ...props }) => (
            <h3 {...props} className="text-sm font-semibold text-foreground mt-4 mb-2">
              {children}
            </h3>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
