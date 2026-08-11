import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Eye, Heart, Radio, Send, Star, Timer, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAccount, formatNumber, pointsToUsd, POINTS_PER_USD } from "@/lib/turnlive-data";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "استوديو البث المباشر — TURNLIVE" },
      {
        name: "description",
        content: "افتح بثك المباشر بشاشة كاملة مع التعليقات اللحظية والتفاعل ودعم النجوم.",
      },
      { property: "og:title", content: "استوديو البث المباشر — TURNLIVE" },
      {
        property: "og:description",
        content: "شاشة بث مباشر مع تعليقات وتفاعل ونظام نجوم على TURNLIVE.",
      },
    ],
  }),
  component: StudioPage,
});

type Msg = { id: string; author: string; text: string };

const seedMsgs: Msg[] = [
  { id: "m1", author: "@tech.lab", text: "الصوت واضح جدًا 👌" },
  { id: "m2", author: "@business.room", text: "متى تبدأ فقرة الأسئلة؟" },
];

function StudioPage() {
  const account = useAccount();
  const navigate = useNavigate();
  const [live, setLive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [viewers, setViewers] = useState(0);
  const [hearts, setHearts] = useState(0);
  const [stars, setStars] = useState(0);
  const [msgs, setMsgs] = useState<Msg[]>(seedMsgs);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      setSeconds((s) => s + 1);
      setViewers((v) => Math.max(0, v + Math.floor(Math.random() * 25)));
      setHearts((h) => h + Math.floor(Math.random() * 6));
    }, 1000);
    return () => clearInterval(id);
  }, [live]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [msgs]);

  const clock = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60,
  ).padStart(2, "0")}`;

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !account) return;
    setMsgs((m) => [...m, { id: `m-${Date.now()}`, author: account.handle, text: text.trim() }]);
    setText("");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-6xl gap-4 p-4 lg:grid-cols-[1.6fr_1fr]">
        <section className="panel relative overflow-hidden">
          <div className="flex items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-2">
              {live ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  <span className="live-dot" /> LIVE
                </span>
              ) : (
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  غير متصل
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Timer className="h-3.5 w-3.5 text-primary" /> {clock}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Eye className="h-3.5 w-3.5 text-primary" /> {formatNumber(viewers)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              aria-label="إغلاق"
              className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mx-4 aspect-video rounded-xl border border-border/70 bg-surface-2/40">
            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <Radio className="h-8 w-8 text-primary" />
              <p className="text-sm">{live ? "أنت على الهواء الآن" : "معاينة الكاميرا"}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 p-4">
            <button
              type="button"
              onClick={() => {
                setLive((v) => !v);
                toast.success(live ? "تم إنهاء البث" : "بدأ البث المباشر");
              }}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-90 ${
                live
                  ? "border border-border text-foreground"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {live ? "إنهاء البث" : "بدء البث"}
            </button>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-primary" /> {formatNumber(hearts)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-gold">
              <Star className="h-4 w-4" /> {stars} نجمة ≈ {pointsToUsd(stars)}$
            </span>
            <span className="text-xs text-muted-foreground">
              كل {POINTS_PER_USD} نقطة = 1 دولار
            </span>
          </div>
        </section>

        <section className="panel flex max-h-[70vh] flex-col">
          <h2 className="border-b border-border/60 p-4 font-display text-lg text-foreground">
            التعليقات المباشرة
          </h2>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {msgs.map((m) => (
              <p key={m.id}>
                <span className="font-medium text-foreground">{m.author}</span>{" "}
                <span className="text-muted-foreground">{m.text}</span>
              </p>
            ))}
            <div ref={endRef} />
          </div>

          <div className="flex gap-2 border-t border-border/60 p-3">
            <button
              type="button"
              onClick={() => setHearts((h) => h + 1)}
              aria-label="إعجاب"
              className="rounded-full border border-border p-2 text-primary transition-colors hover:bg-surface-2"
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setStars((s) => s + 10);
                toast.success("أرسلت 10 نجوم");
              }}
              aria-label="إرسال نجوم"
              className="rounded-full border border-border p-2 text-gold transition-colors hover:bg-surface-2"
            >
              <Star className="h-4 w-4" />
            </button>
            <form onSubmit={send} className="flex flex-1 gap-2">
              <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="اكتب تعليقًا" />
              <button
                type="submit"
                aria-label="إرسال"
                className="rounded-md bg-primary px-3 text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
