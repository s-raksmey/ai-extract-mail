"use client"

import { Bot, Loader2, MailSearch, Send, User } from "lucide-react"
import { FormEvent, useRef, useState } from "react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

const starterPrompts = [
  "Extract sender, subject, date, and action items from this email.",
  "Summarize this Gmail message in 3 bullet points.",
  "Turn this email into a polite reply.",
]

export function ChatUI() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! Paste an email or type a prompt. I can help extract, summarize, or prepare a reply.",
    },
  ])

  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  async function sendMessage(message: string) {
    const cleanMessage = message.trim()
    if (!cleanMessage || loading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: cleanMessage,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: cleanMessage }),
      })

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.message || "Sorry, I could not generate a response.",
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    sendMessage(input)
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-48px)] max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl backdrop-blur">
        <header className="border-b border-white/10 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300">
              <MailSearch className="size-6" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white sm:text-xl">
                AI Gmail Extractor
              </h1>
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-sm leading-6 text-slate-300 transition hover:border-violet-400/50 hover:bg-violet-500/10"
              >
                {prompt}
              </button>
            ))}
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
                  <Bot className="size-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-7 sm:max-w-[75%] ${
                  message.role === "user"
                    ? "bg-violet-600 text-white"
                    : "border border-white/10 bg-white/5 text-slate-200"
                }`}
              >
                {message.content}
              </div>

              {message.role === "user" && (
                <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-slate-200">
                  <User className="size-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Loader2 className="size-4 animate-spin" />
              AI is thinking...
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="border-t border-white/10 p-4 sm:p-5">
          <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Paste Gmail text or ask something..."
              rows={2}
              className="min-h-12 flex-1 resize-none bg-transparent text-sm leading-6 text-white outline-none placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
