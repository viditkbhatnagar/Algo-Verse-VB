"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  implementations: {
    python: string;
    javascript: string;
  };
}

export function CodeBlock({ implementations }: CodeBlockProps) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copyCode(code: string, lang: string) {
    await navigator.clipboard.writeText(code);
    setCopied(lang);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-3">Implementation</h3>
      <Tabs defaultValue="python" className="w-full">
        <TabsList className="bg-background border border-border">
          <TabsTrigger value="python">Python</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
        </TabsList>

        {(["python", "javascript"] as const).map((lang) => (
          <TabsContent key={lang} value={lang} className="relative mt-3">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => copyCode(implementations[lang], lang)}
            >
              {copied === lang ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <div className="overflow-x-auto">
              <SyntaxHighlighter
                language={lang}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  backgroundColor: "#1a1a2e",
                  fontSize: "13px",
                }}
                showLineNumbers
              >
                {implementations[lang].trim()}
              </SyntaxHighlighter>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
