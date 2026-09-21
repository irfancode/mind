export function TrustPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Trust & Safety</h1>

      <div className="card">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Human Passport
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          Every verified human account on MIND receives a cryptographic Human
          Passport. This proves you're a real person without exposing your
          personal information.
        </p>
        <div className="rounded-xl bg-mind-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mind-600 text-lg font-bold text-white">
              ✓
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                Human Verified
              </div>
              <div className="text-xs text-gray-500">
                Private proof → Public trust signal
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Content Provenance
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          Every piece of content on MIND has an internal provenance state. This
          helps you understand the origin of what you're reading.
        </p>
        <div className="space-y-2">
          {[
            { label: "Human-authored", icon: "👤", description: "Written by a verified human" },
            { label: "AI-assisted", icon: "🤖", description: "Human-written with AI help" },
            { label: "AI-generated", icon: "⚙️", description: "Created entirely by AI" },
            { label: "Edited from AI", icon: "✏️", description: "AI-generated, then human-edited" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
            >
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="text-sm font-medium text-gray-800">
                  {item.label}
                </div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Anti-Nonsense Engine
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          MIND moderates before amplification, not after publication. Every post
          passes through multiple safety layers.
        </p>
        <div className="space-y-3">
          {[
            {
              layer: "Layer 1",
              name: "Illegal Content",
              color: "bg-red-100 text-red-700",
              description: "Immediate block/quarantine",
            },
            {
              layer: "Layer 2",
              name: "Dangerous Interaction",
              color: "bg-orange-100 text-orange-700",
              description: "Grooming, coercion, stalking",
            },
            {
              layer: "Layer 3",
              name: "Manipulation",
              color: "bg-yellow-100 text-yellow-700",
              description: "Bot networks, fake accounts",
            },
            {
              layer: "Layer 4",
              name: "Misinformation Risk",
              color: "bg-blue-100 text-blue-700",
              description: "Reduce amplification + add context",
            },
            {
              layer: "Layer 5",
              name: "Ordinary Disagreement",
              color: "bg-green-100 text-green-700",
              description: "Allow it. You can disagree without garbage.",
            },
          ].map((item) => (
            <div
              key={item.layer}
              className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
            >
              <span
                className={`rounded-lg px-2 py-1 text-xs font-bold ${item.color}`}
              >
                {item.layer}
              </span>
              <div>
                <div className="text-sm font-medium text-gray-800">
                  {item.name}
                </div>
                <div className="text-xs text-gray-500">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Scam Protection
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          MIND's Trust Firewall detects and warns you about suspicious
          interactions before they can cause harm.
        </p>
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-safe-green/10 text-2xl">
            🛡️
          </div>
          <p className="text-sm font-medium text-gray-700">
            Payment instructions are never allowed inside normal conversations.
          </p>
          <p className="mt-1 text-xs text-gray-500">
            If financial language is detected, you'll see a warning.
          </p>
        </div>
      </div>
    </div>
  );
}
