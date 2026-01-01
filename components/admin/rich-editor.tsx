"use client"

import { useState } from "react"

interface RichEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function RichEditor({ value, onChange }: RichEditorProps) {
  const [showPreview, setShowPreview] = useState(false)

  const insertMarkdown = (before: string, after = "") => {
    const textarea = document.querySelector("textarea[data-editor]") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newValue)

    // Restore cursor position
    setTimeout(() => {
      textarea.selectionStart = start + before.length
      textarea.selectionEnd = start + before.length + selectedText.length
      textarea.focus()
    }, 0)
  }

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-t-lg border-b">
        <button
          type="button"
          onClick={() => insertMarkdown("# ")}
          className="px-3 py-1 text-sm bg-background hover:bg-muted-foreground/10 rounded"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown("## ")}
          className="px-3 py-1 text-sm bg-background hover:bg-muted-foreground/10 rounded"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown("**", "**")}
          className="px-3 py-1 text-sm bg-background hover:bg-muted-foreground/10 rounded font-bold"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown("_", "_")}
          className="px-3 py-1 text-sm bg-background hover:bg-muted-foreground/10 rounded italic"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown("[", "](url)")}
          className="px-3 py-1 text-sm bg-background hover:bg-muted-foreground/10 rounded"
          title="Link"
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown("- ")}
          className="px-3 py-1 text-sm bg-background hover:bg-muted-foreground/10 rounded"
          title="List"
        >
          List
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown("```\n", "\n```")}
          className="px-3 py-1 text-sm bg-background hover:bg-muted-foreground/10 rounded font-mono"
          title="Code"
        >
          Code
        </button>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="ml-auto px-3 py-1 text-sm bg-background hover:bg-muted-foreground/10 rounded"
        >
          {showPreview ? "Edit" : "Preview"}
        </button>
      </div>

      {/* Editor/Preview */}
      {!showPreview ? (
        <textarea
          data-editor
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your blog post in Markdown..."
          rows={15}
          className="w-full p-4 border rounded-b-lg font-mono text-sm"
          required
        />
      ) : (
        <div className="w-full p-4 border rounded-b-lg prose prose-sm dark:prose-invert max-w-none min-h-96 bg-background">
          <MarkdownPreview content={value} />
        </div>
      )}
    </div>
  )
}

function MarkdownPreview({ content }: { content: string }) {
  // Simple markdown to HTML conversion
  const html = content
    .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2">$1</a>')
    .replace(/^- (.*?)$/gm, "<li>$1</li>")
    .replace(/(<li>.*?<\/li>)/s, "<ul>$1</ul>")
    .replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>")

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
