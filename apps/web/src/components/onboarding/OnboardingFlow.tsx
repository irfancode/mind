import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const STEPS = [
  { id: 1, title: "Welcome to MIND", subtitle: "A place for human thought." },
  { id: 2, title: "What languages do you use?", subtitle: "We'll translate for you." },
  { id: 3, title: "Which age group are you in?", subtitle: "This helps us personalize your experience." },
  { id: 4, title: "What do you want MIND to feel like?", subtitle: "Choose your feed vibe." },
];

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ms", label: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "ta", label: "தமிழ்", flag: "🇮🇳" },
];

const AGE_GROUPS = [
  { value: "UNDER_13", label: "Under 13" },
  { value: "AGE_13_15", label: "13–15" },
  { value: "AGE_16_17", label: "16–17" },
  { value: "AGE_18_24", label: "18–24" },
  { value: "AGE_25_39", label: "25–39" },
  { value: "AGE_40_59", label: "40–59" },
  { value: "AGE_60_PLUS", label: "60+" },
];

const FEED_VIBES = [
  { value: "CALM", label: "Calm", icon: "🧘", description: "Peaceful and thoughtful" },
  { value: "CURIOUS", label: "Curious", icon: "🔍", description: "Learning and discovery" },
  { value: "LOCAL", label: "Local", icon: "🇸🇬", description: "Singapore-focused" },
  { value: "GLOBAL", label: "Global", icon: "🌍", description: "World perspectives" },
  { value: "PROFESSIONAL", label: "Professional", icon: "💼", description: "Career and industry" },
  { value: "CREATIVE", label: "Creative", icon: "🎨", description: "Art and expression" },
  { value: "FAMILY_FRIENDLY", label: "Family", icon: "👨‍👩‍👧‍👦", description: "Safe for all ages" },
];

export function OnboardingFlow() {
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en"]);
  const [selectedAge, setSelectedAge] = useState<string>("");
  const [selectedVibe, setSelectedVibe] = useState<string>("CALM");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleLanguage = (code: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(code)
        ? prev.length > 1
          ? prev.filter((l: string) => l !== code)
          : prev
        : [...prev, code]
    );
  };

  const handleComplete = async () => {
    if (!displayName.trim() || !selectedAge || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await login({
        displayName: displayName.trim(),
        preferredLanguages: selectedLanguages,
        ageGroup: selectedAge,
        feedVibe: selectedVibe,
      });
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-mind-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-mind-600 text-3xl font-bold text-white">
            M
          </div>
        </div>

        <div className="card">
          <div className="mb-6">
            <div className="flex gap-1">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    s.id <= step ? "bg-mind-600" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                What should we call you?
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                This is how people will see you on MIND.
              </p>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="input text-lg"
                maxLength={50}
                autoFocus
              />
              <p className="mt-2 text-xs text-gray-400">
                {displayName.length > 0 && (
                  <>
                    <span className="font-medium text-mind-600">
                      {displayName}
                    </span>{" "}
                    — is that how you'd like people to see you?
                  </>
                )}
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                What languages do you use?
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                Select all that apply. We'll translate for you.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => toggleLanguage(lang.code)}
                    className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                      selectedLanguages.includes(lang.code)
                        ? "border-mind-500 bg-mind-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-medium text-gray-800">
                      {lang.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                Which age group are you in?
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                This helps us personalize your experience. Not shown publicly.
              </p>
              <div className="space-y-2">
                {AGE_GROUPS.map((age) => (
                  <button
                    key={age.value}
                    onClick={() => setSelectedAge(age.value)}
                    className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                      selectedAge === age.value
                        ? "border-mind-500 bg-mind-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-medium text-gray-800">
                      {age.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in">
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                What do you want MIND to feel like?
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                Choose your feed vibe. You can change this later.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {FEED_VIBES.map((vibe) => (
                  <button
                    key={vibe.value}
                    onClick={() => setSelectedVibe(vibe.value)}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                      selectedVibe === vibe.value
                        ? "border-mind-500 bg-mind-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-3xl">{vibe.icon}</span>
                    <span className="font-medium text-gray-800">
                      {vibe.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      {vibe.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-secondary flex-1"
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !displayName.trim()) ||
                  (step === 3 && !selectedAge)
                }
                className="btn-primary flex-1"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="btn-primary flex-1"
              >
                {isSubmitting ? "Creating your account..." : "Done"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
