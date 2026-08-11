import { useSyncExternalStore } from "react";

export type PostKind = "announcement" | "post";

export type Comment = {
  id: string;
  author: string;
  handle: string;
  text: string;
  at: string;
};

export type Post = {
  id: string;
  kind: PostKind;
  channel: string;
  handle: string;
  avatar: string;
  title: string;
  body: string;
  category: string;
  image?: string;
  date?: string;
  time?: string;
  duration?: string;
  createdAt: string;
  likes: number;
  liked: boolean;
  shares: number;
  reminded: boolean;
  comments: Comment[];
};

export type Account = {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  points: number;
};

export const categories = [
  "حوار",
  "تعليم",
  "تقنية",
  "أعمال",
  "رياضة",
  "ثقافة",
] as const;

/* ---------- نظام النقاط: كل 100 نقطة = 1 دولار ---------- */
export const POINTS_PER_USD = 100;
export function pointsToUsd(points: number) {
  return (points / POINTS_PER_USD).toFixed(2);
}

/* ---------- الحساب ---------- */
const ACCOUNT_KEY = "turnlive.account";

function readAccount(): Account | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ACCOUNT_KEY);
    return raw ? (JSON.parse(raw) as Account) : null;
  } catch {
    return null;
  }
}

let account: Account | null = null;
let accountLoaded = false;
const accountListeners = new Set<() => void>();

function emitAccount() {
  accountListeners.forEach((l) => l());
}

export function ensureAccountLoaded() {
  if (accountLoaded) return;
  accountLoaded = true;
  account = readAccount();
  emitAccount();
}

export function saveAccount(next: Account) {
  account = next;
  accountLoaded = true;
  try {
    window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  emitAccount();
}

export function signOut() {
  account = null;
  try {
    window.localStorage.removeItem(ACCOUNT_KEY);
  } catch {
    /* ignore */
  }
  emitAccount();
}

export function useAccount() {
  return useSyncExternalStore(
    (cb) => {
      accountListeners.add(cb);
      return () => accountListeners.delete(cb);
    },
    () => account,
    () => null,
  );
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0] ?? "").join("") || "TL";
}

/* ---------- المنشورات ---------- */
const initialPosts: Post[] = [
  {
    id: "p-1",
    kind: "announcement",
    channel: "قناة الاستوديو الرئيسي",
    handle: "@studio.main",
    avatar: "SM",
    title: "حوار مباشر — مستقبل الذكاء الاصطناعي",
    body: "نقاش مفتوح مع الجمهور حول أثر الذكاء الاصطناعي على صناعة المحتوى، مع أسئلة مباشرة في آخر عشرين دقيقة.",
    category: "تقنية",
    date: "الخميس 14 أغسطس",
    time: "20:00",
    duration: "60 دقيقة",
    createdAt: "قبل 3 ساعات",
    likes: 1243,
    liked: false,
    shares: 96,
    reminded: false,
    comments: [
      {
        id: "c-1",
        author: "مختبر التقنية",
        handle: "@tech.lab",
        text: "موضوع مهم، سنحضر.",
        at: "قبل ساعة",
      },
    ],
  },
  {
    id: "p-2",
    kind: "announcement",
    channel: "مختبر التقنية",
    handle: "@tech.lab",
    avatar: "TL",
    title: "مراجعة مباشرة لأدوات البث الاحترافية",
    body: "استعراض عملي لإعدادات الصوت والصورة ومقارنة بين ثلاث منظومات إنتاج بميزانيات مختلفة.",
    category: "تقنية",
    date: "الجمعة 15 أغسطس",
    time: "19:30",
    duration: "45 دقيقة",
    createdAt: "قبل يوم",
    likes: 842,
    liked: false,
    shares: 41,
    reminded: false,
    comments: [],
  },
  {
    id: "p-3",
    kind: "post",
    channel: "غرفة الأعمال",
    handle: "@business.room",
    avatar: "BR",
    title: "ملخص البث السابق",
    body: "شكرًا لكل من حضر. نشرنا ملخص النقاط الأساسية، والحلقة القادمة ستركز على التسعير وبناء العروض.",
    category: "أعمال",
    createdAt: "قبل يومين",
    likes: 318,
    liked: false,
    shares: 12,
    reminded: false,
    comments: [],
  },
];

let posts: Post[] = initialPosts;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function update(id: string, fn: (p: Post) => Post) {
  posts = posts.map((p) => (p.id === id ? fn(p) : p));
  emit();
}

export function addPost(
  input: Omit<
    Post,
    "id" | "createdAt" | "likes" | "liked" | "shares" | "reminded" | "comments"
  >,
) {
  posts = [
    {
      ...input,
      id: `p-${Date.now()}`,
      createdAt: "الآن",
      likes: 0,
      liked: false,
      shares: 0,
      reminded: false,
      comments: [],
    },
    ...posts,
  ];
  emit();
}

export function toggleLike(id: string) {
  update(id, (p) => ({
    ...p,
    liked: !p.liked,
    likes: p.likes + (p.liked ? -1 : 1),
  }));
}

export function toggleReminder(id: string) {
  update(id, (p) => ({ ...p, reminded: !p.reminded }));
}

export function sharePost(id: string) {
  update(id, (p) => ({ ...p, shares: p.shares + 1 }));
}

export function addComment(id: string, comment: Omit<Comment, "id" | "at">) {
  update(id, (p) => ({
    ...p,
    comments: [...p.comments, { ...comment, id: `c-${Date.now()}`, at: "الآن" }],
  }));
}

export function usePosts() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => posts,
    () => posts,
  );
}

export const liveNow = {
  channel: "قناة الاستوديو الرئيسي",
  handle: "@studio.main",
  title: "جلسة حوارية مفتوحة حول صناعة المحتوى",
  category: "حوار",
  startedAt: "20:00",
  remainingSeconds: 18 * 60 + 32,
  viewers: 184521,
};

export const nextUp = {
  channel: "مختبر التقنية",
  handle: "@tech.lab",
  time: "21:00",
  duration: "45 دقيقة",
};

export function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

export function formatNumber(n: number) {
  return n.toLocaleString("en-US");
}
