"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a static version during SSR to avoid hydration mismatch
    return (
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200/50 shadow-sm">
        <nav className="container mx-auto px-4 py-4" aria-label="Main navigation">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-semibold text-slate-800 hover:text-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none rounded px-2 py-1"
              aria-label="Trang chủ"
            >
              Password Checker
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="px-4 py-2 rounded-md font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none text-slate-700 hover:text-blue-600 hover:bg-slate-50"
              >
                Trang chủ
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-md font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none text-slate-700 hover:text-blue-600 hover:bg-slate-50"
              >
                Đăng ký
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 rounded-md font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none text-slate-700 hover:text-blue-600 hover:bg-slate-50"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200/50 shadow-sm">
      <nav className="container mx-auto px-4 py-4" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-semibold text-slate-800 hover:text-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none rounded px-2 py-1"
            aria-label="Trang chủ"
          >
            Password Checker
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded-md font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                pathname === "/"
                  ? "text-blue-600 bg-blue-50"
                  : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
              }`}
              aria-current={pathname === "/" ? "page" : undefined}
            >
              Trang chủ
            </Link>
            <Link
              href="/register"
              className={`px-4 py-2 rounded-md font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                pathname === "/register"
                  ? "text-blue-600 bg-blue-50"
                  : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
              }`}
              aria-current={pathname === "/register" ? "page" : undefined}
            >
              Đăng ký
            </Link>
            <Link
              href="/login"
              className={`px-4 py-2 rounded-md font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                pathname === "/login"
                  ? "text-blue-600 bg-blue-50"
                  : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
              }`}
              aria-current={pathname === "/login" ? "page" : undefined}
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

