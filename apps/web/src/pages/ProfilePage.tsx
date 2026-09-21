import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { ThoughtCard } from "../components/feed/ThoughtCard";

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [thoughts, setThoughts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      try {
        const [profileData, thoughtsData] = await Promise.all([
          api.getProfile(userId),
          api.getUserThoughts(userId),
        ]);
        setProfile(profileData.user);
        setThoughts(thoughtsData.thoughts);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="card animate-pulse">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-5 w-32 rounded bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="card">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-mind-100 text-2xl font-bold text-mind-700">
            {profile.displayName[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">
                {profile.displayName}
              </h1>
              {profile.isHumanVerified && (
                <span className="text-sm text-mind-600">Human ✓</span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Member since{" "}
              {new Date(profile.createdAt).toLocaleDateString("en-SG", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="mt-3 flex gap-6">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {profile._count?.thoughts || 0}
                </div>
                <div className="text-xs text-gray-500">Thoughts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {profile._count?.followers || 0}
                </div>
                <div className="text-xs text-gray-500">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {profile._count?.following || 0}
                </div>
                <div className="text-xs text-gray-500">Following</div>
              </div>
            </div>
          </div>
        </div>

        {profile.trustSignals && profile.trustSignals.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.trustSignals.map((signal: string) => (
              <span
                key={signal}
                className="rounded-full bg-mind-50 px-3 py-1 text-xs font-medium text-mind-700"
              >
                {signal.replace(/_/g, " ").toLowerCase()}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {thoughts.map((thought) => (
          <ThoughtCard key={thought.id} thought={thought} />
        ))}
        {thoughts.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No thoughts yet.
          </div>
        )}
      </div>
    </div>
  );
}
