"use client";

import { format } from "date-fns";
import { CalendarIcon, Loader2, Send } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const categories = [
  { value: "greeting", label: "អ៊ីមែលស្វាគមន៍" },
  { value: "meeting", label: "អ៊ីមែលប្រជុំ" },
  { value: "fyi", label: "អ៊ីមែលជូនដំណឹង" },
  { value: "confirmation", label: "អ៊ីមែលបញ្ជាក់" },
];

export function ChatUI() {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("greeting");
  const [info, setInfo] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const datetime = `${date ? format(date, "PPP") : ""} ${time}`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          subject,
          category,
          info,
          datetime,
          location,
        }),
      });

      const data = await res.json();

      setMessages([
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-3 py-6 text-white sm:px-6">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-slate-900/80 shadow-xl">
        {/* HEADER */}
        <div className="border-b border-white/10 px-5 py-5">
          <h1 className="text-lg font-semibold leading-9 tracking-tight sm:text-xl">
            ប្រព័ន្ធបង្កើតអ៊ីមែលជាភាសាខ្មែរ
          </h1>
          <p className="mt-1 text-sm leading-7 text-slate-400">
            បញ្ចូលព័ត៌មានសំខាន់ៗ ដើម្បីបង្កើតអ៊ីមែលពេញលេញ
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 p-4 sm:p-6">
          <input
            placeholder="ប្រធានបទ"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-4 text-[15px] leading-7 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-4 text-[15px] leading-7 text-white outline-none focus:border-violet-500"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full justify-start gap-3 rounded-xl border border-white/10 bg-slate-950 px-4 text-[15px] text-white hover:bg-slate-900 data-[state=open]:bg-slate-950"
              >
                <CalendarIcon className="size-4 text-violet-400" />
                {date ? format(date, "PPP") : "ជ្រើសរើសកាលបរិច្ឆេទ"}
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              sideOffset={6}
              className="w-auto rounded-xl border border-white/10 bg-slate-900 p-2 text-white shadow-xl"
            >
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="
                  text-sm
                  [&_.rdp-day]:h-8 [&_.rdp-day]:w-8
                  [&_.rdp-head_cell]:text-xs
                  [&_.rdp-caption]:text-sm
                "
              />
            </PopoverContent>
          </Popover>

          <input
            placeholder="ម៉ោង ឧ. 09:30 ព្រឹក"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-4 text-[15px] leading-7 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
          />

          <input
            placeholder="ទីតាំង"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-4 text-[15px] leading-7 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
          />

          <textarea
            placeholder="ព័ត៌មានសំខាន់ដែលចង់ដាក់ក្នុងអ៊ីមែល"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            required
            rows={4}
            className="min-h-32 w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-[15px] leading-8 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            បង្កើតអ៊ីមែល
          </button>
        </form>

        <div className="border-t border-white/10 p-4 sm:p-6">
          <h2 className="mb-3 text-sm font-semibold text-slate-300">
            លទ្ធផលអ៊ីមែល
          </h2>

          <div className="min-h-32 rounded-xl border border-white/10 bg-slate-950 p-4">
            {messages.length === 0 && (
              <p className="text-sm text-slate-500">
                លទ្ធផលនឹងបង្ហាញនៅទីនេះ...
              </p>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className="whitespace-pre-wrap text-[15px] leading-8 text-slate-200"
              >
                {m.content}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Loader2 className="size-4 animate-spin" />
                កំពុងបង្កើត...
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
