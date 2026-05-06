import { Loader2 } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

interface ResultSectionProps {
  messages: Message[];
  loading: boolean;
}

function cleanEmailText(text: string) {
  return text
    .replace(/\r\n/g, "\n")

    .replace(/\*\*/g, "")

    .replace(/^\*\s?/gm, "• ")

    .replace(/\n{3,}/g, "\n\n")

    .replace(/[ \t]+\n/g, "\n")

    .trim();
}

export function ResultSection({ messages, loading }: ResultSectionProps) {
  return (
    <div className="border-t border-white/10 p-4 sm:p-6">
      <h2 className="mb-3 text-sm font-semibold text-slate-300">
        លទ្ធផលអ៊ីមែល
      </h2>

      <div className="min-h-32 rounded-xl border border-white/10 bg-slate-950 p-4">
        {messages.length === 0 && !loading && (
          <p className="text-sm text-slate-500">លទ្ធផលនឹងបង្ហាញនៅទីនេះ...</p>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className="whitespace-pre-wrap text-[15px] leading-5 text-slate-200"
          >
            {cleanEmailText(m.content)}
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
  );
}
