import { createFileRoute } from "@tanstack/react-router";
import { Bell, Share2, Users, Clock, Megaphone } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { upcomingStreams, formatNumber } from "@/lib/turnlive-data";

export const Route = createFileRoute("/upcoming")({
  head: () => ({
    meta: [
      { title: "البثوث القادمة — TURNLIVE" },
      {
        name: "description",
        content: "لوحة الإعلانات الرسمية للبثوث القادمة على TURNLIVE: المواعيد، التذكيرات والمشاركة.",
      },
      { property: "og:title", content: "UPCOMING — TURNLIVE" },
      { property: "og:description", content: "احجز تذكيرك للبث القادم على TURNLIVE." },
    ],
  }),
  component: UpcomingPage,
});

function UpcomingPage() {
  return (
    <AppShell>
      <h1 className="font-display text-3xl">🟠 UPCOMING</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        كل بث قادم يحصل على بطاقة ترويج ورابط مشاركة خاص.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {upcomingStreams.map((s) => (
          <article key={s.slug} className="panel overflow-hidden">
            <div className="relative">
              <img
                src={s.image}
                alt={`${s.name} — ${s.title}`}
                loading="lazy"
                width={896}
                height={512}
                className="h-40 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
              {s.promoted && (
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gold/20 px-2.5 py-1 text-[11px] font-bold text-gold">
                  <Megaphone className="h-3 w-3" /> Promoted
                </span>
              )}
              <div className="absolute bottom-3 right-3">
                <p className="font-display text-2xl">🔴 {s.name} LIVE</p>
                <p className="text-xs text-muted-foreground">🎤 {s.title}</p>
              </div>
            </div>
            <div className="grid gap-3 p-4">
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-surface-2/60 px-2.5 py-1">📅 {s.day}</span>
                <span className="rounded-full bg-surface-2/60 px-2.5 py-1">⏰ {s.time}</span>
                <span className="rounded-full bg-surface-2/60 px-2.5 py-1">{s.category}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-primary" /> {s.startsIn}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-primary" /> {formatNumber(s.interested)} مهتم
                </span>
              </div>
              <p className="rounded-lg bg-surface-2/40 px-3 py-2 text-[11px] text-muted-foreground">
                turnlive.app/{s.slug}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button className="gap-2">
                  <Bell className="h-4 w-4" /> ذكّرني
                </Button>
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" /> مشاركة
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
