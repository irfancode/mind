import { useState } from "react";
import { api } from "../../lib/api";

interface ComposerProps {
  onThoughtCreated?: (thought: any) => void;
  replyToId?: string;
  compact?: boolean;
}

const THOUGHT_TYPES = [
  { type: "THOUGHT", label: "Thought", icon: "💭", placeholder: "What's on your mind?" },
  { type: "QUESTION", label: "Question", icon: "❓", placeholder: "What would you like to ask?" },
  { type: "IDEA", label: "Idea", icon: "💡", placeholder: "What idea would you like to share?" },
  { type: "MOMENT", label: "Moment", icon: "✨", placeholder: "Share a moment..." },
];

export function Composer({ onThoughtCreated, replyToId, compact }: ComposerProps) {
  const [selectedType, setSelectedType] = useState("THOUGHT");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moderationNote, setModerationNote] = useState<string | null>(null);

  const selectedTypeData = THOUGHT_TYPES.find((t) => t.type === selectedType);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setModerationNote(null);

    try {
      const result = await api.createThought({
        type: selectedType,
        content: content.trim(),
        replyToId,
      });

      if (result.moderation.action === "ADD_CONTEXT") {
        setModerationNote("Your thought has been flagged for context verification.");
      }

      setContent("");
      onThoughtCreated?.(result.thought);
    } catch (err: any) {
      setError(err.message || "Failed to create thought");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (compact) {
    return (
      <div className="card">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mind-100 text-sm font-semibold text-mind-700">
            ✏️
          </div>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={selectedTypeData?.placeholder}
              className="w-full resize-none border-0 bg-transparent text-[15px] text-gray-800 placeholder:text-gray-400 focus:outline-none"
              rows={2}
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="flex gap-1">
                {THOUGHT_TYPES.map((type) => (
                  <button
                    key={type.type}
                    onClick={() => setSelectedType(type.type)}
                    className={`rounded-lg px-2 py-1 text-xs transition-all ${
                      selectedType === type.type
                        ? "bg-mind-100 text-mind-700"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                    title={type.label}
                  >
                    {type.icon}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || isSubmitting}
                className="btn-primary !px-4 !py-2 !text-xs"
              >
                {isSubmitting ? "Posting..." : "Share"}
              </button>
            </div>
          </div>
        </div>
        {error && (
          <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">
            {error}
          </div>
        )}
        {moderationNote && (
          <div className="mt-3 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-700">
            {moderationNote}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        What's on your mind?
      </h3>

      <div className="mb-4 flex gap-2">
        {THOUGHT_TYPES.map((type) => (
          <button
            key={type.type}
            onClick={() => setSelectedType(type.type)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              selectedType === type.type
                ? "bg-mind-100 text-mind-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>{type.icon}</span>
            {type.label}
          </button>
        ))}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={selectedTypeData?.placeholder}
        className="input min-h-[120px] resize-none"
        maxLength={5000}
      />

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {content.length}/5000
        </span>
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? "Posting..." : "Share thought"}
        </button>
      </div>

      {error && (
        <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">
          {error}
        </div>
      )}
      {moderationNote && (
        <div className="mt-3 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-700">
          {moderationNote}
        </div>
      )}
    </div>
  );
}
