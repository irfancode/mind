import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { useAuth } from "../../context/AuthContext";

export function Layout() {
  const { user } = useAuth();

  const uiMode = user?.uiMode || "STANDARD";
  const modeClass =
    uiMode === "CHILD"
      ? "child-mode"
      : uiMode === "SENIOR"
      ? "senior-mode"
      : uiMode === "SIMPLE"
      ? "simple-mode"
      : "";

  return (
    <div className={`min-h-screen bg-gray-50 ${modeClass}`}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex gap-6">
          <aside className="hidden lg:block lg:w-64 lg:shrink-0">
            <div className="sticky top-0 h-screen py-6">
              <Sidebar />
            </div>
          </aside>

          <main className="min-h-screen flex-1 py-6 pb-24 lg:pb-6">
            <Outlet />
          </main>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
