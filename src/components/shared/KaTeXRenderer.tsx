"use client";

import katex from "katex";

interface KaTeXRendererProps {
  content: string;
  className?: string;
}

function renderLatex(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
    });
  } catch {
    return latex;
  }
}

export function KaTeXRenderer({ content, className }: KaTeXRendererProps) {
  // Split content into text and math segments
  const segments: { type: "text" | "block" | "inline"; value: string }[] = [];
  let remaining = content;

  while (remaining.length > 0) {
    // Check for block math $$...$$
    const blockMatch = remaining.match(/^\$\$([\s\S]+?)\$\$/);
    if (blockMatch && remaining.indexOf(blockMatch[0]) === 0) {
      segments.push({ type: "block", value: blockMatch[1] });
      remaining = remaining.slice(blockMatch[0].length);
      continue;
    }

    // Check for inline math $...$
    const inlineMatch = remaining.match(/^\$([^$\n]+?)\$/);
    if (inlineMatch && remaining.indexOf(inlineMatch[0]) === 0) {
      segments.push({ type: "inline", value: inlineMatch[1] });
      remaining = remaining.slice(inlineMatch[0].length);
      continue;
    }

    // Find next math delimiter
    const nextBlock = remaining.indexOf("$$");
    const nextInline = remaining.indexOf("$");
    let nextMath = -1;

    if (nextBlock !== -1 && (nextInline === -1 || nextBlock <= nextInline)) {
      nextMath = nextBlock;
    } else if (nextInline !== -1) {
      nextMath = nextInline;
    }

    if (nextMath === -1) {
      segments.push({ type: "text", value: remaining });
      remaining = "";
    } else if (nextMath === 0) {
      // $ found at start but didn't match — treat as text
      segments.push({ type: "text", value: remaining[0] });
      remaining = remaining.slice(1);
    } else {
      segments.push({ type: "text", value: remaining.slice(0, nextMath) });
      remaining = remaining.slice(nextMath);
    }
  }

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.type === "text") {
          return <span key={i}>{seg.value}</span>;
        }
        return (
          <span
            key={i}
            dangerouslySetInnerHTML={{
              __html: renderLatex(seg.value, seg.type === "block"),
            }}
          />
        );
      })}
    </span>
  );
}
