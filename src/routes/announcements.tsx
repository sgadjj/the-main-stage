import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Clock, Timer } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { usePosts, type Post } from "@/lib/turnlive-data";

export const Route = createFileRoute("/announcements")({
  head: () => ({
    meta: [
      { title: "إعلانات ومنشورات البث — TURNLIVE" },
      {
        name: "description",
        content:
          "لوحة الإعلانات الرسمية: مواعيد البثوث القادمة وتفاصيلها إضافة إلى منشورات صناع المحتوى.",
      },
      { property: "og:title", content: "إعلانات ومنشورات البث — TURNLIVE" },
      {
        property: "og:description",
        content: "تعرّف على موعد البث القادم وتفاصيله من صفحة الإعلانات في TURNLIVE.",
      },
    ],
  }),
  component: AnnouncementsPage,
});

function AnnouncementsPage() {
  const posts = usePosts();
  const announcements = posts.filter((p) => p.kind === "announcement");
  const updates = posts.filter((p) => p.kind === "post");

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">الإعلانات والمنشورات</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            كل إعلان يوضح موعد البث ومدته ومحاوره، والمنشورات للتحديثات العامة.
          </p>
        </div>
        <Link
          to="/profile"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          نشر إعلان جديد
        </Link>
      </div>

      <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        إعلانات البث القادمة
      </h2>
      <div className="mt-3 grid gap-4">
        {announcements.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        منشورات
      </h2>
      <div className="mt-3 grid gap-4">
        {updates.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </AppShell>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">
          {post.channel} <span className="text-muted-foreground">{post.handle}</span>
        </span>
        <span>{post.createdAt}</span>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground">{post.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.body}</p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="rounded-full border border-border/70 px-3 py-1">{post.category}</span>
        {post.date && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1">
            <CalendarDays className="h-3.5 w-3.5 text-primary" /> {post.date}
          </span>
        )}
        {post.time && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1">
            <Clock className="h-3.5 w-3.5 text-primary" /> {post.time}
          </span>
        )}
        {post.duration && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1">
            <Timer className="h-3.5 w-3.5 text-primary" /> {post.duration}
          </span>
        )}
      </div>
    </article>
  );
}
