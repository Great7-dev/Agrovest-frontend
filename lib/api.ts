// export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// if (!BASE_URL) {
//   throw new Error("NEXT_PUBLIC_API_URL is not configured");
// }

// export type Listing = {
//   _id: string;

//   pricePerKg: number;

//   availableKg: number;

//   seller: {
//     _id: string;
//     name: string;
//     phone?: string;
//     email?: string;
//     location?: string;
//   };

//   batch: {
//     code: string;
//     crop: string;
//     emoji: string;
//     image?: string;
//     farmer: string;
//     farmLocation: string;
//   };
// };

// export type TraceEvent = {
//   stage: string;
//   actor: string;
//   location: string;
//   note: string;
//   at: string;
//   hash: string;
//   prevHash: string;
// };

// export type Trace = {
//   code: string;
//   crop: string;
//   emoji: string;
//   image?: string;
//   farmer: string;
//   farmLocation: string;
//   quantityKg: number;
//   events: TraceEvent[];
//   verified: boolean;
// };

// export type MyBatch = {
//   code: string;
//   crop: string;
//   emoji: string;
//   image?: string;
//   quantityKg: number;
//   events: TraceEvent[];
//   listing: {
//     pricePerKg: number;
//     availableKg: number;
//   } | null;
// };

// export type Order = {
//   _id: string;
//   quantityKg: number;
//   total: number;
//   status: "placed" | "shipped" | "delivered";
//   createdAt: string;
//   address?: string;
//   contactName?: string;
//   contactPhone?: string;
//   batch: {
//     code: string;
//     crop: string;
//     emoji: string;
//     image?: string;
//   };
//   buyer: {
//     name: string;
//   };
//   seller: {
//     name: string;
//     phone?: string;
//     location?: string;
//   };
// };

// export type Contact = {
//   name: string;
//   phone?: string;
//   location?: string;
// };

// export const wa = (p: string) => {
//   const d = p.replace(/\D/g, "");

//   return "https://wa.me/" + (d.startsWith("0") ? "234" + d.slice(1) : d);
// };

// export const naira = (n: number) => "₦" + n.toLocaleString();

// export const j = async <T>(path: string, init?: RequestInit): Promise<T> => {
//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("agc_token") : null;

//   const r = await fetch(BASE_URL + path, {
//     ...init,
//     cache: "no-store",
//     headers: {
//       "Content-Type": "application/json",
//       ...(init?.headers || {}),
//       ...(token
//         ? {
//             Authorization: `Bearer ${token}`,
//           }
//         : {}),
//     },
//   });

//   const contentType = r.headers.get("content-type") || "";
//   const text = await r.text();

//   let data: any = null;

//   if (contentType.includes("application/json")) {
//     try {
//       data = JSON.parse(text);
//     } catch {
//       throw new Error(`The server returned invalid JSON (${r.status}).`);
//     }
//   }

//   if (!r.ok) {
//     if (data) {
//       throw new Error(
//         data.error || data.message || `Request failed (${r.status})`,
//       );
//     }

//     console.error(
//       `BASE_URL ${r.status} response from ${BASE_URL + path}:`,
//       text,
//     );

//     throw new Error(
//       `Request failed (${r.status}). The server returned HTML instead of JSON.`,
//     );
//   }

//   if (!data) {
//     console.error(`Expected JSON from ${BASE_URL + path}, received:`, text);

//     throw new Error("The server returned a non-JSON response.");
//   }

//   return data as T;
// };

// export const imgUrl = (p?: any) =>
//   p ? BASE_URL.replace(/\/BASE_URL$/, "") + p : undefined;

// export const upload = async <T>(path: string, body: FormData): Promise<T> => {
//   const t =
//     typeof window !== "undefined" ? localStorage.getItem("agc_token") : null;

//   const r = await fetch(BASE_URL + path, {
//     method: "POST",
//     body,
//     cache: "no-store",
//     headers: t
//       ? {
//           Authorization: `Bearer ${t}`,
//         }
//       : {},
//   });

//   const contentType = r.headers.get("content-type") || "";
//   const text = await r.text();

//   let data: any = null;

//   if (contentType.includes("application/json")) {
//     try {
//       data = JSON.parse(text);
//     } catch {
//       throw new Error(`The server returned invalid JSON (${r.status}).`);
//     }
//   }

//   if (!r.ok) {
//     if (data) {
//       throw new Error(
//         data.error || data.message || `Upload failed (${r.status})`,
//       );
//     }

//     console.error(`Upload ${r.status} response from ${BASE_URL + path}:`, text);

//     throw new Error(
//       `Upload failed (${r.status}). The server returned HTML instead of JSON.`,
//     );
//   }

//   if (!data) {
//     throw new Error("The server returned a non-JSON response.");
//   }

//   return data as T;
// };

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!RAW_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

// Strip any trailing slash so BASE_URL + "/api/..." never becomes "//api/...".
export const BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

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

// Turns a non-JSON error response into a message that says what actually went
// wrong, instead of a generic "returned HTML".
function nonJsonMessage(kind: string, status: number, path: string): string {
  if (status === 404) {
    return `${kind} failed (404): ${path} was not found on the server. Check the route exists and that NEXT_PUBLIC_API_URL points at the right backend.`;
  }
  if (status === 502 || status === 503 || status === 504) {
    return `${kind} failed (${status}): the server is unavailable or still waking up. Wait about 30–60 seconds and try again.`;
  }
  return `${kind} failed (${status}): the server returned a non-JSON response for ${path}.`;
}

export const j = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("agc_token") : null;

  const url = BASE_URL + path;

  let r: Response;
  try {
    r = await fetch(url, {
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
  } catch {
    // Network failure, CORS block, or the server is down.
    throw new Error(
      `Couldn't reach the server at ${BASE_URL}. It may be offline, waking up, or blocking this site (CORS).`,
    );
  }

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

    console.error(`[api] ${r.status} from ${url}:`, text.slice(0, 500));

    throw new Error(nonJsonMessage("Request", r.status, path));
  }

  if (!data) {
    console.error(
      `[api] Expected JSON from ${url}, received:`,
      text.slice(0, 500),
    );

    throw new Error("The server returned a non-JSON response.");
  }

  return data as T;
};

// Image paths from the API are relative to the server root. If your API URL
// ends in "/api", that part is removed so "/uploads/x.jpg" resolves correctly.
export const imgUrl = (p?: any) =>
  p ? BASE_URL.replace(/\/api$/, "") + p : undefined;

export const upload = async <T>(path: string, body: FormData): Promise<T> => {
  const t =
    typeof window !== "undefined" ? localStorage.getItem("agc_token") : null;

  const url = BASE_URL + path;

  let r: Response;
  try {
    r = await fetch(url, {
      method: "POST",
      body,
      cache: "no-store",
      headers: t
        ? {
            Authorization: `Bearer ${t}`,
          }
        : {},
    });
  } catch {
    throw new Error(
      `Couldn't reach the server at ${BASE_URL}. It may be offline, waking up, or blocking this site (CORS).`,
    );
  }

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

    console.error(`[api] Upload ${r.status} from ${url}:`, text.slice(0, 500));

    throw new Error(nonJsonMessage("Upload", r.status, path));
  }

  if (!data) {
    throw new Error("The server returned a non-JSON response.");
  }

  return data as T;
};
