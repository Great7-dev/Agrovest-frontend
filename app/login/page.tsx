"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { j } from "@/lib/api";
import { saveSession, User } from "@/lib/auth";

const inp =
  "w-full rounded-xl border border-leaf/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-leaf focus:ring-4 focus:ring-lime/60";

const quotes = [
  ["🌱", "Grow trust, one harvest at a time."],
  ["🔗", "Every handoff sealed. Every claim proven."],
  ["🤝", "Fair prices, straight from the farmer."],
];
const chain = ["🌱", "🔍", "🚚", "🏠"];
const demos = [
  ["👩🏾‍🌾 Seller", "seller@demo.com"],
  ["🛒 Buyer", "buyer@demo.com"],
  ["🛡️ Admin", "admin@demo.com"],
];
const roles = [
  ["buyer", "🛒", "I want to buy", "Fresh produce, fully traced"],
  ["seller", "👩🏾‍🌾", "I'm a farmer", "Sell direct to buyers"],
] as const;

export default function Login() {
  const [reg, setReg] = useState(false);
  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
    location: "",
    phone: "",
  });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [q, setQ] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const t = setInterval(() => setQ((i) => (i + 1) % quotes.length), 3500);
    return () => clearInterval(t);
  }, []);

  const set =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setF({ ...f, [k]: e.target.value });

  const go = async () => {
    setErr("");
    if (reg && f.role === "seller" && !f.phone.trim())
      return setErr("Sellers need a phone number so buyers can reach them.");
    setBusy(true);
    try {
      const r = await j<{ token: string; user: User }>(
        reg ? "/auth/register" : "/auth/login",
        { method: "POST", body: JSON.stringify(f) },
      );
      saveSession(r.token, r.user);
      router.push(
        { seller: "/seller", admin: "/admin", buyer: "/" }[r.user.role],
      );
    } catch (e) {
      setErr((e as Error).message);
      setBusy(false);
    }
  };

  const tab = (isReg: boolean, label: string) => (
    <button
      onClick={() => {
        setReg(isReg);
        setErr("");
      }}
      className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${reg === isReg ? "bg-leaf text-cream shadow" : "text-leaf/60 hover:text-leaf"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="mx-auto grid max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl md:grid-cols-2">
      {/* ---------- Left: story panel ---------- */}
      <div className="relative flex min-h-[22rem] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-leaf via-[#2a5a2a] to-fern p-10 text-center text-cream">
        <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-sun/20 blur-2xl" />
        <div className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-lime/20 blur-2xl" />
        {[
          ["🌽", "left-6 top-6"],
          ["🍅", "right-8 top-14"],
          ["🍠", "bottom-24 left-8"],
          ["🌶️", "bottom-8 right-10"],
        ].map(([e, pos], i) => (
          <span
            key={e}
            style={{ animationDelay: `${i * 0.7}s` }}
            className={`absolute ${pos} animate-float text-4xl opacity-90`}
          >
            {e}
          </span>
        ))}

        <div className="relative rounded-3xl bg-white p-4 shadow-xl">
          <img
            src="/logo.jpg"
            alt="Agrovest"
            className="w-36 mix-blend-multiply"
          />
        </div>

        <div key={q} className="relative mt-7 min-h-[5rem] animate-fade-up">
          <p className="text-3xl">{quotes[q][0]}</p>
          <p className="mt-1 font-serif text-xl font-bold leading-snug">
            {quotes[q][1]}
          </p>
        </div>

        {/* mini hash-chain animation */}
        <div className="relative mt-4 flex items-center">
          {chain.map((c, i) => (
            <div key={c} className="flex items-center">
              <span
                style={{ animationDelay: `${i * 0.5}s` }}
                className="flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-white/20 text-lg ring-2 ring-sun/70"
              >
                {c}
              </span>
              {i < chain.length - 1 && <span className="h-0.5 w-6 bg-sun/70" />}
            </div>
          ))}
        </div>
        <p className="relative mt-2 text-[10px] uppercase tracking-[0.25em] text-cream/60">
          sealed link by link
        </p>
      </div>

      {/* ---------- Right: form ---------- */}
      <div
        className="space-y-3 p-8"
        onKeyDown={(e) => e.key === "Enter" && !busy && go()}
      >
        <div className="flex rounded-full bg-lime/40 p-1">
          {tab(false, "Login")}
          {tab(true, "Register")}
        </div>

        <div key={String(reg)} className="animate-fade-up">
          <h1 className="text-3xl font-extrabold">
            {reg ? "Join Agrovest 🌾" : "Welcome back 👋"}
          </h1>
          <p className="text-sm text-soil/60">
            {reg
              ? "Create your account in under a minute."
              : "Log in to buy, sell or manage the platform."}
          </p>
        </div>

        {reg && (
          <div className="animate-fade-up space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {roles.map(([k, e, t, d]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setF({ ...f, role: k })}
                  className={`rounded-2xl border-2 p-3 text-left transition ${f.role === k ? "border-leaf bg-lime/40" : "border-leaf/10 hover:border-leaf/40"}`}
                >
                  <span className="text-2xl">{e}</span>
                  <p className="text-sm font-bold">{t}</p>
                  <p className="text-[11px] text-soil/60">{d}</p>
                </button>
              ))}
            </div>
            <input
              className={inp}
              placeholder={
                f.role === "seller" ? "Farm / business name" : "Full name"
              }
              value={f.name}
              onChange={set("name")}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                className={inp}
                placeholder="Location"
                value={f.location}
                onChange={set("location")}
              />
              <input
                className={inp}
                type="tel"
                placeholder={f.role === "seller" ? "Phone (required)" : "Phone"}
                value={f.phone}
                onChange={set("phone")}
              />
            </div>
            {f.role === "seller" && (
              <p className="rounded-lg bg-sun/20 px-3 py-2 text-xs">
                📞 Buyers will see this number to call or WhatsApp you.
              </p>
            )}
          </div>
        )}

        <input
          className={inp}
          placeholder="Email"
          value={f.email}
          onChange={set("email")}
        />
        <div className="relative">
          <input
            className={`${inp} pr-12`}
            type={show ? "text" : "password"}
            placeholder="Password"
            value={f.password}
            onChange={set("password")}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-lg"
            aria-label="Toggle password visibility"
          >
            {show ? "🙈" : "👁️"}
          </button>
        </div>

        {err && (
          <p className="animate-fade-up rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            ⚠️ {err}
          </p>
        )}

        <button
          onClick={go}
          disabled={busy}
          className="w-full rounded-xl bg-leaf py-3 font-semibold text-cream shadow-lg shadow-leaf/20 transition hover:-translate-y-0.5 hover:bg-fern disabled:opacity-60"
        >
          {busy ? "One moment…" : reg ? "Create my account 🚀" : "Login →"}
        </button>

        {!reg && (
          <div className="pt-1">
            <p className="mb-2 text-center text-xs text-soil/50">
              Just exploring? Tap a demo account (password: demo1234)
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {demos.map(([label, email]) => (
                <button
                  key={email}
                  type="button"
                  onClick={() => setF({ ...f, email, password: "demo1234" })}
                  className="rounded-full border border-leaf/30 px-3 py-1 text-xs text-leaf transition hover:bg-leaf hover:text-cream"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
