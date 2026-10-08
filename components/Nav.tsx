"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useUser, logout } from "@/lib/auth";

export default function Nav() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-leaf/10 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center px-5 sm:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center transition-transform duration-200 hover:scale-[1.02]"
        >
          <Image
            src="/logo-wide.jpg"
            alt="Agrovest"
            width={150}
            height={42}
            priority
            className="h-10 w-auto object-contain mix-blend-multiply"
          />
        </Link>

        {/* Navigation */}
        <div className="ml-auto flex items-center gap-1.5">
          <Link
            href="/"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              isActive("/")
                ? "bg-leaf text-cream shadow-sm"
                : "text-gray-700 hover:bg-leaf/10 hover:text-leaf"
            }`}
          >
            Market
          </Link>

          {user?.role === "seller" && (
            <Link
              href="/seller"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive("/seller")
                  ? "bg-leaf text-cream shadow-sm"
                  : "text-gray-700 hover:bg-leaf/10 hover:text-leaf"
              }`}
            >
              My Farm
            </Link>
          )}

          {user?.role === "buyer" && (
            <Link
              href="/buyer"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive("/buyer")
                  ? "bg-leaf text-cream shadow-sm"
                  : "text-gray-700 hover:bg-leaf/10 hover:text-leaf"
              }`}
            >
              My Orders
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              href="/admin"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive("/admin")
                  ? "bg-leaf text-cream shadow-sm"
                  : "text-gray-700 hover:bg-leaf/10 hover:text-leaf"
              }`}
            >
              Admin
            </Link>
          )}

          {/* Account */}
          {user ? (
            <div className="ml-2 flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full border border-leaf/10 bg-leaf/[0.04] px-3 py-1.5 sm:flex">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-leaf text-xs font-bold text-cream">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <span className="max-w-[100px] truncate text-sm font-medium text-gray-700">
                  {user.name?.split(" ")[0]}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-sun/30 bg-sun px-4 py-2 text-sm font-semibold text-gray-900 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-2 rounded-full bg-leaf px-5 py-2 text-sm font-semibold text-cream shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
