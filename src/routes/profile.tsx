import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "الملف الشخصي و Creator Score — TURNLIVE" },
      {
        name: "description",
        content: "تابع Creator Score، مستواك، وقت البث الممنوح، والمكافآت على TURNLIVE.",
      },
      { property: "og:title", content: "PROFILE — TURNLIVE" },
      { property: "og:description", content: "مستواك يحدد وقت بثك على TURNLIVE." },
    ],
  }),
  component: ProfilePage,
});

const metrics = [
  ["👁️ المشاهدون الحقيقيون", 88],
  ["⏱️ مدة المشاهدة", 74],
  ["🔄 عودة المشاهدين", 69],
  ["❤️ التفاعل", 92],
  ["🎁 الدعم", 81],
  ["🛡️ الالتزام بالقواعد", 100],
] as const;

function ProfilePage() {
  return (
    <AppShell>
      <section className="panel flex items-center gap-4 p-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 font-display text-2xl text-primary">
          ز
        </div>
        <div className="flex-1">
          <h1 className="font-display text-2xl">زينب</h1>
          <p className="text-xs text-muted-foreground">🎤 Entertainment · 🟡 متميز</p>
        </div>
        <div className="text-center">
          <p className="font-display text-3xl text-gold">91</p>
          <p className="text-[10px] text-muted-foreground">Creator Score</p>
        </div>
      </section>

      <section className="panel mt-4 grid gap-3 p-4">
        <h2 className="font-display text-xl">تقييم الأداء</h2>
        {metrics.map(([label, value]) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-xs">
              <span>{label}</span>
              <span className="text-muted-foreground">{value}</span>
            </div>
            <Progress value={value} className="h-1.5" />
          </div>
        ))}
      </section>

      <section className="panel mt-4 p-4">
        <h2 className="font-display text-xl">مزايا مستواك</h2>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <li className="rounded-lg bg-surface-2/40 px-3 py-2">⏱️ وقت بث حتى ساعتين</li>
          <li className="rounded-lg bg-surface-2/40 px-3 py-2">🕘 أوقات ذروة أفضل</li>
          <li className="rounded-lg bg-surface-2/40 px-3 py-2">📣 ترويج أكبر في Upcoming</li>
          <li className="rounded-lg bg-surface-2/40 px-3 py-2">🎁 مكافآت وأحداث خاصة</li>
        </ul>
      </section>

      <section className="panel mt-4 p-4">
        <h2 className="font-display text-xl">🔔 التذكيرات</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="rounded-lg bg-surface-2/40 px-3 py-2">
            بث عمر يبدأ بعد 7 ساعات — الخميس 22:30
          </li>
          <li className="rounded-lg bg-surface-2/40 px-3 py-2">
            Kenji Speedrun — الجمعة 19:00
          </li>
        </ul>
        <Button variant="outline" className="mt-3 w-full">
          إدارة الإشعارات
        </Button>
      </section>
    </AppShell>
  );
}
