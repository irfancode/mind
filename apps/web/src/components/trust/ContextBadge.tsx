import { useState } from "react";

interface ContextBadgeProps {
  context: {
    summary: string;
    evidenceQuality: string;
    sources?: Array<{
      url: string;
      title: string;
      publisher: string;
      reliabilityScore: number;
    }>;
    conflictingEvidence?: string[];
    lastChecked: string;
  };
}

export function ContextBadge({ context }: ContextBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const qualityColors: Record<string, string> = {
    STRONG: "bg-green-100 text-green-700",
    MODERATE: "bg-yellow-100 text-yellow-700",
    WEAK: "bg-orange-100 text-orange-700",
    CONFLICTING: "bg-red-100 text-red-700",
    UNKNOWN: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-2 text-left"
      >
        <span className="text-sm">📋</span>
        <span className="text-xs font-medium text-gray-700">
          Context available
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
            qualityColors[context.evidenceQuality] || qualityColors.UNKNOWN
          }`}
        >
          {context.evidenceQuality}
        </span>
        <svg
          className={`ml-auto h-4 w-4 text-gray-400 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3 animate-fade-in">
          <p className="text-xs text-gray-600">{context.summary}</p>

          {context.sources && context.sources.length > 0 && (
            <div>
              <h5 className="mb-1 text-[10px] font-semibold uppercase text-gray-500">
                Sources
              </h5>
              <div className="space-y-1">
                {context.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg bg-white p-2 text-xs transition-all hover:bg-gray-100"
                  >
                    <div className="font-medium text-gray-800">
                      {source.title}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {source.publisher}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {context.conflictingEvidence &&
            context.conflictingEvidence.length > 0 && (
              <div>
                <h5 className="mb-1 text-[10px] font-semibold uppercase text-gray-500">
                  Conflicting Evidence
                </h5>
                <ul className="space-y-1">
                  {context.conflictingEvidence.map((item, i) => (
                    <li
                      key={i}
                      className="rounded-lg bg-yellow-50 p-2 text-xs text-yellow-700"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          <div className="text-[10px] text-gray-400">
            Last checked:{" "}
            {new Date(context.lastChecked).toLocaleDateString("en-SG")}
          </div>
        </div>
      )}
    </div>
  );
}
