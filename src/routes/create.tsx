import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "احجز بثك القادم — TURNLIVE" },
      {
        name: "description",
        content: "قدّم طلب بث واحجز موعدك في طابور TURNLIVE: العنوان، الوصف، التاريخ والوقت.",
      },
      { property: "og:title", content: "CREATE LIVE — TURNLIVE" },
      { property: "og:description", content: "دورك يبدأ بطلب بث. احجز موعدك على TURNLIVE." },
    ],
  }),
  component: CreatePage,
});

function CreatePage() {
  const [title, setTitle] = useState("");

  return (
    <AppShell>
      <h1 className="font-display text-3xl">🎥 CREATE LIVE</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        لا يمكن فتح بث عشوائي — قدّم طلبك وستحدد المنصة موعدك حسب Creator Score.
      </p>

      <form
        className="panel mt-4 grid gap-4 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("تم إرسال طلب البث", {
            description: "ستراجع TURNLIVE طلبك وتخصص لك Slot في الطابور.",
          });
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="title">عنوان البث</Label>
          <Input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="لقاء مباشر مع الجمهور"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="desc">وصف قصير</Label>
          <Textarea id="desc" rows={3} placeholder="عن ماذا سيكون البث؟" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="date">التاريخ</Label>
            <Input id="date" type="date" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="time">الوقت</Label>
            <Input id="time" type="time" required />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="cat">نوع المحتوى</Label>
            <Input id="cat" placeholder="Entertainment / Music / Gaming" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="social">روابط حساباتك</Label>
            <Input id="social" placeholder="instagram.com/username" />
          </div>
        </div>
        <div className="rounded-lg bg-surface-2/40 p-3 text-xs text-muted-foreground">
          مستواك الحالي: 🔵 مؤهل — المدة المتاحة لطلبك: <strong>30 دقيقة</strong>. رابط بثك:
          turnlive.app/your-live
        </div>
        <Button type="submit" className="w-full">
          إرسال الطلب
        </Button>
      </form>

      <section className="panel mt-4 p-4">
        <h2 className="font-display text-xl">المنافسة على الـ Slot</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          لا يمكن شراء البث الحالي أو طرد أحد. عند تعدد الطلبات على نفس الموعد، تختار TURNLIVE وفق:
          Creator Score + جودة المحتوى + الأداء السابق + الجمهور المتوقع + الالتزام بالقواعد.
        </p>
      </section>
    </AppShell>
  );
}
