"use client";

import { format } from "date-fns";
import { CalendarIcon, Clock3, Loader2, Send } from "lucide-react";
import { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

// Email categories shown in the dropdown field.
const categories = [
  { value: "greeting", label: "ស្វាគមន៍" },
  { value: "meeting", label: "ប្រជុំ" },
  { value: "fyi", label: "ជូនដំណឹង" },
  { value: "confirmation", label: "បញ្ជាក់" },
];

// Props passed from ChatUI to control all form fields.
interface ChatFormProps {
  subject: string;
  setSubject: (value: string) => void;

  category: string;
  setCategory: (value: string) => void;

  info: string;
  setInfo: (value: string) => void;

  date: Date | undefined;
  setDate: (date: Date | undefined) => void;

  time: string;
  setTime: (value: string) => void;

  location: string;
  setLocation: (value: string) => void;

  loading: boolean;

  onSubmit: (e: FormEvent) => void;
}

// ChatForm displays inputs for all email details and submits them to ChatUI.
export function ChatForm({
  subject,
  setSubject,
  category,
  setCategory,
  info,
  setInfo,
  date,
  setDate,
  time,
  setTime,
  location,
  setLocation,
  loading,
  onSubmit,
}: ChatFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-3 p-4 sm:p-6">
      {/* Subject input stores the email title/topic. */}
      <input
        placeholder="ប្រធានបទ"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
        className="h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-4 text-[15px] text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
      />

      {/* Category dropdown lets users choose the type of email. */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className={`h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-4 text-[15px] outline-none focus:border-violet-500 ${
          category ? "text-white" : "text-slate-500"
        }`}
      >
        <option value="" disabled hidden>
          ប្រភេទអ៊ីមែល
        </option>

        {categories.map((c) => (
          <option key={c.value} value={c.value} className="text-white">
            {c.label}
          </option>
        ))}
      </select>

      {/* Date picker stores the optional email date. */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full justify-start gap-3 rounded-xl border border-white/10 bg-slate-950 px-4 text-white hover:bg-slate-900"
          >
            <CalendarIcon className="size-4 text-violet-400" />

            {date ? format(date, "PPP") : "ជ្រើសរើសកាលបរិច្ឆេទ"}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-auto rounded-xl border border-white/10 bg-slate-900 p-2 text-white"
        >
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>

      {/* Time picker lets users choose hour, minute, and AM/PM. */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full justify-start gap-3 rounded-xl border border-white/10 bg-slate-950 px-4 text-white hover:bg-slate-900"
          >
            <Clock3 className="size-4 text-violet-400" />

            {time || "ជ្រើសរើសម៉ោង"}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-65 rounded-xl border border-white/10 bg-slate-900 p-3 text-white"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-2 text-xs text-slate-400">Hour</p>

              <ScrollArea className="h-56 rounded-lg border border-white/10 bg-slate-950">
                <div className="space-y-1 p-2">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => {
                    // Keep the selected minute and period while changing only the hour.
                    const currentMinute =
                      time.split(":")[1]?.split(" ")[0] || "00";

                    const period = time.includes("PM") ? "PM" : "AM";

                    const value = `${String(hour).padStart(
                      2,
                      "0",
                    )}:${currentMinute} ${period}`;

                    return (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => setTime(value)}
                        className={`w-full rounded-md px-3 py-2 text-sm ${
                          time.startsWith(String(hour).padStart(2, "0"))
                            ? "bg-violet-600 text-white"
                            : "text-slate-300 hover:bg-violet-500/20"
                        }`}
                      >
                        {String(hour).padStart(2, "0")}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            <div>
              <p className="mb-2 text-xs text-slate-400">Minute</p>

              <ScrollArea className="h-56 rounded-lg border border-white/10 bg-slate-950">
                <div className="space-y-1 p-2">
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => {
                    // Keep the selected hour and period while changing only the minute.
                    const currentHour = time.split(":")[0] || "09";

                    const period = time.includes("PM") ? "PM" : "AM";

                    const value = `${currentHour}:${String(minute).padStart(
                      2,
                      "0",
                    )} ${period}`;

                    return (
                      <button
                        key={minute}
                        type="button"
                        onClick={() => setTime(value)}
                        className={`w-full rounded-md px-3 py-2 text-sm ${
                          time.includes(`:${String(minute).padStart(2, "0")}`)
                            ? "bg-violet-600 text-white"
                            : "text-slate-300 hover:bg-violet-500/20"
                        }`}
                      >
                        {String(minute).padStart(2, "0")}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* AM/PM buttons update only the period part of the selected time. */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {["AM", "PM"].map((p) => {
              const currentHour = time.split(":")[0] || "09";

              const currentMinute = time.split(":")[1]?.split(" ")[0] || "00";

              const value = `${currentHour}:${currentMinute} ${p}`;

              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTime(value)}
                  className={`rounded-md px-3 py-2 text-sm ${
                    time.includes(p)
                      ? "bg-violet-600 text-white"
                      : "border border-white/10 bg-slate-950 text-slate-300"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      {/* Location is optional and adds a place to the generated email. */}
      <input
        placeholder="ទីតាំង"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-4 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
      />

      {/* Main information field contains the details the AI should include. */}
      <textarea
        placeholder="ព័ត៌មានសំខាន់ដែលចង់ដាក់ក្នុងអ៊ីមែល"
        value={info}
        onChange={(e) => setInfo(e.target.value)}
        required
        rows={4}
        className="min-h-32 w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
      />

      {/* Submit button shows a spinner while the email is being generated. */}
      <button
        type="submit"
        disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        បង្កើតអ៊ីមែល
      </button>
    </form>
  );
}
