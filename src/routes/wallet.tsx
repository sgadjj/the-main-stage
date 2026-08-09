import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { creditPacks, formatNumber } from "@/lib/turnlive-data";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "المحفظة والنقاط — TURNLIVE" },
      {
        name: "description",
        content: "اشترِ Credits، ادعم صانعي المحتوى، وتابع أرباحك القابلة للسحب على TURNLIVE.",
      },
      { property: "og:title", content: "WALLET — TURNLIVE" },
      { property: "og:description", content: "النقاط، الدعم والأرباح في مكان واحد." },
    ],
  }),
  component: WalletPage,
});

function WalletPage() {
  const [balance, setBalance] = useState(2450);

  return (
    <AppShell>
      <h1 className="font-display text-3xl">💎 WALLET</h1>

      <div className="panel mt-4 grid gap-1 p-5 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">رصيدك</p>
        <p className="font-display text-5xl text-primary">{formatNumber(balance)}</p>
        <p className="text-xs text-muted-foreground">Credits</p>
      </div>

      <h2 className="mt-5 font-display text-xl">شراء Credits</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {creditPacks.map((p) => (
          <button
            key={p.amount}
            onClick={() => {
              setBalance((b) => b + p.amount);
              toast.success(`تمت إضافة ${formatNumber(p.amount)} Credits`);
            }}
            className={`panel p-4 text-center transition-transform hover:-translate-y-1 ${
              p.popular ? "border-primary/60" : ""
            }`}
          >
            <p className="text-2xl">🎁</p>
            <p className="font-display text-2xl">{formatNumber(p.amount)}</p>
            <p className="text-xs text-muted-foreground">{p.price}</p>
            {p.popular && (
              <span className="mt-2 inline-block rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                الأكثر شيوعًا
              </span>
            )}
          </button>
        ))}
      </div>

      <section className="panel mt-5 grid gap-3 p-4">
        <h2 className="font-display text-xl">أرباح صانع المحتوى</h2>
        <div className="grid grid-cols-3 gap-2 text-center">
          <Box label="دعم هذا الشهر" value="128,400" />
          <Box label="رصيد قابل للسحب" value="$412" />
          <Box label="نسبة المنصة" value="20%" />
        </div>
        <Button variant="outline" onClick={() => toast("سيتم فتح السحب عند بلوغ الحد الأدنى")}>
          طلب سحب
        </Button>
      </section>

      <section className="panel mt-4 p-4">
        <h2 className="font-display text-xl">آخر العمليات</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {[
            { label: "دعم زينب", amount: "-1,000" },
            { label: "شراء Credits", amount: "+1,000" },
            { label: "دعم Kenji", amount: "-250" },
          ].map(({ label, amount }) => (
            <li
              key={label}
              className="flex items-center justify-between rounded-lg bg-surface-2/40 px-3 py-2"
            >
              <span>{label}</span>
              <span className={amount.startsWith("+") ? "text-gold" : "text-muted-foreground"}>
                {amount}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface-2/50 px-2 py-3">
      <p className="font-display text-xl">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
