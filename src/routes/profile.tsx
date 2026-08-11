import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Radio, Star, LogOut } from "lucide-react";
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
import {
  addPost,
  categories,
  usePosts,
  useAccount,
  saveAccount,
  signOut,
  initials,
  pointsToUsd,
  POINTS_PER_USD,
  type PostKind,
} from "@/lib/turnlive-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "حسابي — TURNLIVE" },
      {
        name: "description",
        content: "صفحة المستخدم: تعديل الملف، نشر منشور أو إعلان بث، ورصيد النجوم القابل للتحويل.",
      },
      { property: "og:title", content: "حسابي — TURNLIVE" },
      {
        property: "og:description",
        content: "أدر ملفك وانشر إعلان بثك القادم من حسابك على TURNLIVE.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const account = useAccount();
  const posts = usePosts();

  const [kind, setKind] = useState<PostKind>("announcement");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState<string>(categories[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(account?.name ?? "");
  const [bio, setBio] = useState(account?.bio ?? "");

  if (!account) return null;
  const mine = posts.filter((p) => p.handle === account.handle);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!account) return;
    if (!title.trim() || !body.trim()) {
      toast.error("يرجى إدخال العنوان والتفاصيل");
      return;
    }
    addPost({
      kind,
      channel: account.name,
      handle: account.handle,
      avatar: account.avatar,
      title: title.trim(),
      body: body.trim(),
      category,
      ...(image.trim() ? { image: image.trim() } : {}),
      ...(kind === "announcement" ? { date, time, duration } : {}),
    });
    toast.success(kind === "announcement" ? "تم نشر الإعلان" : "تم نشر المنشور");
    setTitle("");
    setBody("");
    setImage("");
    setDate("");
    setTime("");
    setDuration("");
    navigate({ to: "/announcements" });
  }

  function saveProfile() {
    if (!account) return;
    const cleanName = name.trim() || account.name;
    saveAccount({ ...account, name: cleanName, avatar: initials(cleanName), bio: bio.trim() });
    setEditing(false);
    toast.success("تم تحديث الملف");
  }

  return (
    <AppShell>
      <section className="panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface-2 font-display text-lg text-foreground">
              {account.avatar}
            </div>
            <div>
              <h1 className="font-display text-2xl text-foreground">{account.name}</h1>
              <p className="text-sm text-muted-foreground">
                {account.handle} · turnlive.app/{account.handle.replace("@", "")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{account.bio}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/studio"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Radio className="h-4 w-4" /> بدء بث
            </Link>
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-surface-2"
            >
              تعديل الملف
            </button>
            <button
              type="button"
              onClick={signOut}
              aria-label="خروج"
              className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {editing && (
          <div className="mt-5 grid gap-4 border-t border-border/60 pt-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">اسم القناة</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">نبذة</Label>
              <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
            <div>
              <Button onClick={saveProfile}>حفظ</Button>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <Stat label="منشوراتي" value={String(mine.length)} />
          <Stat label="بثوث سابقة" value="12" />
          <Stat
            label={`النجوم · ${POINTS_PER_USD} نقطة = 1$`}
            value={`${account.points} ★`}
            hint={`≈ ${pointsToUsd(account.points)}$`}
          />
        </div>
      </section>

      <section className="panel mt-5 p-6">
        <h2 className="font-display text-xl text-foreground">نشر جديد</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          صور ونصوص فقط — إعلان بث بموعده أو منشور عام.
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
            <Label htmlFor="body">النص</Label>
            <Textarea
              id="body"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="محاور البث أو نص المنشور"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">رابط الصورة (اختياري)</Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
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
                  placeholder="20:00"
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

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface-2/40 px-3 py-4">
      <p className="font-display text-2xl leading-none text-foreground">{value}</p>
      <p className="mt-2 text-[11px] text-muted-foreground">{label}</p>
      {hint && (
        <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-gold">
          <Star className="h-3 w-3" /> {hint}
        </p>
      )}
    </div>
  );
}
