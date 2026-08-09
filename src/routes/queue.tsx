import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { queueSlots, queueDay, tiers } from "@/lib/turnlive-data";

export const Route = createFileRoute("/queue")({
  head: () => ({
    meta: [
      { title: "الطابور والجدول — TURNLIVE" },
      {
        name: "description",
        content: "جدول الطابور الذكي على TURNLIVE: من يبث الآن، من التالي، وأي Slot ما زال متاحًا.",
      },
      { property: "og:title", content: "QUEUE — TURNLIVE" },
      { property: "og:description", content: "الطابور الذكي يحدد من يبث ومتى، حسب Creator Score." },
    ],
  }),
  component: QueuePage,
});

const stateStyles: Record<string, string> = {
  done: "opacity-50",
  live: "border-primary/70 bg-primary/10",
  next: "border-gold/50",
  open: "",
};

function QueuePage() {
  return (
    <AppShell>
      <h1 className="font-display text-3xl">📅 QUEUE</h1>
      <p className="mt-1 text-sm text-muted-foreground">جدول {queueDay} — المنصة تدير الطابور، لا الصدفة.</p>

      <div className="mt-4 grid gap-2">
        {queueSlots.map((s) => (
          <div
            key={s.time}
            className={`panel flex items-center gap-3 p-3 ${stateStyles[s.state]}`}
          >
            <div className="w-16 shrink-0 text-center">
              <p className="font-display text-xl">{s.time}</p>
              <p className="text-[10px] text-muted-foreground">{s.duration}</p>
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 font-semibold">
                {s.state === "live" && <span className="live-dot" />}
                {s.name}
                {s.state === "next" && (
                  <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold">
                    التالي
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {s.category} · {s.tier}
                {s.score > 0 && ` · Score ${s.score}/100`}
              </p>
            </div>
            {s.state === "open" && s.name === "Slot متاح" ? (
              <Button size="sm">تقديم طلب</Button>
            ) : (
              <span className="text-xs text-muted-foreground">
                {s.state === "done" ? "انتهى" : s.state === "live" ? "على الهواء" : "محجوز"}
              </span>
            )}
          </div>
        ))}
      </div>

      <section className="panel mt-5 p-4">
        <h2 className="font-display text-xl">مدة البث حسب المستوى</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {tiers.map((t) => (
            <li
              key={t.label}
              className="flex items-center justify-between rounded-lg bg-surface-2/40 px-3 py-2 text-sm"
            >
              <span>
                {t.icon} {t.label}
              </span>
              <span className="text-muted-foreground">{t.time}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel mt-4 p-4">
        <h2 className="font-display text-xl">قواعد التمديد</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>🎯 100,000 مشاهدة → 🏆 +10 دقائق</li>
          <li>🎯 50,000 نقطة دعم → 🏆 +15 دقيقة</li>
          <li>📈 أداء قوي (مدة مشاهدة + عودة المستخدمين) → تمديد تقديري من المنصة</li>
          <li>🚧 الحد الأقصى للتمديد: 60 دقيقة لكل بث</li>
        </ul>
      </section>
    </AppShell>
  );
}
