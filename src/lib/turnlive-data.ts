import { useSyncExternalStore } from "react";

export type PostKind = "announcement" | "post";

export type Post = {
  id: string;
  kind: PostKind;
  channel: string;
  handle: string;
  title: string;
  body: string;
  category: string;
  date?: string;
  time?: string;
  duration?: string;
  createdAt: string;
};

export const categories = [
  "حوار",
  "تعليم",
  "تقنية",
  "أعمال",
  "رياضة",
  "ثقافة",
] as const;

const initialPosts: Post[] = [
  {
    id: "p-1",
    kind: "announcement",
    channel: "قناة الاستوديو الرئيسي",
    handle: "@studio.main",
    title: "جلسة حوارية مفتوحة حول صناعة المحتوى",
    body: "نقاش مباشر مع الجمهور حول أدوات الإنتاج، إدارة الوقت، وبناء جمهور مستدام. تُفتح الأسئلة خلال آخر عشرين دقيقة.",
    category: "حوار",
    date: "الخميس 14 أغسطس",
    time: "21:00",
    duration: "60 دقيقة",
    createdAt: "قبل 3 ساعات",
  },
  {
    id: "p-2",
    kind: "announcement",
    channel: "مختبر التقنية",
    handle: "@tech.lab",
    title: "مراجعة مباشرة لأدوات البث الاحترافية",
    body: "استعراض عملي لإعدادات الصوت والصورة، مع مقارنة بين ثلاث منظومات إنتاج بميزانيات مختلفة.",
    category: "تقنية",
    date: "الجمعة 15 أغسطس",
    time: "19:30",
    duration: "45 دقيقة",
    createdAt: "قبل يوم",
  },
  {
    id: "p-3",
    kind: "post",
    channel: "غرفة الأعمال",
    handle: "@business.room",
    title: "ملخص البث السابق ومحاور الحلقة القادمة",
    body: "شكرًا لكل من حضر. نشرنا ملخصًا للنقاط الأساسية، والحلقة القادمة ستركز على التسعير وبناء العروض.",
    category: "أعمال",
    createdAt: "قبل يومين",
  },
];

let posts: Post[] = initialPosts;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function addPost(input: Omit<Post, "id" | "createdAt">) {
  posts = [
    { ...input, id: `p-${Date.now()}`, createdAt: "الآن" },
    ...posts,
  ];
  emit();
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

export function formatNumber(n: number) {
  return n.toLocaleString("en-US");
}
