"use client";

import { format } from "date-fns";
import { FormEvent, useState } from "react";

import { ChatForm } from "./chat-form";
import { ResultSection } from "./result-section";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function ChatUI() {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
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
        <div className="border-b border-white/10 px-5 py-5">
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
            ប្រព័ន្ធបង្កើតអ៊ីមែលជាភាសាខ្មែរ
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            បញ្ចូលព័ត៌មានសំខាន់ៗ ដើម្បីបង្កើតអ៊ីមែលពេញលេញ
          </p>
        </div>

        <ChatForm
          subject={subject}
          setSubject={setSubject}
          category={category}
          setCategory={setCategory}
          info={info}
          setInfo={setInfo}
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          location={location}
          setLocation={setLocation}
          loading={loading}
          onSubmit={onSubmit}
        />

        <ResultSection messages={messages} loading={loading} />
      </section>
    </main>
  );
}
