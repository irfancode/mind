import { useState } from "react";
import { Link } from "react-router-dom";
import { ReactionBar } from "../reactions/ReactionBar";
import { ShareButton } from "./ShareButton";
import { ContextBadge } from "../trust/ContextBadge";

interface ThoughtCardProps {
  thought: any;
  onReact?: (thoughtId: string, type: string) => void;
  onShare?: (thoughtId: string, intent: string, context?: string) => void;
}

export function ThoughtCard({ thought, onReact, onShare }: ThoughtCardProps) {
  const [showWhy, setShowWhy] = useState(false);

  const typeIcons: Record<string, string> = {
    THOUGHT: "💭",
    QUESTION: "❓",
    IDEA: "💡",
    MOMENT: "✨",
  };

  const typeLabels: Record<string, string> = {
    THOUGHT: "Thought",
    QUESTION: "Question",
    IDEA: "Idea",
    MOMENT: "Moment",
  };

  return (
    <article className="thought-card animate-fade-in">
      <div className="flex items-start gap-3">
        <Link
          to={`/profile/${thought.author?.id}`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mind-100 text-sm font-semibold text-mind-700 transition-all hover:bg-mind-200"
        >
          {thought.author?.displayName?.[0] || "?"}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link
              to={`/profile/${thought.author?.id}`}
              className="text-sm font-semibold text-gray-900 hover:underline"
            >
              {thought.author?.displayName}
            </Link>
            {thought.author?.isHumanVerified && (
              <span className="text-xs text-mind-600" title="Human verified">
                Human ✓
              </span>
            )}
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400">
              {formatTimeAgo(thought.createdAt)}
            </span>
          </div>

          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="text-xs">{typeIcons[thought.type]}</span>
            <span className="text-xs text-gray-500">
              {typeLabels[thought.type]}
            </span>
            {thought.moderationAction === "ADD_CONTEXT" && (
              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-medium text-yellow-700">
                Context available
              </span>
            )}
          </div>

          <div className="mt-3">
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-gray-800">
              {thought.content}
            </p>
          </div>

          {thought.context && (
            <ContextBadge context={thought.context} />
          )}

          <div className="mt-4 flex items-center gap-1">
            <ReactionBar
              thoughtId={thought.id}
              counts={thought.reactionCounts || {}}
              onReact={onReact}
            />
            <div className="ml-auto flex items-center gap-2">
              <ShareButton
                thoughtId={thought.id}
                onShare={onShare}
              />
              <button
                onClick={() => setShowWhy(!showWhy)}
                className="rounded-lg px-2 py-1 text-[10px] text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
                title="Why am I seeing this?"
              >
                Why?
              </button>
            </div>
          </div>

          {showWhy && (
            <div className="mt-2 rounded-lg bg-mind-50 p-3 text-xs text-mind-700">
              <strong>Why you're seeing this:</strong> {thought.reason || "From your network"}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString("en-SG", { day: "numeric", month: "short" });
}
