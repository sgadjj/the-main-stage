import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  CalendarClock,
  ImagePlus,
  LogOut,
  Pencil,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";
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
  nextAvailableSlot,
  systemSlots,
  type PostKind,
} from "@/lib/turnlive-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "حسابي — TURNLIVE" },
      {
        name: "description",
        content:
          "صفحة المستخدم: تعديل الملف ورفع صورة من جهازك، نشر إعلان بث بموعد يحدده النظام، ورصيد النجوم.",
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

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read-error"));
    reader.readAsDataURL(file);
  });
}

function ProfilePage() {
  const navigate = useNavigate();
  const account = useAccount();
  const posts = usePosts();

  const [kind, setKind] = useState<PostKind>("announcement");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState<string>(categories[0]);
  const [slotId, setSlotId] = useState(nextAvailableSlot()?.id ?? "");

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(account?.name ?? "");
  const [bio, setBio] = useState(account?.bio ?? "");
  const avatarInput = useRef<HTMLInputElement>(null);
  const postImageInput = useRef<HTMLInputElement>(null);

  if (!account) return null;
  const mine = posts.filter((p) => p.handle === account.handle);
  const slot = systemSlots.find((s) => s.id === slotId);
  const openSlots = systemSlots.filter((s) => !s.taken);

  async function onPickAvatar(file?: File) {
    if (!file || !account) return;
    if (!file.type.startsWith("image/")) return toast.error("اختر ملف صورة");
    const url = await readFile(file);
    saveAccount({ ...account, avatarUrl: url });
    toast.success("تم تحديث صورة الحساب");
  }

  async function onPickPostImage(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("اختر ملف صورة");
    setImage(await readFile(file));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!account) return;
    if (!title.trim() || !body.trim()) {
      toast.error("يرجى إدخال العنوان والتفاصيل");
      return;
    }
    if (kind === "announcement" && !slot) {
      toast.error("لا يوجد موعد متاح حاليًا في الطابور");
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
      ...(image ? { image } : {}),
      ...(kind === "announcement" && slot
        ? { date: slot.date, time: slot.time, duration: slot.duration }
        : {}),
    });
    toast.success(kind === "announcement" ? "تم حجز موعدك ونشر الإعلان" : "تم نشر المنشور");
    setTitle("");
    setBody("");
    setImage("");
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
      {/* ترويسة الملف */}
      <section className="panel overflow-hidden">
        <div className="h-24 bg-[linear-gradient(120deg,oklch(0.30_0.09_25),oklch(0.18_0.02_20))]" />
        <div className="-mt-10 flex flex-wrap items-end justify-between gap-4 p-6">
          <div className="flex items-end gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface-2 font-display text-2xl text-foreground">
                {account.avatarUrl ? (
                  <img src={account.avatarUrl} alt={account.name} className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <button
                type="button"
                onClick={() => avatarInput.current?.click()}
                aria-label="تغيير صورة الحساب"
                className="absolute -bottom-2 -end-2 rounded-full border border-border bg-background p-2 text-primary transition-colors hover:bg-surface-2"
              >
                <ImagePlus className="h-3.5 w-3.5" />
              </button>
              <input
                ref={avatarInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void onPickAvatar(e.target.files?.[0])}
              />
            </div>

            <div className="pb-1">
              <h1 className="flex items-center gap-2 font-display text-2xl text-foreground">
                {account.name}
                <BadgeCheck className="h-5 w-5 text-primary" />
              </h1>
              <p className="text-sm text-muted-foreground">
                {account.handle} · turnlive.app/{account.handle.replace("@", "")}
              </p>
              {account.bio && <p className="mt-1 text-sm text-muted-foreground">{account.bio}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-surface-2"
            >
              <Pencil className="h-3.5 w-3.5" /> تعديل الملف
            </button>
            <button
              type="button"
              onClick={signOut}
              aria-label="تسجيل الخروج"
              className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {editing && (
          <div className="grid gap-4 border-t border-border/60 p-6 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">اسم القناة</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">نبذة</Label>
              <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
            <div>
              <Button onClick={saveProfile}>حفظ التغييرات</Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 border-t border-border/60 p-6 text-center">
          <Stat label="منشوراتي" value={String(mine.length)} />
          <Stat label="بثوث سابقة" value="12" />
          <Stat
            label={`النجوم · ${POINTS_PER_USD} نقطة = 1$`}
            value={`${account.points} ★`}
            hint={`≈ ${pointsToUsd(account.points)}$`}
          />
        </div>
      </section>

      {/* الموعد من النظام */}
      <section className="panel mt-5 p-6">
        <h2 className="flex items-center gap-2 font-display text-xl text-foreground">
          <CalendarClock className="h-5 w-5 text-primary" /> موعد بثك في الطابور
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          النظام يحدد المواعيد المتاحة حسب مستواك — لا يمكن اختيار وقت خارج الطابور.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {systemSlots.map((s) => {
            const active = s.id === slotId;
            return (
              <button
                key={s.id}
                type="button"
                disabled={s.taken}
                onClick={() => setSlotId(s.id)}
                className={`rounded-xl border p-4 text-start transition-colors ${
                  s.taken
                    ? "cursor-not-allowed border-border/50 bg-surface-2/20 opacity-50"
                    : active
                      ? "border-primary bg-primary/10"
                      : "border-border/70 bg-surface-2/40 hover:border-primary/60"
                }`}
              >
                <p className="font-display text-xl text-foreground">
                  {s.time} <span className="text-sm text-muted-foreground">· {s.date}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {s.duration} · {s.level}
                </p>
                <p className={`mt-2 text-[11px] ${s.taken ? "text-muted-foreground" : "text-primary"}`}>
                  {s.taken ? "محجوز" : active ? "المحدد لك" : "متاح"}
                </p>
              </button>
            );
          })}
        </div>
        {openSlots.length === 0 && (
          <p className="mt-3 text-sm text-muted-foreground">لا توجد مواعيد متاحة الآن.</p>
        )}
      </section>

      {/* نشر */}
      <section className="panel mt-5 p-6">
        <h2 className="font-display text-xl text-foreground">نشر جديد</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          صور ونصوص فقط — إعلان بث بموعد النظام، أو منشور عام.
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
            <Label>صورة المنشور</Label>
            {image ? (
              <div className="relative overflow-hidden rounded-xl border border-border/70">
                <img src={image} alt="معاينة الصورة" className="max-h-64 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImage("")}
                  aria-label="حذف الصورة"
                  className="absolute top-2 end-2 rounded-full border border-border bg-background/80 p-2 text-foreground backdrop-blur"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => postImageInput.current?.click()}
                className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <ImagePlus className="h-5 w-5 text-primary" />
                اختر صورة من جهازك
              </button>
            )}
            <input
              ref={postImageInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => void onPickPostImage(e.target.files?.[0])}
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
            <div className="rounded-xl border border-border/70 bg-surface-2/40 p-4 text-sm">
              <p className="text-muted-foreground">الموعد الذي منحه لك النظام</p>
              <p className="mt-1 font-display text-lg text-foreground">
                {slot ? `${slot.date} · ${slot.time} · ${slot.duration}` : "لا يوجد موعد متاح"}
              </p>
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
