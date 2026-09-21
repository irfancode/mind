import { createContext, useContext, useState, useCallback } from "react";
import { api } from "../lib/api";

interface FeedItem {
  thought: any;
  score: number;
  reason: string;
}

interface FeedContextType {
  items: FeedItem[];
  isCaughtUp: boolean;
  isLoading: boolean;
  hasMore: boolean;
  loadFeed: () => Promise<void>;
  loadMore: () => Promise<void>;
  addThought: (thought: any) => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [isCaughtUp, setIsCaughtUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const loadFeed = useCallback(async () => {
    setIsLoading(true);
    try {
      const { feed } = await api.getFeed();
      setItems(feed.items);
      setIsCaughtUp(feed.isCaughtUp);
      setCursor(feed.nextCursor);
      setHasMore(!!feed.nextCursor);
    } catch (err) {
      console.error("Failed to load feed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    try {
      const { feed } = await api.getFeed(cursor);
      setItems((prev) => [...prev, ...feed.items]);
      setIsCaughtUp(feed.isCaughtUp);
      setCursor(feed.nextCursor);
      setHasMore(!!feed.nextCursor);
    } catch (err) {
      console.error("Failed to load more:", err);
    } finally {
      setIsLoading(false);
    }
  }, [cursor, hasMore, isLoading]);

  const addThought = useCallback((thought: any) => {
    setItems((prev) => [
      {
        thought,
        score: 100,
        reason: "Your thought",
      },
      ...prev,
    ]);
  }, []);

  return (
    <FeedContext.Provider
      value={{
        items,
        isCaughtUp,
        isLoading,
        hasMore,
        loadFeed,
        loadMore,
        addThought,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error("useFeed must be used within a FeedProvider");
  }
  return context;
}
