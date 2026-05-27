'use client'

import ReactMarkdown from 'react-markdown'

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none
      prose-headings:text-foreground prose-headings:font-semibold
      prose-p:text-muted-foreground prose-p:leading-relaxed
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-strong:text-foreground
      prose-code:text-primary prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
      prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:rounded-lg
      prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
      prose-hr:border-border
      prose-li:text-muted-foreground
      prose-table:text-sm prose-th:text-foreground prose-td:text-muted-foreground">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
