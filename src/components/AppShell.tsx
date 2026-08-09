import { Link } from "@tanstack/react-router";
import { Radio, CalendarClock, ListOrdered, Video, Gem, User } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "LIVE", icon: Radio },
  { to: "/upcoming", label: "UPCOMING", icon: CalendarClock },
  { to: "/queue", label: "QUEUE", icon: ListOrdered },
  { to: "/create", label: "CREATE", icon: Video },
  { to: "/wallet", label: "WALLET", icon: Gem },
  { to: "/profile", label: "PROFILE", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl leading-none text-foreground">
              TURN<span className="text-primary">LIVE</span>
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:inline">
              your turn. the world watches.
            </span>
          </Link>
          <span className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <span className="live-dot" /> بث واحد الآن
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-5">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-stretch justify-between px-2 py-2">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="flex flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[10px] font-semibold tracking-wide transition-colors hover:text-foreground"
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
