import { Loader2 } from "lucide-react";

// Message matches the generated email object passed from ChatUI.
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

interface ResultSectionProps {
  messages: Message[];
  loading: boolean;
}

// Clean model output so the result looks like a normal email, not Markdown.
function cleanEmailText(text: string) {
  return text
    .replace(/\r\n/g, "\n")

    .replace(/\*\*/g, "")

    .replace(/^\*\s?/gm, "• ")

    .replace(/\n{3,}/g, "\n\n")

    .replace(/[ \t]+\n/g, "\n")

    .trim();
}

// ResultSection displays the generated email, empty placeholder, or loading message.
export function ResultSection({ messages, loading }: ResultSectionProps) {
  return (
    <div className="border-t border-white/10 p-4 sm:p-6">
      <h2 className="mb-3 text-sm font-semibold text-slate-300">
        លទ្ធផលអ៊ីមែល
      </h2>

      <div className="min-h-32 rounded-xl border border-white/10 bg-slate-950 p-4">
        {/* Placeholder appears before any email has been generated. */}
        {messages.length === 0 && !loading && (
          <p className="text-sm text-slate-500">លទ្ធផលនឹងបង្ហាញនៅទីនេះ...</p>
        )}

        {/* Render each generated email with preserved line breaks. */}
        {messages.map((m) => (
          <div
            key={m.id}
            className="whitespace-pre-wrap text-[15px] leading-5 text-slate-200"
          >
            {cleanEmailText(m.content)}
          </div>
        ))}

        {/* Loading indicator appears while waiting for the API response. */}
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
