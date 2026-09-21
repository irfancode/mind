import { useNavigate } from "react-router-dom";
import { Composer } from "../components/composer/Composer";
import { useFeed } from "../context/FeedContext";

export function ComposePage() {
  const navigate = useNavigate();
  const { addThought } = useFeed();

  const handleThoughtCreated = (thought: any) => {
    addThought(thought);
    navigate("/");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">Share a thought</h1>
      </div>

      <Composer onThoughtCreated={handleThoughtCreated} />
    </div>
  );
}
