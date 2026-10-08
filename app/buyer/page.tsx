"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { j, Order, naira, imgUrl, wa } from "@/lib/api";

import { useUser } from "@/lib/auth";

const steps = ["placed", "shipped", "delivered"] as const;

const label = {
  placed: "🧾 Order placed",
  shipped: "🚚 On the way",
  delivered: "🏠 Delivered",
};

const filters = ["all", ...steps] as const;

export default function Buyer() {
  const { user, ready } = useUser();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");

  useEffect(() => {
    if (!ready) return;

    if (user?.role !== "buyer") {
      router.push("/login");
      return;
    }

    j<Order[]>("/my/orders")
      .then(setOrders)
      .catch((e) => console.error("Failed to load orders:", e));
  }, [ready, user, router]);

  const spent = orders.reduce((s, o) => s + o.total, 0);

  const kg = orders.reduce((s, o) => s + o.quantityKg, 0);

  const shown =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const stats: [string, string | number, string][] = [
    ["Orders", orders.length, "🧾"],
    ["Kg bought", `${kg}kg`, "⚖️"],
    ["Total spent", naira(spent), "💳"],
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-leaf to-fern p-7 text-cream">
        <span className="absolute right-6 top-3 animate-float text-6xl opacity-80">
          🧺
        </span>

        <p className="text-sm text-sun">Buyer dashboard</p>

        <h1 className="text-3xl font-extrabold sm:text-4xl">
          Hello, {user?.name.split(" ")[0]} 🛒
        </h1>

        <p className="opacity-80">
          Track every order and trace exactly where your food came from.
        </p>

        <Link
          href="/"
          className="mt-4 inline-block rounded-full bg-sun px-5 py-2 text-sm font-bold text-soil"
        >
          Shop fresh produce →
        </Link>
      </section>

      {/* Stats */}
      <div className="relative z-10 -mt-6 mx-3 grid grid-cols-3 gap-3">
        {stats.map(([k, v, e]) => (
          <div
            key={k}
            className="rounded-2xl bg-white p-4 text-center shadow-lg"
          >
            <p className="text-xl">{e}</p>

            <p className="text-xl font-extrabold text-leaf sm:text-2xl">{v}</p>

            <p className="text-xs text-soil/60">{k}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-5 mt-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm capitalize transition ${
              filter === f
                ? "bg-leaf text-cream"
                : "border border-leaf/20 bg-white hover:bg-lime/40"
            }`}
          >
            {f}

            {f !== "all" && ` (${orders.filter((o) => o.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {shown.map((o) => {
          const idx = steps.indexOf(o.status);

          return (
            <div
              key={o._id}
              className="overflow-hidden rounded-3xl border border-leaf/10 bg-white shadow-sm"
            >
              {/* Order header */}
              <div className="flex items-start gap-4 p-4">
                {o.batch.image ? (
                  <img
                    src={imgUrl(o.batch.image)}
                    alt={o.batch.crop}
                    className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                  />
                ) : (
                  <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-lime/40 text-4xl">
                    {o.batch.emoji}
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold">
                    {o.quantityKg}kg {o.batch.crop}
                  </h3>

                  <p className="text-sm text-soil/60">
                    From {o.seller.name} ·{" "}
                    {new Date(o.createdAt).toLocaleDateString()}
                  </p>

                  {/* Seller details */}
                  <div className="mt-2 space-y-1">
                    {o.seller.location && (
                      <p className="text-xs text-soil/60">
                        📍 {o.seller.location}
                      </p>
                    )}

                    {o.seller.phone && (
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`tel:${o.seller.phone}`}
                          className="rounded-full bg-lime px-3 py-1 text-xs font-semibold transition hover:bg-lime/70"
                        >
                          📞 {o.seller.phone}
                        </a>

                        <a
                          href={wa(o.seller.phone)}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-[#25D366] px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90"
                        >
                          WhatsApp
                        </a>
                      </div>
                    )}
                  </div>

                  <p className="mt-2 font-semibold text-leaf">
                    {naira(o.total)}
                  </p>

                  {/* Buyer contact */}
                  {o.contactPhone && (
                    <p className="mt-1 text-xs text-soil/50">
                      🚚 Delivery: {o.contactName} · {o.contactPhone}
                      {o.address ? ` · ${o.address}` : ""}
                    </p>
                  )}
                </div>

                <Link
                  href={`/trace/${o.batch.code}`}
                  className="shrink-0 rounded-xl bg-leaf px-4 py-2 text-sm font-semibold text-cream transition hover:bg-fern"
                >
                  🔍 Trace
                </Link>
              </div>

              {/* Progress */}
              <div className="bg-cream/70 px-6 py-4">
                <div className="relative flex justify-between">
                  <div className="absolute left-4 right-4 top-4 h-1 rounded bg-soil/10">
                    <div
                      className="h-1 rounded bg-fern transition-all duration-700"
                      style={{
                        width: `${(idx / 2) * 100}%`,
                      }}
                    />
                  </div>

                  {steps.map((s, i) => (
                    <div
                      key={s}
                      className="relative z-10 flex flex-col items-center gap-1"
                    >
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                          i <= idx
                            ? "bg-fern text-cream"
                            : "bg-white text-soil/30 ring-1 ring-soil/10"
                        }`}
                      >
                        {i < idx ? "✓" : i + 1}
                      </span>

                      <span
                        className={`text-xs ${
                          i === idx ? "font-bold text-leaf" : "text-soil/50"
                        }`}
                      >
                        {label[s]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {!shown.length && (
          <div className="rounded-3xl bg-white p-10 text-center">
            <p className="text-5xl">🥬</p>

            <p className="mt-2 font-bold">
              {orders.length ? "No orders in this view" : "No orders yet"}
            </p>

            <Link
              href="/"
              className="mt-3 inline-block rounded-full bg-leaf px-5 py-2 text-sm text-cream transition hover:bg-fern"
            >
              Browse the market
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
