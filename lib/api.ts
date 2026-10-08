export const API = process.env.NEXT_PUBLIC_API_URL;

if (!API) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

export type Listing = {
  _id: string;

  pricePerKg: number;

  availableKg: number;

  seller: {
    _id: string;
    name: string;
    phone?: string;
    email?: string;
    location?: string;
  };

  batch: {
    code: string;
    crop: string;
    emoji: string;
    image?: string;
    farmer: string;
    farmLocation: string;
  };
};

export type TraceEvent = {
  stage: string;
  actor: string;
  location: string;
  note: string;
  at: string;
  hash: string;
  prevHash: string;
};

export type Trace = {
  code: string;
  crop: string;
  emoji: string;
  image?: string;
  farmer: string;
  farmLocation: string;
  quantityKg: number;
  events: TraceEvent[];
  verified: boolean;
};

export type MyBatch = {
  code: string;
  crop: string;
  emoji: string;
  image?: string;
  quantityKg: number;
  events: TraceEvent[];
  listing: {
    pricePerKg: number;
    availableKg: number;
  } | null;
};

export type Order = {
  _id: string;
  quantityKg: number;
  total: number;
  status: "placed" | "shipped" | "delivered";
  createdAt: string;
  address?: string;
  contactName?: string;
  contactPhone?: string;
  batch: {
    code: string;
    crop: string;
    emoji: string;
    image?: string;
  };
  buyer: {
    name: string;
  };
  seller: {
    name: string;
    phone?: string;
    location?: string;
  };
};

export type Contact = {
  name: string;
  phone?: string;
  location?: string;
};

export const wa = (p: string) => {
  const d = p.replace(/\D/g, "");

  return "https://wa.me/" + (d.startsWith("0") ? "234" + d.slice(1) : d);
};

export const naira = (n: number) => "₦" + n.toLocaleString();

export const j = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("agc_token") : null;

  const r = await fetch(API + path, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
  });

  const contentType = r.headers.get("content-type") || "";
  const text = await r.text();

  let data: any = null;

  if (contentType.includes("application/json")) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`The server returned invalid JSON (${r.status}).`);
    }
  }

  if (!r.ok) {
    if (data) {
      throw new Error(
        data.error || data.message || `Request failed (${r.status})`,
      );
    }

    console.error(`API ${r.status} response from ${API + path}:`, text);

    throw new Error(
      `Request failed (${r.status}). The server returned HTML instead of JSON.`,
    );
  }

  if (!data) {
    console.error(`Expected JSON from ${API + path}, received:`, text);

    throw new Error("The server returned a non-JSON response.");
  }

  return data as T;
};

export const imgUrl = (p?: any) =>
  p ? API.replace(/\/api$/, "") + p : undefined;

export const upload = async <T>(path: string, body: FormData): Promise<T> => {
  const t =
    typeof window !== "undefined" ? localStorage.getItem("agc_token") : null;

  const r = await fetch(API + path, {
    method: "POST",
    body,
    cache: "no-store",
    headers: t
      ? {
          Authorization: `Bearer ${t}`,
        }
      : {},
  });

  const contentType = r.headers.get("content-type") || "";
  const text = await r.text();

  let data: any = null;

  if (contentType.includes("application/json")) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`The server returned invalid JSON (${r.status}).`);
    }
  }

  if (!r.ok) {
    if (data) {
      throw new Error(
        data.error || data.message || `Upload failed (${r.status})`,
      );
    }

    console.error(`Upload ${r.status} response from ${API + path}:`, text);

    throw new Error(
      `Upload failed (${r.status}). The server returned HTML instead of JSON.`,
    );
  }

  if (!data) {
    throw new Error("The server returned a non-JSON response.");
  }

  return data as T;
};
