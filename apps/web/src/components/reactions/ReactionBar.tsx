import { useState } from "react";

interface ReactionBarProps {
  thoughtId: string;
  counts: Record<string, number>;
  onReact?: (thoughtId: string, type: string) => void;
}

const REACTIONS = [
  { type: "APPRECIATE", label: "Appreciate", icon: "👏" },
  { type: "USEFUL", label: "Useful", icon: "🛠️" },
  { type: "INTERESTING", label: "Interesting", icon: "🤔" },
  { type: "LEARNED_SOMETHING", label: "Learned", icon: "📚" },
  { type: "RELATE", label: "Relate", icon: "💫" },
  { type: "DISAGREE", label: "Disagree", icon: "💬" },
];

export function ReactionBar({ thoughtId, counts, onReact }: ReactionBarProps) {
  const [myReactions, setMyReactions] = useState<Set<string>>(new Set());

  const handleReact = (type: string) => {
    setMyReactions((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
    onReact?.(thoughtId, type);
  };

  return (
    <div className="flex flex-wrap items-center gap-1">
      {REACTIONS.map((reaction) => {
        const count = counts[reaction.type] || 0;
        const isActive = myReactions.has(reaction.type);

        return (
          <button
            key={reaction.type}
            onClick={() => handleReact(reaction.type)}
            className={`reaction-btn ${isActive ? "active" : ""}`}
            title={reaction.label}
          >
            <span>{reaction.icon}</span>
            {count > 0 && (
              <span className="tabular-nums">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
