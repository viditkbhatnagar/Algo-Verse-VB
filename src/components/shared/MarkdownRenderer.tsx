"use client";

import ReactMarkdown from "react-markdown";
import katex from "katex";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function processKaTeX(text: string): string {
  // Replace $$...$$ with block math
  let result = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, latex) => {
    try {
      return katex.renderToString(latex.trim(), {
        displayMode: true,
        throwOnError: false,
      });
    } catch {
      return `$$${latex}$$`;
    }
  });

  // Replace $...$ with inline math (not preceded by another $)
  result = result.replace(/(?<!\$)\$([^$\n]+?)\$(?!\$)/g, (_, latex) => {
    try {
      return katex.renderToString(latex.trim(), {
        displayMode: false,
        throwOnError: false,
      });
    } catch {
      return `$${latex}$`;
    }
  });

  return result;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const processed = processKaTeX(content);

  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          p: ({ children, ...props }) => (
            <p
              {...props}
              className="mb-3 text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={
                typeof children === "string" ? { __html: children } : undefined
              }
            >
              {typeof children !== "string" ? children : undefined}
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
        {processed}
      </ReactMarkdown>
    </div>
  );
}
