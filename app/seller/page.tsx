"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { j, upload, imgUrl, naira, MyBatch, Order } from "@/lib/api";
import { useUser } from "@/lib/auth";

const stages = ["Processing", "Packaged", "Warehouse", "Transported"];
const emojis = ["🌾", "🍅", "🍠", "🌶️", "🥬", "🌽", "🍌", "🥕"];
const cols = [
  ["placed", "📥 New orders", "Mark shipped"],
  ["shipped", "🚚 On the way", "Mark delivered"],
  ["delivered", "✅ Delivered", ""],
] as const;
const wa = (p: string) => {
  const d = p.replace(/\D/g, "");
  return "https://wa.me/" + (d.startsWith("0") ? "234" + d.slice(1) : d);
};
const inp =
  "w-full rounded-xl border border-leaf/20 bg-white px-3 py-2 text-sm outline-none focus:border-leaf";

export default function Seller() {
  const { user, ready } = useUser();
  const router = useRouter();
  const [tab, setTab] = useState<"produce" | "orders" | "add" | "profile">(
    "produce",
  );
  const [batches, setBatches] = useState<MyBatch[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [f, setF] = useState({
    crop: "",
    emoji: "🌾",
    quantityKg: "",
    farmLocation: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState<Record<string, string>>({});
  const [toast, setToast] = useState("");
  const [me, setMe] = useState({ phone: "", location: "" });

  const load = () => {
    j<MyBatch[]>("/my/batches").then(setBatches);
    j<Order[]>("/my/orders").then(setOrders);
    j<{ phone?: string; location?: string }>("/me").then((m) =>
      setMe({ phone: m.phone || "", location: m.location || "" }),
    );
  };
  useEffect(() => {
    if (!ready) return;
    if (user?.role !== "seller") router.push("/login");
    else load();
  }, [ready, user]);

  const act = (p: () => Promise<unknown>, ok = "Saved ✓") =>
    p()
      .then(() => {
        setToast(ok);
        load();
      })
      .catch((e) => setToast("⚠️ " + e.message))
      .finally(() => setTimeout(() => setToast(""), 3000));
  const post =
    (path: string, body: object, method = "POST") =>
    () =>
      j(path, { method, body: JSON.stringify(body) });
  const create = () =>
    act(async () => {
      const d = new FormData();
      Object.entries(f).forEach(([k, v]) => d.append(k, v));
      if (file) d.append("image", file);
      await upload("/batches", d);
      setF({ crop: "", emoji: "🌾", quantityKg: "", farmLocation: "" });
      setFile(null);
      setTab("produce");
    }, "Harvest registered 🌱");

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status !== "delivered").length;
  const recent = orders.slice(0, 7).reverse();
  const maxSale = Math.max(1, ...recent.map((o) => o.total));
  const stats: [string, string | number, string][] = [
    ["Revenue", naira(revenue), "💰"],
    ["Active orders", pending, "📦"],
    ["Batches", batches.length, "🌱"],
    ["Listed", batches.filter((b) => b.listing?.availableKg).length, "🏷️"],
  ];

  return (
    <>
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-leaf to-fern p-7 text-cream">
        <span className="absolute right-6 top-3 animate-float text-6xl opacity-80">
          🚜
        </span>
        <p className="text-sm text-sun">Seller dashboard</p>
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          Good day, {user?.name.split(" ")[0]} 👩🏾‍🌾
        </h1>
        <p className="opacity-80">
          {pending
            ? `You have ${pending} order${pending > 1 ? "s" : ""} waiting on you.`
            : "All caught up. Time to log a new harvest?"}
        </p>
      </section>

      <div className="relative z-10 -mt-6 mx-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(([k, v, e]) => (
          <div key={k} className="rounded-2xl bg-white p-4 shadow-lg">
            <p className="text-xl">{e}</p>
            <p className="text-2xl font-extrabold text-leaf">{v}</p>
            <p className="text-xs text-soil/60">{k}</p>
          </div>
        ))}
      </div>

      {recent.length > 0 && (
        <div className="mt-6 rounded-2xl bg-white p-5">
          <h3 className="mb-3 font-bold">Recent sales</h3>
          <div className="flex h-24 items-end gap-2">
            {recent.map((o) => (
              <div
                key={o._id}
                title={naira(o.total)}
                className="flex-1 rounded-t-lg bg-fern/80 transition hover:bg-sun"
                style={{ height: `${(o.total / maxSale) * 100}%` }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mb-5 mt-8 flex items-center gap-2">
        {(
          [
            ["produce", "🌾 My produce"],
            ["orders", "📦 Orders"],
            ["add", "➕ New harvest"],
            ["profile", "👤 My contact"],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-full px-5 py-2 text-sm font-medium ${tab === k ? "bg-leaf text-cream" : "border border-leaf/20 bg-white"}`}
          >
            {l}
          </button>
        ))}
        {toast && (
          <span className="ml-auto animate-fade-up rounded-full bg-lime px-4 py-1 text-sm font-medium">
            {toast}
          </span>
        )}
      </div>

      {tab === "add" && (
        <div className="grid gap-5 rounded-3xl bg-white p-6 md:grid-cols-2">
          <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-fern/50 bg-lime/20 text-center">
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <>
                <span className="text-5xl">📸</span>
                <span className="mt-2 text-sm">
                  Tap to add a fresh photo
                  <br />
                  <span className="text-soil/50">
                    JPG, PNG or WebP · max 3MB
                  </span>
                </span>
              </>
            )}
            <input
              type="file"
              hidden
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
          <div className="space-y-3">
            <input
              className={inp}
              placeholder="Crop (e.g. Roma Tomatoes)"
              value={f.crop}
              onChange={(e) => setF({ ...f, crop: e.target.value })}
            />
            <div className="flex flex-wrap gap-1">
              {emojis.map((e) => (
                <button
                  key={e}
                  onClick={() => setF({ ...f, emoji: e })}
                  className={`rounded-lg px-2 py-1 text-xl ${f.emoji === e ? "bg-sun" : "bg-soil/5"}`}
                >
                  {e}
                </button>
              ))}
            </div>
            <input
              className={inp}
              type="number"
              placeholder="Quantity (kg)"
              value={f.quantityKg}
              onChange={(e) => setF({ ...f, quantityKg: e.target.value })}
            />
            <input
              className={inp}
              placeholder="Farm location"
              value={f.farmLocation}
              onChange={(e) => setF({ ...f, farmLocation: e.target.value })}
            />
            <button
              onClick={create}
              disabled={!f.crop || !f.quantityKg}
              className="w-full rounded-xl bg-leaf py-3 font-semibold text-cream disabled:opacity-40"
            >
              Seal this harvest 🔒
            </button>
          </div>
        </div>
      )}

      {tab === "profile" && (
        <div className="max-w-md space-y-3 rounded-3xl bg-white p-6">
          <h2 className="text-xl font-bold">Contact details buyers will see</h2>
          <p className="text-sm text-soil/60">
            Buyers tap "Show seller contact" on the market to call or WhatsApp
            you.
          </p>
          <input
            className={inp}
            type="tel"
            placeholder="Phone number"
            value={me.phone}
            onChange={(e) => setMe({ ...me, phone: e.target.value })}
          />
          <input
            className={inp}
            placeholder="Farm / pickup location"
            value={me.location}
            onChange={(e) => setMe({ ...me, location: e.target.value })}
          />
          <button
            onClick={() => act(post("/me", me, "PATCH"), "Contact saved ✓")}
            className="w-full rounded-xl bg-leaf py-3 font-semibold text-cream"
          >
            Save contact
          </button>
        </div>
      )}

      {tab === "produce" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {batches.map((b) => (
            <div
              key={b.code}
              className="overflow-hidden rounded-3xl border border-leaf/10 bg-white shadow-sm"
            >
              <div className="relative">
                {b.image ? (
                  <img
                    src={imgUrl(b.image)}
                    alt={b.crop}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-lime to-white text-6xl">
                    {b.emoji}
                  </div>
                )}
                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${b.listing?.availableKg ? "bg-leaf text-cream" : "bg-white text-soil/60"}`}
                >
                  {b.listing?.availableKg ? "● Live" : "○ Not listed"}
                </span>
                <label className="absolute bottom-3 right-3 cursor-pointer rounded-full bg-white/90 px-3 py-1 text-xs shadow">
                  📷 {b.image ? "Change" : "Add"}
                  <input
                    type="file"
                    hidden
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => {
                      const x = e.target.files?.[0];
                      if (x) {
                        const d = new FormData();
                        d.append("image", x);
                        act(
                          () => upload(`/batches/${b.code}/image`, d),
                          "Photo updated 📷",
                        );
                      }
                    }}
                  />
                </label>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold">
                  {b.emoji} {b.crop}
                </h3>
                <p className="text-sm text-soil/60">
                  <Link
                    href={`/trace/${b.code}`}
                    className="text-leaf underline"
                  >
                    {b.code}
                  </Link>{" "}
                  · {b.quantityKg}kg · {b.events.length} seals
                </p>
                {b.listing && (
                  <p className="mt-1 text-sm font-semibold text-fern">
                    {naira(b.listing.pricePerKg)}/kg · {b.listing.availableKg}kg
                    left
                  </p>
                )}
                <div className="mt-3 flex gap-2">
                  <input
                    className={inp}
                    type="number"
                    placeholder="₦ per kg"
                    onChange={(e) =>
                      setPrice({ ...price, [b.code]: e.target.value })
                    }
                  />
                  <button
                    onClick={() =>
                      act(
                        post("/listings", {
                          code: b.code,
                          pricePerKg: price[b.code],
                        }),
                        "Listing updated 🏷️",
                      )
                    }
                    className="shrink-0 rounded-xl bg-sun px-4 text-sm font-bold"
                  >
                    {b.listing ? "Update" : "List"}
                  </button>
                </div>
                <p className="mb-1 mt-3 text-xs text-soil/50">
                  Log the next step:
                </p>
                <div className="flex flex-wrap gap-1">
                  {stages.map((s) => (
                    <button
                      key={s}
                      onClick={() =>
                        act(
                          post(`/batches/${b.code}/events`, { stage: s }),
                          `${s} sealed 🔗`,
                        )
                      }
                      className="rounded-full border border-leaf px-3 py-1 text-xs text-leaf hover:bg-leaf hover:text-cream"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {!batches.length && (
            <div className="col-span-full rounded-3xl bg-white p-10 text-center">
              <p className="text-5xl">🌱</p>
              <p className="mt-2 font-bold">No harvests yet</p>
              <button
                onClick={() => setTab("add")}
                className="mt-3 rounded-full bg-leaf px-5 py-2 text-sm text-cream"
              >
                Register your first one
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div className="grid gap-4 md:grid-cols-3">
          {cols.map(([status, title, cta]) => (
            <div key={status} className="rounded-3xl bg-white/70 p-3">
              <h3 className="mb-3 px-2 font-bold">
                {title}{" "}
                <span className="text-soil/40">
                  ({orders.filter((o) => o.status === status).length})
                </span>
              </h3>
              <div className="space-y-3">
                {orders
                  .filter((o) => o.status === status)
                  .map((o) => (
                    <div
                      key={o._id}
                      className="rounded-2xl border border-leaf/10 bg-white p-3 text-sm shadow-sm"
                    >
                      <p className="font-bold">
                        {o.batch.emoji} {o.quantityKg}kg {o.batch.crop}
                      </p>
                      <p className="text-soil/70">
                        👤 {o.contactName || o.buyer.name}
                      </p>
                      <p className="text-soil/70">📍 {o.address}</p>
                      {o.contactPhone && (
                        <div className="mt-1 flex gap-2">
                          <a
                            href={`tel:${o.contactPhone}`}
                            className="rounded-full bg-lime px-3 py-1 text-xs font-semibold"
                          >
                            📞 {o.contactPhone}
                          </a>
                          <a
                            href={wa(o.contactPhone)}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full bg-[#25D366] px-3 py-1 text-xs font-semibold text-white"
                          >
                            WhatsApp
                          </a>
                        </div>
                      )}
                      <p className="mt-1 font-semibold text-leaf">
                        {naira(o.total)}
                      </p>
                      {cta && (
                        <button
                          onClick={() =>
                            act(
                              post(`/orders/${o._id}/status`, {}, "PATCH"),
                              "Order updated ✓",
                            )
                          }
                          className="mt-2 w-full rounded-lg bg-leaf py-1.5 text-cream hover:bg-fern"
                        >
                          {cta}
                        </button>
                      )}
                    </div>
                  ))}
                {!orders.some((o) => o.status === status) && (
                  <p className="px-2 pb-2 text-xs text-soil/40">
                    Nothing here.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
