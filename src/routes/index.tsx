import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Gift, Share2, Eye, Timer, Target, ChevronLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import heroImg from "@/assets/live-hero.jpg";
import { formatNumber } from "@/lib/turnlive-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TURNLIVE — البث المباشر الآن" },
      {
        name: "description",
        content:
          "بث واحد فقط في كل لحظة. شاهد البث المباشر الحالي على TURNLIVE، ادعم صانع المحتوى، وانتظر دورك.",
      },
      { property: "og:title", content: "TURNLIVE — LIVE NOW" },
      {
        property: "og:description",
        content: "بث واحد. صانع محتوى واحد. جمهور واحد. دورك والعالم يشاهد.",
      },
    ],
  }),
  component: LiveNow,
});

function useCountdown(initial: number) {
  const [left, setLeft] = useState(initial);
  useEffect(() => {
    const id = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const m = String(Math.floor(left / 60)).padStart(2, "0");
  const s = String(left % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function LiveNow() {
  const remaining = useCountdown(18 * 60 + 32);
  const [viewers, setViewers] = useState(184521);
  const [supported, setSupported] = useState(62400);

  useEffect(() => {
    const id = setInterval(
      () => setViewers((v) => v + Math.floor(Math.random() * 120) - 40),
      2500,
    );
    return () => clearInterval(id);
  }, []);

  const goal = 100000;
  const pct = Math.min(100, Math.round((supported / goal) * 100));

  return (
    <AppShell>
      <section className="panel overflow-hidden">
        <div className="relative">
          <img
            src={heroImg}
            alt="البث المباشر الحالي على TURNLIVE"
            width={1024}
            height={640}
            className="h-[46vh] min-h-64 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-live px-3 py-1 text-xs font-bold text-live-foreground shadow-live">
            <span className="h-2 w-2 rounded-full bg-live-foreground" /> LIVE NOW
          </div>
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-background/70 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Eye className="h-3.5 w-3.5 text-primary" /> {formatNumber(viewers)}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4">
            <h1 className="font-display text-4xl text-foreground">زينب</h1>
            <p className="text-sm text-muted-foreground">🎤 Entertainment · بث عالمي</p>
          </div>
        </div>

        <div className="grid gap-4 p-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat icon={<Eye className="h-4 w-4" />} label="مشاهد" value={formatNumber(viewers)} />
            <Stat icon={<Timer className="h-4 w-4" />} label="الوقت المتبقي" value={remaining} />
            <Stat icon={<Target className="h-4 w-4" />} label="هدف الدعم" value="100,000" />
          </div>

          <div className="rounded-xl border border-border/70 bg-surface-2/50 p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>🎯 هدف الدعم — عند 100,000 نقطة يحصل البث على +15 دقيقة</span>
              <span className="font-bold text-gold">{pct}%</span>
            </div>
            <Progress value={pct} className="h-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              {formatNumber(supported)} / {formatNumber(goal)} نقطة
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button onClick={() => setSupported((v) => v + 250)} className="gap-2">
              <Heart className="h-4 w-4" /> دعم
            </Button>
            <Button
              variant="secondary"
              onClick={() => setSupported((v) => v + 1000)}
              className="gap-2"
            >
              <Gift className="h-4 w-4" /> إرسال نقاط
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" /> مشاركة
            </Button>
          </div>
        </div>
      </section>

      <section className="panel mt-4 flex items-center justify-between p-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">البث التالي</p>
          <p className="mt-1 font-display text-2xl">Creator X · 21:00</p>
          <p className="text-xs text-muted-foreground">🎮 Gaming · 30 دقيقة</p>
        </div>
        <ChevronLeft className="h-6 w-6 text-primary" />
      </section>

      <section className="panel mt-4 p-4">
        <h2 className="font-display text-xl">التفاعل المباشر</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {[
            ["Ahmed", "🎁 أرسل 1,000 نقطة"],
            ["Lina", "❤️ دعمت البث"],
            ["Kenji", "أفضل بث اليوم 🔥"],
            ["Sara", "🎁 أرسلت 250 نقطة"],
          ].map(([who, what]) => (
            <li
              key={who}
              className="flex items-center gap-2 rounded-lg bg-surface-2/40 px-3 py-2"
            >
              <span className="font-semibold text-primary">{who}</span>
              <span className="text-muted-foreground">{what}</span>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface-2/50 px-2 py-3">
      <div className="flex items-center justify-center gap-1 text-primary">{icon}</div>
      <p className="mt-1 font-display text-xl leading-none">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
