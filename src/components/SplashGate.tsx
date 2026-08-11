import { useEffect, useState, type ReactNode } from "react";
import { ensureAccountLoaded, saveAccount, useAccount, initials } from "@/lib/turnlive-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Splash() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <div className="flex items-center gap-3">
        <span className="live-dot" />
        <span className="font-display text-5xl tracking-[0.22em] text-foreground">
          TURN<span className="text-primary">LIVE</span>
        </span>
      </div>
      <p className="mt-4 text-xs tracking-[0.35em] text-muted-foreground">
        YOUR TURN. THE WORLD WATCHES.
      </p>
    </div>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanHandle = handle.trim().replace(/^@/, "");
    if (!cleanName || !cleanHandle) {
      setError("يرجى إدخال الاسم والمعرّف");
      return;
    }
    saveAccount({
      name: cleanName,
      handle: `@${cleanHandle}`,
      avatar: initials(cleanName),
      bio: "صانع محتوى على TURNLIVE",
      points: 250,
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="panel w-full max-w-md p-7">
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="font-display text-2xl tracking-[0.18em] text-foreground">
            TURN<span className="text-primary">LIVE</span>
          </span>
        </div>
        <h1 className="mt-5 font-display text-2xl text-foreground">
          {mode === "signup" ? "إنشاء حساب" : "تسجيل الدخول"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          خطوة واحدة فقط، ولن تظهر هذه الشاشة مرة أخرى على هذا الجهاز.
        </p>

        <form onSubmit={submit} className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">اسم القناة</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="قناة الاستوديو"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="handle">المعرّف</Label>
            <Input
              id="handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="studio.main"
            />
            <p className="text-xs text-muted-foreground">turnlive.app/{handle || "username"}</p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            {mode === "signup" ? "إنشاء الحساب والدخول" : "دخول"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signup" ? "login" : "signup")}
          className="mt-4 w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {mode === "signup" ? "لدي حساب بالفعل" : "إنشاء حساب جديد"}
        </button>
      </div>
    </div>
  );
}

export function SplashGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [splash, setSplash] = useState(true);
  const account = useAccount();

  useEffect(() => {
    ensureAccountLoaded();
    setReady(true);
    const t = setTimeout(() => setSplash(false), 1600);
    return () => clearTimeout(t);
  }, []);

  if (!ready || splash) return <Splash />;
  if (!account) return <AuthScreen />;
  return <>{children}</>;
}
