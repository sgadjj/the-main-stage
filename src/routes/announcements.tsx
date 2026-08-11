import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Bell, BellRing, CalendarDays, Clock, Heart, MessageCircle, Share2, Timer } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import {
  usePosts,
  useAccount,
  toggleLike,
  toggleReminder,
  sharePost,
  addComment,
  formatCount,
  type Post,
} from "@/lib/turnlive-data";

export const Route = createFileRoute("/announcements")({
  head: () => ({
    meta: [
      { title: "المنشورات والإعلانات — TURNLIVE" },
      {
        name: "description",
        content:
          "تدفق منشورات صناع المحتوى: صور ونصوص وإعلانات بث بمواعيدها، مع إعجاب وتعليق ومشاركة.",
      },
      { property: "og:title", content: "المنشورات والإعلانات — TURNLIVE" },
      {
        property: "og:description",
        content: "تابع منشورات القنوات وإعلانات البث القادمة على TURNLIVE.",
      },
    ],
  }),
  component: FeedPage,
});

function FeedPage() {
  const posts = usePosts();

  return (
    <AppShell>
      <h1 className="font-display text-3xl text-foreground">المنشورات</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        صور ونصوص فقط — المنشور يروّج للبث، والبث يبقى في صفحة LIVE.
      </p>

      <div className="mt-6 grid gap-5">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </AppShell>
  );
}

function PostCard({ post }: { post: Post }) {
  const account = useAccount();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !account) return;
    addComment(post.id, { author: account.name, handle: account.handle, text: text.trim() });
    setText("");
  }

  return (
    <article className="panel overflow-hidden">
      <div className="flex items-center gap-3 p-5 pb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-2 text-xs font-bold text-foreground">
          {post.avatar}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{post.channel}</p>
          <p className="text-xs text-muted-foreground">
            {post.handle} · {post.createdAt}
          </p>
        </div>
      </div>

      <div className="px-5">
        <h2 className="text-lg font-semibold leading-snug text-foreground">{post.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.body}</p>
      </div>

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="mt-4 max-h-[420px] w-full border-y border-border/60 object-cover"
        />
      )}

      {post.kind === "announcement" && (
        <div className="mx-5 mt-4 rounded-xl border border-border/70 bg-surface-2/40 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <span className="live-dot" /> إعلان بث
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
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
          <button
            type="button"
            onClick={() => {
              toggleReminder(post.id);
              toast.success(post.reminded ? "تم إلغاء التذكير" : "سنذكّرك قبل البث");
            }}
            className={`mt-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              post.reminded
                ? "bg-primary text-primary-foreground"
                : "border border-border text-foreground hover:bg-surface-2"
            }`}
          >
            {post.reminded ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
            {post.reminded ? "تم التذكير" : "ذكّرني"}
          </button>
        </div>
      )}

      <div className="mt-4 flex items-center gap-5 border-t border-border/60 px-5 py-3 text-sm text-muted-foreground">
        <button
          type="button"
          onClick={() => toggleLike(post.id)}
          className={`inline-flex items-center gap-1.5 transition-colors hover:text-foreground ${
            post.liked ? "text-primary" : ""
          }`}
        >
          <Heart className={`h-4 w-4 ${post.liked ? "fill-current" : ""}`} />
          {formatCount(post.likes)}
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          <MessageCircle className="h-4 w-4" />
          {formatCount(post.comments.length)}
        </button>
        <button
          type="button"
          onClick={() => {
            sharePost(post.id);
            toast.success("تم نسخ رابط المنشور");
          }}
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          <Share2 className="h-4 w-4" />
          {formatCount(post.shares)}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 px-5 py-4">
          <ul className="grid gap-3">
            {post.comments.length === 0 && (
              <li className="text-sm text-muted-foreground">لا توجد تعليقات بعد.</li>
            )}
            {post.comments.map((c) => (
              <li key={c.id} className="text-sm">
                <span className="font-medium text-foreground">{c.author}</span>{" "}
                <span className="text-xs text-muted-foreground">
                  {c.handle} · {c.at}
                </span>
                <p className="text-muted-foreground">{c.text}</p>
              </li>
            ))}
          </ul>
          <form onSubmit={submitComment} className="mt-4 flex gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="اكتب تعليقًا"
            />
            <button
              type="submit"
              className="rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              إرسال
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
