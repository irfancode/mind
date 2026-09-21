import { useState } from "react";

interface ShareButtonProps {
  thoughtId: string;
  onShare?: (thoughtId: string, intent: string, context?: string) => void;
}

const SHARE_INTENTS = [
  { value: "AGREE", label: "I agree", icon: "👍" },
  { value: "DISAGREE", label: "I disagree", icon: "👎" },
  { value: "USEFUL", label: "Useful", icon: "🛠️" },
  { value: "INTERESTING", label: "Interesting", icon: "🤔" },
  { value: "ASKING_QUESTION", label: "Asking question", icon: "❓" },
  { value: "ADDING_CONTEXT", label: "Adding context", icon: "📋" },
];

export function ShareButton({ thoughtId, onShare }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [context, setContext] = useState("");

  const handleShare = () => {
    if (!selectedIntent) return;
    onShare?.(thoughtId, selectedIntent, context || undefined);
    setIsOpen(false);
    setSelectedIntent(null);
    setContext("");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg px-2 py-1 text-[10px] text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
        title="Share thought"
      >
        ↗ Share
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-50 w-72 rounded-xl border border-gray-100 bg-white p-4 shadow-xl animate-slide-up">
          <h4 className="mb-3 text-sm font-semibold text-gray-900">
            Share this thought
          </h4>

          <div className="mb-3 grid grid-cols-2 gap-2">
            {SHARE_INTENTS.map((intent) => (
              <button
                key={intent.value}
                onClick={() => setSelectedIntent(intent.value)}
                className={`flex items-center gap-2 rounded-lg border p-2 text-left text-xs transition-all ${
                  selectedIntent === intent.value
                    ? "border-mind-500 bg-mind-50 text-mind-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span>{intent.icon}</span>
                <span>{intent.label}</span>
              </button>
            ))}
          </div>

          {selectedIntent === "ADDING_CONTEXT" && (
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Add your context or perspective..."
              className="mb-3 w-full rounded-lg border border-gray-200 p-2 text-xs focus:border-mind-500 focus:outline-none"
              rows={3}
            />
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleShare}
              disabled={!selectedIntent}
              className="flex-1 rounded-lg bg-mind-600 px-3 py-2 text-xs font-medium text-white hover:bg-mind-700 disabled:opacity-50"
            >
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
