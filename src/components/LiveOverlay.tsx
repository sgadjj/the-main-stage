import { useEffect, useRef, useState } from "react";
import { Eye, Gift, Heart, Send, Star, Timer, X, Users } from "lucide-react";
import { formatNumber, formatCount, pointsToUsd, useAccount } from "@/lib/turnlive-data";

type Msg = { id: string; author: string; text: string; star?: boolean };

const seed: Msg[] = [
  { id: "m1", author: "@tech.lab", text: "الصوت واضح جدًا" },
  { id: "m2", author: "@business.room", text: "متى تبدأ فقرة الأسئلة؟" },
  { id: "m3", author: "@studio.guest", text: "أرسل 10 نجوم", star: true },
];

export function LiveOverlay({
  open,
  onClose,
  channel,
  handle,
  title,
  viewers: initialViewers,
  remainingSeconds,
}: {
  open: boolean;
  onClose: () => void;
  channel: string;
  handle: string;
  title: string;
  viewers: number;
  remainingSeconds: number;
}) {
  const account = useAccount();
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [text, setText] = useState("");
  const [hearts, setHearts] = useState(0);
  const [stars, setStars] = useState(0);
  const [viewers, setViewers] = useState(initialViewers);
  const [left, setLeft] = useState(remainingSeconds);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => {
      setViewers((v) => v + Math.floor(Math.random() * 40) - 12);
      setLeft((v) => (v > 0 ? v - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [msgs]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const clock = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setMsgs((m) => [
      ...m,
      { id: `m-${Date.now()}`, author: account?.handle ?? "@guest", text: text.trim() },
    ]);
    setText("");
  }

  function sendStars(n: number) {
    setStars((s) => s + n);
    setMsgs((m) => [
      ...m,
      { id: `s-${Date.now()}`, author: account?.handle ?? "@guest", text: `أرسل ${n} نجوم`, star: true },
    ]);
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/95">
      <div className="relative mx-auto flex h-full w-full max-w-md flex-col overflow-hidden bg-surface">
        {/* طبقة الفيديو */}
        <div className="absolute inset-0 bg-[radial-gradient(60rem_40rem_at_50%_10%,oklch(0.30_0.06_25),oklch(0.10_0.01_20))]" />

        {/* الشريط العلوي */}
        <div className="relative z-10 flex items-start justify-between gap-2 p-3">
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/60 p-1 pe-3 backdrop-blur-md">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 font-display text-sm text-foreground">
              {channel.slice(0, 2)}
            </span>
            <div className="leading-tight">
              <p className="text-[13px] font-semibold text-foreground">{channel}</p>
              <p className="text-[11px] text-muted-foreground">{handle}</p>
            </div>
            <span className="ms-2 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
              متابعة
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[11px] text-foreground backdrop-blur-md">
              <Eye className="h-3.5 w-3.5 text-primary" /> {formatCount(viewers)}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق البث"
              className="rounded-full border border-border/60 bg-background/60 p-2 text-foreground backdrop-blur-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 px-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
            <span className="live-dot" /> LIVE
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/50 px-2.5 py-1 text-[11px] text-foreground backdrop-blur-md">
            <Timer className="h-3.5 w-3.5 text-primary" /> {clock}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/50 px-2.5 py-1 text-[11px] text-gold backdrop-blur-md">
            <Star className="h-3.5 w-3.5" /> {stars} ≈ {pointsToUsd(stars)}$
          </span>
        </div>

        <p className="relative z-10 mt-2 line-clamp-2 px-4 text-sm font-medium text-foreground/90">
          {title}
        </p>

        <div className="relative z-10 flex-1" />

        {/* التعليقات */}
        <div className="relative z-10 max-h-[38%] space-y-2 overflow-y-auto px-3 pb-2">
          {msgs.map((m) => (
            <div
              key={m.id}
              className={`w-fit max-w-[85%] rounded-2xl px-3 py-1.5 text-[13px] backdrop-blur-md ${
                m.star
                  ? "border border-gold/40 bg-gold/10 text-gold"
                  : "bg-background/45 text-foreground/90"
              }`}
            >
              <span className="font-semibold">{m.author}</span>{" "}
              <span className={m.star ? "" : "text-muted-foreground"}>{m.text}</span>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* شريط الأزرار */}
        <form
          onSubmit={send}
          className="relative z-10 flex items-center gap-2 border-t border-border/40 bg-background/60 p-3 backdrop-blur-xl"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب تعليقًا…"
            className="h-10 flex-1 rounded-full border border-border/60 bg-surface-2/60 px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <button
            type="submit"
            aria-label="إرسال"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => sendStars(10)}
            aria-label="إرسال نجوم"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-gold/10 text-gold"
          >
            <Gift className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setHearts((h) => h + 1)}
            aria-label="إعجاب"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-primary/50 bg-primary/10 text-primary"
          >
            <Heart className="h-4 w-4" />
            <span className="absolute -top-2 -start-1 rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
              {formatCount(hearts)}
            </span>
          </button>
        </form>

        <div className="relative z-10 flex items-center justify-between gap-2 bg-background/60 px-4 pb-3 text-[11px] text-muted-foreground backdrop-blur-xl">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-primary" /> {formatNumber(viewers)} يشاهدون الآن
          </span>
          <span>كل 100 نقطة = 1 دولار</span>
        </div>
      </div>
    </div>
  );
}
