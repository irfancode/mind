import { useEffect } from "react";
import { useFeed } from "../context/FeedContext";
import { ThoughtCard } from "../components/feed/ThoughtCard";
import { Composer } from "../components/composer/Composer";
import { api } from "../lib/api";

export function HomePage() {
  const { items, isCaughtUp, isLoading, loadFeed, loadMore, addThought } =
    useFeed();

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handleReact = async (thoughtId: string, type: string) => {
    try {
      await api.addReaction(thoughtId, type);
    } catch (err) {
      console.error("Failed to add reaction:", err);
    }
  };

  const handleShare = async (
    thoughtId: string,
    intent: string,
    context?: string
  ) => {
    try {
      await api.shareThought({ thoughtId, intent, addedContext: context });
    } catch (err) {
      console.error("Failed to share:", err);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Home</h1>
        <span className="text-sm text-gray-400">🧠</span>
      </div>

      <Composer onThoughtCreated={addThought} />

      {isLoading && items.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="h-4 w-full rounded bg-gray-200" />
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <ThoughtCard
                key={item.thought.id}
                thought={item.thought}
                onReact={handleReact}
                onShare={handleShare}
              />
            ))}
          </div>

          {isCaughtUp && items.length > 0 && (
            <div className="py-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-mind-100 text-2xl">
                ✅
              </div>
              <p className="text-lg font-medium text-gray-900">
                You're caught up.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                You've seen all the latest thoughts from your network.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button className="btn-secondary">
                  Explore more
                </button>
                <button className="btn-primary">
                  Share a thought
                </button>
              </div>
            </div>
          )}

          {!isCaughtUp && items.length > 0 && (
            <div className="py-8 text-center">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="btn-secondary"
              >
                {isLoading ? "Loading..." : "Load more thoughts"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
