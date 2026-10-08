"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { j, Listing, naira, imgUrl } from "@/lib/api";
import { useUser } from "@/lib/auth";
import Footer from "@/components/Footer";

type Stats = { farmers: number; batches: number; kg: number; orders: number };

const steps = [
  [
    "🧺",
    "Farmers list",
    "Sellers post what they've harvested with price, quantity and location.",
  ],
  [
    "🔍",
    "Buyers discover",
    "Search by crop, browse the market and compare prices in one place.",
  ],
  [
    "🤝",
    "Connect directly",
    "Tap any listing to get the farmer's phone, WhatsApp and email.",
  ],
];

const floaters: { e: string; style: React.CSSProperties; delay: number }[] = [
  { e: "🍅", style: { right: "8%", top: "2rem" }, delay: 0 },
  { e: "🌽", style: { right: "22%", bottom: "1.5rem" }, delay: 0.8 },
  { e: "🍠", style: { right: "40%", top: "1rem" }, delay: 1.6 },
  { e: "🌶️", style: { right: "3%", bottom: "3.5rem" }, delay: 2.4 },
  { e: "🥬", style: { right: "55%", bottom: "2rem" }, delay: 3.2 },
];

export default function Home() {
  const [items, setItems] = useState<Listing[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [q, setQ] = useState("");
  const [crop, setCrop] = useState("All");
  const [msg, setMsg] = useState("");
  const [active, setActive] = useState<Listing | null>(null); // product/seller modal
  const router = useRouter();
  const { user } = useUser();

  const isBuyer = user?.role === "buyer";

  const load = () =>
    j<Listing[]>(`/listings?q=${encodeURIComponent(q)}`)
      .then(setItems)
      .catch(() => setMsg("API offline - start the server"));

  useEffect(() => {
    load();
  }, [q]);

  useEffect(() => {
    j<Stats>("/stats")
      .then(setStats)
      .catch(() => {});
  }, []);

  const crops = ["All", ...Array.from(new Set(items.map((l) => l.batch.crop)))];
  const shown =
    crop === "All" ? items : items.filter((l) => l.batch.crop === crop);

  // Clicking a product opens the seller-contact modal.
  // Guests are sent to login so we don't leak contact details.
  const openListing = (l: Listing) => {
    if (!user) return router.push("/login");
    setActive(l);
  };

  return (
    <>
      {active && (
        <SellerContactModal listing={active} onClose={() => setActive(null)} />
      )}

      {isBuyer ? (
        <BuyerHero name={user?.name} />
      ) : (
        <>
          <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-leaf via-[#2a5a2a] to-fern p-8 text-cream sm:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px), radial-gradient(circle at 70% 60%, #fff 1px, transparent 1px)",
                backgroundSize: "40px 40px, 60px 60px",
              }}
            />
            {floaters.map(({ e, style, delay }) => (
              <span
                key={e}
                aria-hidden
                style={{ ...style, animationDelay: `${delay}s` }}
                className="absolute animate-float text-5xl opacity-90 drop-shadow-lg sm:text-6xl"
              >
                {e}
              </span>
            ))}

            <div className="relative max-w-2xl">
              <p className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-sun backdrop-blur">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-sun" />
                Fresh · Direct · Local
              </p>
              <h1 className="animate-fade-up mt-4 text-4xl font-extrabold leading-[1.05] sm:text-6xl">
                The market where{" "}
                <span className="bg-gradient-to-r from-sun to-amber-300 bg-clip-text text-transparent">
                  farmers and buyers meet.
                </span>
              </h1>
              <p className="animate-fade-up mt-4 max-w-md text-cream/85">
                Farmers list their harvest. Buyers search, compare and reach out
                directly. No middlemen, no markups — just good produce and a
                handshake.
              </p>

              <div className="animate-fade-up mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    document
                      .getElementById("market")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="rounded-xl bg-sun px-6 py-3 font-bold text-soil transition hover:brightness-110"
                >
                  Browse the market
                </button>
                <button
                  onClick={() => router.push(user ? "/sell" : "/login")}
                  className="rounded-xl border border-cream/40 bg-white/5 px-6 py-3 font-semibold text-cream backdrop-blur transition hover:bg-white/15"
                >
                  Sell your harvest →
                </button>
              </div>

              <div className="animate-fade-up mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-cream/70">
                <span>🌾 Direct from farm</span>
                <span>💸 No middlemen</span>
                <span>📍 Local & regional</span>
              </div>
            </div>
          </section>

          {stats && (
            <section className="relative z-10 -mt-8 mx-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["👩🏾‍🌾", stats.farmers, "Farmers"],
                ["🧺", stats.batches, "Listings"],
                ["⚖️", `${stats.kg}kg`, "Available"],
                ["🧾", stats.orders, "Deals made"],
              ].map(([e, v, k]) => (
                <div
                  key={k as string}
                  className="rounded-2xl bg-white p-4 text-center shadow-lg ring-1 ring-leaf/5"
                >
                  <p className="text-2xl">{e}</p>
                  <p className="text-2xl font-extrabold text-leaf">{v}</p>
                  <p className="text-xs text-soil/60">{k}</p>
                </div>
              ))}
            </section>
          )}

          <section className="mt-12">
            <h2 className="mb-4 text-2xl font-bold">How the market works</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {steps.map(([e, t, d], i) => (
                <div
                  key={t}
                  className="group relative overflow-hidden rounded-2xl border border-leaf/10 bg-white p-6 transition hover:border-leaf/30 hover:shadow-md"
                >
                  <span className="absolute -right-4 -top-4 text-7xl opacity-[0.06] transition group-hover:opacity-[0.12]">
                    {e}
                  </span>
                  <span className="text-4xl">{e}</span>
                  <h3 className="mt-3 text-lg font-bold">
                    <span className="text-sun">{i + 1}.</span> {t}
                  </h3>
                  <p className="mt-1 text-sm text-soil/70">{d}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {msg && (
        <p className="mt-8 rounded-xl bg-lime px-4 py-3 text-sm font-medium">
          {msg}
        </p>
      )}

      <div
        id="market"
        className={`mb-4 flex flex-wrap items-center gap-3 ${isBuyer ? "mt-2" : "mt-12"}`}
      >
        <h2 className="text-3xl font-bold">Fresh on the market</h2>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="🔍 Search crops…"
          className="ml-auto rounded-full border border-leaf/20 bg-white px-4 py-2 text-sm outline-none focus:border-leaf/50"
        />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {crops.map((c) => (
          <button
            key={c}
            onClick={() => setCrop(c)}
            className={`rounded-full px-4 py-1 text-sm transition ${
              crop === c
                ? "bg-leaf text-cream shadow"
                : "border border-leaf/20 bg-white hover:border-leaf/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((l) => (
          <button
            key={l._id}
            onClick={() => openListing(l)}
            className="group overflow-hidden rounded-3xl border border-leaf/10 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative">
              {l.batch.image ? (
                <img
                  src={imgUrl(l.batch.image)}
                  alt={l.batch.crop}
                  className="h-44 w-full object-cover transition group-hover:scale-105"
                />
              ) : (
                <div className="flex h-44 items-center justify-center bg-gradient-to-br from-lime to-white text-7xl">
                  {l.batch.emoji}
                </div>
              )}
              <span className="absolute bottom-3 right-3 rounded-full bg-sun px-3 py-1 text-sm font-bold">
                {naira(l.pricePerKg)}/kg
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold">{l.batch.crop}</h3>
              <p className="text-sm text-soil/60">
                👩🏾‍🌾 {l.seller?.name} · 📍 {l.batch.farmLocation}
              </p>
              <p className="mt-1 text-sm text-fern">
                {l.availableKg}kg available
              </p>
              <span className="mt-4 block w-full rounded-xl bg-leaf py-3 text-center font-semibold text-cream transition group-hover:bg-fern">
                View seller details
              </span>
            </div>
          </button>
        ))}
        {!shown.length && <p className="text-soil/60">No produce found.</p>}
      </div>

      <Footer />
    </>
  );
}

/* ---------- Compact hero for logged-in buyers ---------- */
function BuyerHero({ name }: { name?: string }) {
  const firstName = name?.split(" ")[0] ?? "there";
  return (
    <section className="rounded-3xl bg-gradient-to-r from-leaf/10 via-lime/30 to-sun/20 p-6 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-fern">
        Welcome back
      </p>
      <h1 className="mt-1 text-3xl font-extrabold text-soil sm:text-4xl">
        Hey {firstName} 👋 — find your next harvest.
      </h1>
      <p className="mt-2 max-w-xl text-sm text-soil/70">
        Search the market, compare prices and connect directly with the farmer.
      </p>
    </section>
  );
}

/* ---------- Seller contact modal ---------- */
function SellerContactModal({
  listing,
  onClose,
}: {
  listing: Listing;
  onClose: () => void;
}) {
  const s = listing.seller;
  const phone = s?.phone;
  const waLink = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-soil/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="relative">
          {listing.batch.image ? (
            <img
              src={imgUrl(listing.batch.image)}
              alt={listing.batch.crop}
              className="h-40 w-full object-cover"
            />
          ) : (
            <div className="flex h-40 items-center justify-center bg-gradient-to-br from-lime to-white text-7xl">
              {listing.batch.emoji}
            </div>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-soil shadow hover:bg-white"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-extrabold">{listing.batch.crop}</h3>
          <p className="mt-1 text-sm text-soil/60">
            {naira(listing.pricePerKg)}/kg · {listing.availableKg}kg available
          </p>
          <p className="mt-1 text-sm text-soil/60">
            📍 {listing.batch.farmLocation}
          </p>

          <div className="mt-5 rounded-2xl bg-lime/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-fern">
              Seller
            </p>
            <p className="mt-1 text-lg font-bold">👩🏾‍🌾 {s?.name}</p>

            <div className="mt-3 space-y-2 text-sm">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 font-medium shadow-sm hover:bg-white/80"
                >
                  📞 <span>{phone}</span>
                </a>
              )}
              {s?.email && (
                <a
                  href={`mailto:${s.email}`}
                  className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 font-medium shadow-sm hover:bg-white/80"
                >
                  ✉️ <span className="truncate">{s.email}</span>
                </a>
              )}
              {!phone && !s?.email && (
                <p className="text-soil/60">No contact details provided.</p>
              )}
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-xl bg-[#25D366] py-3 text-center font-bold text-white transition hover:brightness-110"
              >
                WhatsApp
              </a>
            )}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex-1 rounded-xl bg-leaf py-3 text-center font-bold text-cream transition hover:bg-fern"
              >
                Call seller
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
