"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { j, Order, naira } from "@/lib/api";
import { useUser } from "@/lib/auth";

type Stats = {
  sellers: number;
  buyers: number;
  batches: number;
  listings: number;
  orders: number;
  revenue: number;
  byStatus: Record<string, number>;
  topCrops: Record<string, number>;
  tampered: number;
};

type AUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  location?: string;
  suspended: boolean;
};

type ABatch = {
  code: string;
  crop: string;
  emoji: string;
  farmer: string;
  quantityKg: number;
  events: number;
  verified: boolean;
  listed: boolean;
};

const th =
  "px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-soil/45";

export default function Admin() {
  const { user, ready } = useUser();
  const router = useRouter();

  const [tab, setTab] = useState("Overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AUser[]>([]);
  const [batches, setBatches] = useState<ABatch[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);

      const [statsData, usersData, batchesData, ordersData] = await Promise.all(
        [
          j<Stats>("/admin/stats"),
          j<AUser[]>("/admin/users"),
          j<ABatch[]>("/admin/batches"),
          j<Order[]>("/admin/orders"),
        ],
      );

      setStats(statsData);
      setUsers(usersData);
      setBatches(batchesData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to load admin dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ready) return;

    if (user?.role !== "admin") {
      router.push("/login");
      return;
    }

    load();
  }, [ready, user]);

  const act = async (path: string, method = "POST") => {
    try {
      setActionLoading(path);

      await j(path, {
        method,
        body: "{}",
      });

      await load();
    } catch (error) {
      console.error("Admin action failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const bar = (value: number, max: number) => (
    <div className="h-2 overflow-hidden rounded-full bg-leaf/10">
      <div
        className="h-full rounded-full bg-gradient-to-r from-leaf to-fern transition-all duration-700"
        style={{
          width: `${max ? (value / max) * 100 : 0}%`,
        }}
      />
    </div>
  );

  const statusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "placed":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  if (!ready || loading || !stats) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-leaf/20 border-t-leaf" />
          <p className="font-medium text-soil/60">
            Loading Agrovest control center...
          </p>
        </div>
      </div>
    );
  }

  const maxKg = Math.max(1, ...Object.values(stats.topCrops));

  const cards = [
    {
      label: "Total Revenue",
      value: naira(stats.revenue),
      icon: "₦",
      description: "Platform sales",
      accent: "bg-amber-50 text-amber-700",
    },
    {
      label: "Sellers",
      value: stats.sellers,
      icon: "🌾",
      description: "Registered farmers",
      accent: "bg-green-50 text-green-700",
    },
    {
      label: "Buyers",
      value: stats.buyers,
      icon: "🛒",
      description: "Active customers",
      accent: "bg-blue-50 text-blue-700",
    },
    {
      label: "Listings",
      value: stats.listings,
      icon: "🏷️",
      description: "Currently available",
      accent: "bg-purple-50 text-purple-700",
    },
    {
      label: "Orders",
      value: stats.orders,
      icon: "📦",
      description: "Marketplace orders",
      accent: "bg-orange-50 text-orange-700",
    },
    {
      label: "Tampered",
      value: stats.tampered,
      icon: stats.tampered ? "⚠️" : "✓",
      description: stats.tampered
        ? "Requires attention"
        : "All records verified",
      accent: stats.tampered
        ? "bg-red-50 text-red-700"
        : "bg-emerald-50 text-emerald-700",
    },
  ];

  const tabs = [
    { name: "Overview", icon: "◈" },
    { name: "Users", icon: "♙" },
    { name: "Batches", icon: "▣" },
    { name: "Orders", icon: "◫" },
  ];

  return (
    <div className="pb-16">
      {/* Header */}
      <section className="relative mb-8 overflow-hidden rounded-[28px] bg-gradient-to-br from-leaf via-fern to-[#173f29] px-6 py-8 text-cream shadow-lg sm:px-8">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-sun/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-sun" />
              Admin Control Center
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Good day, {user?.name?.split(" ")[0] || "Admin"}.
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-cream/70">
              Monitor the Agrovest marketplace, farmers, orders and
              blockchain-style traceability records from one place.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
            <p className="text-xs uppercase tracking-widest text-cream/50">
              Platform status
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-300" />
              <span className="font-semibold">Operational</span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="mb-7 flex overflow-x-auto rounded-2xl border border-leaf/10 bg-white p-1.5 shadow-sm">
        {tabs.map((item) => {
          const active = tab === item.name;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => setTab(item.name)}
              className={`flex min-w-fit items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                active
                  ? "bg-leaf text-cream shadow-md"
                  : "text-soil/60 hover:bg-leaf/5 hover:text-leaf"
              }`}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          );
        })}
      </div>

      {/* OVERVIEW */}
      {tab === "Overview" && (
        <>
          <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {cards.map((card) => (
              <div
                key={card.label}
                className="group rounded-2xl border border-leaf/10 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${card.accent}`}
                  >
                    {card.icon}
                  </div>
                </div>

                <p className="mt-4 truncate text-xl font-black text-leaf sm:text-2xl">
                  {card.value}
                </p>

                <p className="mt-1 text-sm font-semibold text-soil">
                  {card.label}
                </p>

                <p className="mt-1 text-[11px] text-soil/45">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Order status */}
            <div className="rounded-3xl border border-leaf/10 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-leaf/60">
                    Marketplace
                  </p>
                  <h2 className="mt-1 text-xl font-extrabold text-soil">
                    Orders by status
                  </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf/10">
                  📦
                </div>
              </div>

              {Object.entries(stats.byStatus).length ? (
                Object.entries(stats.byStatus).map(([key, value]) => (
                  <div key={key} className="mb-5 last:mb-0">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium capitalize text-soil">
                        {key}
                      </span>

                      <span className="rounded-full bg-leaf/5 px-2.5 py-1 text-xs font-bold text-leaf">
                        {value}
                      </span>
                    </div>

                    {bar(value, stats.orders)}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-leaf/5 p-6 text-center text-sm text-soil/50">
                  No orders recorded yet.
                </div>
              )}
            </div>

            {/* Crops */}
            <div className="rounded-3xl border border-leaf/10 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-leaf/60">
                    Sales performance
                  </p>
                  <h2 className="mt-1 text-xl font-extrabold text-soil">
                    Top crops by kg sold
                  </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sun/20">
                  🌱
                </div>
              </div>

              {Object.entries(stats.topCrops).length ? (
                Object.entries(stats.topCrops).map(([crop, value]) => (
                  <div key={crop} className="mb-5 last:mb-0">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-soil">
                        {crop}
                      </span>

                      <span className="text-xs font-bold text-leaf">
                        {value.toLocaleString()} kg
                      </span>
                    </div>

                    {bar(value, maxKg)}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-leaf/5 p-6 text-center text-sm text-soil/50">
                  No crop sales yet.
                </div>
              )}
            </div>
          </div>

          {/* Quick overview */}
          <div className="mt-5 rounded-3xl border border-leaf/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-leaf/60">
                  System overview
                </p>
                <h2 className="mt-1 text-xl font-extrabold">
                  Agrovest marketplace
                </h2>
                <p className="mt-1 text-sm text-soil/55">
                  {stats.batches} traceable batches are currently registered on
                  the platform.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTab("Batches")}
                  className="rounded-xl bg-leaf px-4 py-2.5 text-sm font-semibold text-cream transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  View batches
                </button>

                <button
                  type="button"
                  onClick={() => setTab("Orders")}
                  className="rounded-xl border border-leaf/15 px-4 py-2.5 text-sm font-semibold text-leaf transition hover:bg-leaf/5"
                >
                  View orders
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* USERS */}
      {tab === "Users" && (
        <section className="overflow-hidden rounded-3xl border border-leaf/10 bg-white shadow-sm">
          <div className="border-b border-leaf/10 px-6 py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-leaf/60">
                  Platform accounts
                </p>
                <h2 className="text-xl font-extrabold">Users</h2>
              </div>

              <span className="w-fit rounded-full bg-leaf/10 px-3 py-1.5 text-xs font-bold text-leaf">
                {users.length} accounts
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-leaf/[0.025]">
                <tr>
                  <th className={th}>User</th>
                  <th className={th}>Email</th>
                  <th className={th}>Role</th>
                  <th className={th}>Status</th>
                  <th className={th}></th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-t border-leaf/5 transition hover:bg-leaf/[0.025]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf/10 text-sm font-bold text-leaf">
                          {u.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-soil">{u.name}</p>
                          {u.location && (
                            <p className="text-xs text-soil/40">{u.location}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-soil/70">{u.email}</td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-leaf/5 px-3 py-1 text-xs font-semibold capitalize text-leaf">
                        {u.role}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                          u.suspended
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {u.suspended ? "Suspended" : "Active"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      {u.role !== "admin" && (
                        <button
                          type="button"
                          disabled={
                            actionLoading === `/admin/users/${u._id}/suspend`
                          }
                          onClick={() =>
                            act(`/admin/users/${u._id}/suspend`, "PATCH")
                          }
                          className="rounded-xl border border-leaf/15 px-3 py-2 text-xs font-semibold text-leaf transition hover:bg-leaf hover:text-cream disabled:opacity-50"
                        >
                          {actionLoading === `/admin/users/${u._id}/suspend`
                            ? "Working..."
                            : u.suspended
                              ? "Reinstate"
                              : "Suspend"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!users.length && (
            <div className="p-10 text-center text-sm text-soil/50">
              No users found.
            </div>
          )}
        </section>
      )}

      {/* BATCHES */}
      {tab === "Batches" && (
        <>
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-sun/20 bg-sun/10 p-4">
            <div className="text-xl">💡</div>

            <div>
              <p className="font-bold text-soil">Traceability demo</p>
              <p className="mt-1 text-sm leading-5 text-soil/60">
                Use <b>Tamper</b> to simulate an altered historical record. Open
                the batch trace afterwards to see its integrity status change.
              </p>
            </div>
          </div>

          <section className="overflow-hidden rounded-3xl border border-leaf/10 bg-white shadow-sm">
            <div className="border-b border-leaf/10 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-leaf/60">
                    Supply chain
                  </p>
                  <h2 className="text-xl font-extrabold">
                    Agricultural batches
                  </h2>
                </div>

                <span className="rounded-full bg-leaf/10 px-3 py-1.5 text-xs font-bold text-leaf">
                  {batches.length} batches
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-leaf/[0.025]">
                  <tr>
                    <th className={th}>Batch</th>
                    <th className={th}>Farmer</th>
                    <th className={th}>Events</th>
                    <th className={th}>Integrity</th>
                    <th className={th}>Listing</th>
                    <th className={th}></th>
                  </tr>
                </thead>

                <tbody>
                  {batches.map((b) => (
                    <tr
                      key={b.code}
                      className="border-t border-leaf/5 transition hover:bg-leaf/[0.025]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf/10 text-xl">
                            {b.emoji}
                          </div>

                          <div>
                            <Link
                              href={`/trace/${b.code}`}
                              className="font-bold text-leaf hover:underline"
                            >
                              {b.code}
                            </Link>

                            <p className="text-xs text-soil/50">{b.crop}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-medium">{b.farmer}</td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-bold">
                          {b.events}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                            b.verified
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-red-200 bg-red-50 text-red-700"
                          }`}
                        >
                          {b.verified ? "🔒 Verified" : "⚠️ Tampered"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`text-xs font-semibold ${
                            b.listed ? "text-emerald-600" : "text-soil/35"
                          }`}
                        >
                          {b.listed ? "● Live" : "— Not listed"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={
                              actionLoading ===
                              `/admin/batches/${b.code}/tamper`
                            }
                            onClick={() =>
                              act(`/admin/batches/${b.code}/tamper`)
                            }
                            className="rounded-xl bg-sun/80 px-3 py-2 text-xs font-bold text-soil transition hover:-translate-y-0.5 hover:shadow-sm disabled:opacity-50"
                          >
                            {actionLoading === `/admin/batches/${b.code}/tamper`
                              ? "..."
                              : "Tamper"}
                          </button>

                          {b.listed && (
                            <button
                              type="button"
                              disabled={
                                actionLoading ===
                                `/admin/batches/${b.code}/delist`
                              }
                              onClick={() =>
                                act(`/admin/batches/${b.code}/delist`)
                              }
                              className="rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                            >
                              {actionLoading ===
                              `/admin/batches/${b.code}/delist`
                                ? "..."
                                : "Delist"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!batches.length && (
              <div className="p-10 text-center text-sm text-soil/50">
                No batches found.
              </div>
            )}
          </section>
        </>
      )}

      {/* ORDERS */}
      {tab === "Orders" && (
        <section className="overflow-hidden rounded-3xl border border-leaf/10 bg-white shadow-sm">
          <div className="border-b border-leaf/10 px-6 py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-leaf/60">
                  Marketplace activity
                </p>
                <h2 className="text-xl font-extrabold">Orders</h2>
              </div>

              <span className="w-fit rounded-full bg-leaf/10 px-3 py-1.5 text-xs font-bold text-leaf">
                {orders.length} orders
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-leaf/[0.025]">
                <tr>
                  <th className={th}>Date</th>
                  <th className={th}>Item</th>
                  <th className={th}>Buyer</th>
                  <th className={th}>Seller</th>
                  <th className={th}>Total</th>
                  <th className={th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o._id}
                    className="border-t border-leaf/5 transition hover:bg-leaf/[0.025]"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-soil/55">
                      {new Date(o.createdAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf/10 text-lg">
                          {o.batch.emoji}
                        </div>

                        <div>
                          <p className="font-bold">{o.batch.crop}</p>
                          <p className="text-xs text-soil/45">
                            {o.quantityKg} kg
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-medium">{o.buyer.name}</td>

                    <td className="px-5 py-4 font-medium">{o.seller.name}</td>

                    <td className="px-5 py-4">
                      <span className="font-extrabold text-leaf">
                        {naira(o.total)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyle(
                          o.status,
                        )}`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!orders.length && (
            <div className="p-10 text-center text-sm text-soil/50">
              No orders have been placed yet.
            </div>
          )}
        </section>
      )}
    </div>
  );
}
