import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, Timer, Radio, ArrowLeft, Maximize2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LiveOverlay } from "@/components/LiveOverlay";
import { liveNow, nextUp, formatNumber } from "@/lib/turnlive-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "البث المباشر الآن — TURNLIVE" },
      {
        name: "description",
        content:
          "بث مباشر واحد في كل لحظة. تابع البث الحالي على TURNLIVE ومعرفة موعد البث التالي.",
      },
      { property: "og:title", content: "البث المباشر الآن — TURNLIVE" },
      {
        property: "og:description",
        content: "بث واحد. جمهور واحد. تابع البث الجاري الآن على TURNLIVE.",
      },
    ],
  }),
  component: LiveNow,
});

function LiveNow() {
  const [left, setLeft] = useState(liveNow.remainingSeconds);
  const [viewers, setViewers] = useState(liveNow.viewers);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((v) => (v > 0 ? v - 1 : 0));
      setViewers((v) => v + Math.floor(Math.random() * 40) - 12);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(
    left % 60,
  ).padStart(2, "0")}`;

  return (
    <AppShell>
      <section className="panel p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          <span className="live-dot" /> على الهواء الآن
        </div>

        <h1 className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-4xl">
          {liveNow.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {liveNow.channel} · {liveNow.handle} · {liveNow.category}
        </p>

        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-xl border border-border/70 bg-surface-2/40">
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <Radio className="h-7 w-7 text-primary" />
            <p className="text-sm">نافذة البث المباشر</p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute bottom-3 end-3 inline-flex items-center gap-2 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-live transition-transform hover:scale-105"
          >
            <Maximize2 className="h-3.5 w-3.5" /> فتح البث
          </button>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-3">
          <Stat icon={<Eye className="h-4 w-4" />} label="المشاهدون" value={formatNumber(viewers)} />
          <Stat icon={<Timer className="h-4 w-4" />} label="الوقت المتبقي" value={remaining} />
          <Stat icon={<Radio className="h-4 w-4" />} label="بدأ الساعة" value={liveNow.startedAt} />
        </dl>
      </section>

      <LiveOverlay
        open={open}
        onClose={() => setOpen(false)}
        channel={liveNow.channel}
        handle={liveNow.handle}
        title={liveNow.title}
        viewers={viewers}
        remainingSeconds={left}
      />


      <section className="panel mt-5 flex items-center justify-between gap-4 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">البث التالي</p>
          <p className="mt-2 text-lg font-semibold text-foreground">{nextUp.channel}</p>
          <p className="text-sm text-muted-foreground">
            {nextUp.time} · {nextUp.duration} · {nextUp.handle}
          </p>
        </div>
        <Link
          to="/announcements"
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
        >
          كل الإعلانات <ArrowLeft className="h-4 w-4" />
        </Link>
      </section>
    </AppShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface-2/40 px-3 py-4">
      <dt className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </dt>
      <dd className="mt-2 font-display text-2xl leading-none text-foreground">{value}</dd>
    </div>
  );
}
