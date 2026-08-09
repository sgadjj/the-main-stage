import upcoming1 from "@/assets/upcoming-1.jpg";
import upcoming2 from "@/assets/upcoming-2.jpg";
import upcoming3 from "@/assets/upcoming-3.jpg";

export type Upcoming = {
  slug: string;
  name: string;
  title: string;
  category: string;
  day: string;
  time: string;
  startsIn: string;
  interested: number;
  image: string;
  promoted?: boolean;
};

export const upcomingStreams: Upcoming[] = [
  {
    slug: "zainab-live",
    name: "زينب",
    title: "لقاء مباشر مع الجمهور",
    category: "Entertainment",
    day: "الخميس",
    time: "21:00",
    startsIn: "يبدأ بعد 5 ساعات",
    interested: 8420,
    image: upcoming1,
    promoted: true,
  },
  {
    slug: "omar-night",
    name: "عمر",
    title: "ليلة موسيقى حية",
    category: "Music",
    day: "الخميس",
    time: "22:30",
    startsIn: "يبدأ بعد 7 ساعات",
    interested: 3110,
    image: upcoming2,
  },
  {
    slug: "kenji-plays",
    name: "Kenji",
    title: "Speedrun Challenge",
    category: "Gaming",
    day: "الجمعة",
    time: "19:00",
    startsIn: "يبدأ بعد يوم",
    interested: 1985,
    image: upcoming3,
  },
];

export type QueueSlot = {
  time: string;
  name: string;
  category: string;
  duration: string;
  tier: string;
  score: number;
  state: "done" | "live" | "next" | "open";
};

export const queueDay = "الخميس";

export const queueSlots: QueueSlot[] = [
  { time: "18:00", name: "Creator A", category: "Talk", duration: "30 دقيقة", tier: "🔵 مؤهل", score: 68, state: "done" },
  { time: "19:00", name: "Creator B", category: "Music", duration: "60 دقيقة", tier: "🟣 جيد", score: 77, state: "done" },
  { time: "20:00", name: "زينب", category: "Entertainment", duration: "ساعتان", tier: "🟡 متميز", score: 91, state: "live" },
  { time: "21:00", name: "Creator X", category: "Gaming", duration: "30 دقيقة", tier: "🔵 مؤهل", score: 64, state: "next" },
  { time: "21:30", name: "Slot متاح", category: "—", duration: "15 دقيقة", tier: "🟢 جديد", score: 0, state: "open" },
  { time: "22:30", name: "عمر", category: "Music", duration: "60 دقيقة", tier: "🟣 جيد", score: 82, state: "open" },
];

export const tiers = [
  { icon: "🟢", label: "جديد", time: "10–15 دقيقة" },
  { icon: "🔵", label: "مؤهل", time: "30 دقيقة" },
  { icon: "🟣", label: "جيد", time: "60 دقيقة" },
  { icon: "🟡", label: "متميز", time: "ساعتان" },
  { icon: "⭐", label: "مشاهير / أحداث خاصة", time: "حسب الاتفاق" },
];

export const creditPacks = [
  { amount: 100, price: "0.99$" },
  { amount: 1000, price: "8.99$", popular: true },
  { amount: 10000, price: "79.99$" },
];

export function formatNumber(n: number) {
  return n.toLocaleString("en-US");
}
