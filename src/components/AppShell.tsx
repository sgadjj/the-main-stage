import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { UserRound } from "lucide-react";
import { useAccount } from "@/lib/turnlive-data";

const nav = [
  { to: "/", label: "البث المباشر" },
  { to: "/announcements", label: "المنشورات" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const account = useAccount();

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="live-dot" />
            <span className="font-display text-xl leading-none tracking-[0.18em] text-foreground">
              TURN<span className="text-primary">LIVE</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {nav.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                activeProps={{ className: "bg-surface-2 text-foreground" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}




            <Link
              to="/profile"
              aria-label="حسابي"
              className="ms-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-2 text-[11px] font-bold text-foreground transition-colors hover:border-primary"
            >
              {account?.avatar ?? "TL"}
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-8">{children}</main>

      <footer className="mx-auto max-w-4xl px-5 pb-10 pt-4 text-xs text-muted-foreground">
        TURNLIVE — دورك، والعالم يشاهد.
      </footer>
    </div>
  );
}
