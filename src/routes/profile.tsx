import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addPost, categories, usePosts, type PostKind } from "@/lib/turnlive-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "الملف الشخصي ونشر الإعلانات — TURNLIVE" },
      {
        name: "description",
        content: "أدر ملف قناتك وانشر إعلان بث جديد أو منشورًا عامًا لجمهور TURNLIVE.",
      },
      { property: "og:title", content: "الملف الشخصي ونشر الإعلانات — TURNLIVE" },
      {
        property: "og:description",
        content: "انشر إعلان بثك القادم بتفاصيله من ملفك الشخصي على TURNLIVE.",
      },
    ],
  }),
  component: ProfilePage,
});

const channel = "قناة الاستوديو الرئيسي";
const handle = "@studio.main";

function ProfilePage() {
  const navigate = useNavigate();
  const posts = usePosts();
  const mine = posts.filter((p) => p.handle === handle);

  const [kind, setKind] = useState<PostKind>("announcement");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<string>(categories[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("يرجى إدخال العنوان والتفاصيل");
      return;
    }
    addPost({
      kind,
      channel,
      handle,
      title: title.trim(),
      body: body.trim(),
      category,
      ...(kind === "announcement" ? { date, time, duration } : {}),
    });
    toast.success(kind === "announcement" ? "تم نشر الإعلان" : "تم نشر المنشور");
    setTitle("");
    setBody("");
    setDate("");
    setTime("");
    setDuration("");
    navigate({ to: "/announcements" });
  }

  return (
    <AppShell>
      <section className="panel flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface-2 font-display text-lg text-foreground">
            TL
          </div>
          <div>
            <h1 className="font-display text-2xl text-foreground">{channel}</h1>
            <p className="text-sm text-muted-foreground">{handle} · حساب موثّق</p>
          </div>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <p className="font-display text-2xl text-foreground">{mine.length}</p>
            <p className="text-xs text-muted-foreground">منشوراتي</p>
          </div>
          <div>
            <p className="font-display text-2xl text-foreground">12</p>
            <p className="text-xs text-muted-foreground">بثوث سابقة</p>
          </div>
        </div>
      </section>

      <section className="panel mt-5 p-6">
        <h2 className="font-display text-xl text-foreground">نشر جديد</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          اختر نوع النشر: إعلان عن بث قادم بتفاصيله، أو منشور عام.
        </p>

        <form onSubmit={onSubmit} className="mt-5 grid gap-4">
          <div className="flex gap-2">
            {(
              [
                ["announcement", "إعلان بث"],
                ["post", "منشور"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setKind(value)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  kind === value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">العنوان</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان واضح ومختصر"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="body">التفاصيل</Label>
            <Textarea
              id="body"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="محاور البث أو نص المنشور"
            />
          </div>

          <div className="grid gap-2 sm:max-w-xs">
            <Label>التصنيف</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {kind === "announcement" && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="date">التاريخ</Label>
                <Input
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="الخميس 14 أغسطس"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">الوقت</Label>
                <Input
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="21:00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">المدة</Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="60 دقيقة"
                />
              </div>
            </div>
          )}

          <div>
            <Button type="submit">نشر</Button>
          </div>
        </form>
      </section>

      <section className="panel mt-5 p-6">
        <h2 className="font-display text-xl text-foreground">منشوراتي</h2>
        {mine.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">لا توجد منشورات بعد.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {mine.map((p) => (
              <li key={p.id} className="rounded-xl border border-border/70 bg-surface-2/40 p-4">
                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span>{p.kind === "announcement" ? "إعلان بث" : "منشور"}</span>
                  <span>{p.createdAt}</span>
                </div>
                <p className="mt-2 font-medium text-foreground">{p.title}</p>
                {p.date && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {p.date} · {p.time} · {p.duration}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
