"use client";

import { useState } from "react";

import { j, Listing, Contact, naira, imgUrl, wa } from "@/lib/api";

export default function CheckoutModal({
  listing,
  onClose,
  onDone,
}: {
  listing: Listing;
  onClose: () => void;
  onDone: (msg: string) => void;
}) {
  const [kg, setKg] = useState(Math.min(10, listing.availableKg));
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const b = listing.batch;

  // Seller details already come with the listing.
  // No extra API request is needed.
  const seller: Contact = {
    name: listing.seller.name,
    phone: listing.seller.phone,
    location: listing.seller.location,
  };

  const clamp = (n: number) =>
    Math.max(1, Math.min(listing.availableKg, Math.round(n) || 1));

  const order = async () => {
    setErr("");
    setBusy(true);

    try {
      const r = await j<{ code: string }>("/orders", {
        method: "POST",
        body: JSON.stringify({
          listingId: listing._id,
          quantityKg: kg,
        }),
      });

      onDone(
        `🎉 Order placed for ${kg}kg ${b.crop}! Call ${seller.name}${
          seller.phone ? ` on ${seller.phone}` : ""
        } to arrange delivery. Batch ${r.code}.`,
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Unable to place order");
      setBusy(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-md animate-fade-up overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        {/* Product image */}
        <div className="relative">
          {b.image ? (
            <img
              src={imgUrl(b.image)}
              alt={b.crop}
              className="h-52 w-full object-cover"
            />
          ) : (
            <div className="flex h-52 items-center justify-center bg-gradient-to-br from-lime to-white text-7xl">
              {b.emoji}
            </div>
          )}

          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg shadow transition hover:bg-white"
          >
            ✕
          </button>

          <span className="absolute bottom-3 left-3 rounded-full bg-leaf px-3 py-1 text-xs font-semibold text-cream">
            ✓ Traceable
          </span>
        </div>

        <div className="p-5">
          {/* Product heading */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-soil">{b.crop}</h2>

              <p className="mt-1 text-sm text-soil/60">
                Fresh produce from a verified farm
              </p>
            </div>

            <p className="shrink-0 rounded-full bg-sun px-3 py-1 text-sm font-bold text-soil">
              {naira(listing.pricePerKg)}/kg
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-lime px-3 py-1 text-xs font-semibold text-fern">
              🌱 {listing.availableKg}kg available
            </span>

            <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-soil/70">
              📦 Batch {b.code}
            </span>
          </div>

          {/* Farm details */}
          <div className="mt-5 rounded-2xl border border-leaf/10 bg-cream/60 p-4">
            <h3 className="font-bold text-soil">🌾 Farm details</h3>

            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-soil/50">Farmer</span>

                <span className="font-semibold text-right">{b.farmer}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-soil/50">Farm location</span>

                <span className="font-semibold text-right">
                  📍 {b.farmLocation}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-soil/50">Batch</span>

                <span className="font-semibold">{b.code}</span>
              </div>
            </div>
          </div>

          {/* Seller details */}
          <h3 className="mt-5 text-lg font-bold text-soil">Seller details</h3>

          <div className="mt-2 rounded-2xl bg-lime/40 p-4 text-sm">
            <div className="space-y-3">
              <div className="flex justify-between gap-3">
                <span className="text-soil/60">Full name</span>

                <span className="font-semibold text-right">
                  👩🏾‍🌾 {seller.name}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-soil/60">Location</span>

                <span className="font-semibold text-right">
                  📍 {seller.location || b.farmLocation}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-soil/60">Phone number</span>

                <span className="font-semibold text-right">
                  📞 {seller.phone || "Not provided"}
                </span>
              </div>

              {seller.phone && (
                <div className="flex gap-2 pt-1">
                  <a
                    href={`tel:${seller.phone}`}
                    className="flex-1 rounded-xl bg-leaf py-2.5 text-center font-semibold text-cream transition hover:bg-fern"
                  >
                    📞 Call
                  </a>

                  <a
                    href={wa(seller.phone)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 rounded-xl bg-[#25D366] py-2.5 text-center font-semibold text-white transition hover:opacity-90"
                  >
                    WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-leaf/15 p-3">
            <span className="text-sm font-medium text-soil">How many kg?</span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setKg(clamp(kg - 1))}
                className="h-9 w-9 rounded-full bg-leaf/10 text-lg transition hover:bg-leaf/20"
              >
                −
              </button>

              <input
                type="number"
                min={1}
                max={listing.availableKg}
                value={kg}
                onChange={(e) => setKg(clamp(+e.target.value))}
                className="w-16 rounded-lg border border-soil/10 py-1 text-center font-semibold outline-none focus:border-leaf"
              />

              <button
                onClick={() => setKg(clamp(kg + 1))}
                className="h-9 w-9 rounded-full bg-leaf/10 text-lg transition hover:bg-leaf/20"
              >
                +
              </button>
            </div>
          </div>

          {/* Error */}
          {err && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {err}
            </p>
          )}

          {/* Order button */}
          <button
            onClick={order}
            disabled={busy}
            className="mt-4 w-full rounded-xl bg-leaf py-3.5 font-semibold text-cream transition hover:bg-fern disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy
              ? "Placing order…"
              : `Place order · ${naira(kg * listing.pricePerKg)}`}
          </button>

          <p className="mt-2 text-center text-xs text-soil/50">
            Your name, phone and location from your account are sent to the
            seller with the order.
          </p>
        </div>
      </div>
    </div>
  );
}
