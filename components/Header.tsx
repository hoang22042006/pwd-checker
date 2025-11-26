"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type StoredUser = { email: string };

const STORAGE_KEY = "pwdCheckerUser";
const USER_EVENT = "pwd-checker:user-change";

const getStoredUser = (): StoredUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
};

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const updateUser = () => setUser(getStoredUser());
    updateUser();
    window.addEventListener(USER_EVENT, updateUser);
    return () => window.removeEventListener(USER_EVENT, updateUser);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mounted]);

  const handleLogout = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(USER_EVENT));
    } catch (error) {
      console.error("Không thể xoá thông tin người dùng:", error);
    }
    setUser(null);
    setMenuOpen(false);
  };

  const renderNavLink = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      className={`px-4 py-2 rounded-md font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
        pathname === href
          ? "text-blue-600 bg-blue-50"
          : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
      }`}
      aria-current={pathname === href ? "page" : undefined}
    >
      {label}
    </Link>
  );

  if (!mounted) {
    // Static version để tránh hydration mismatch
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

  const userName = user?.email.split("@")[0] ?? "";

  const menuItems = [
    "Thông tin tài khoản",
    "Đơn hàng chờ thanh toán",
    "Đơn hàng đã mua",
    "Gian hàng yêu thích",
    "Lịch sử thanh toán",
    "Reseller",
    "Quản lý nội dung",
    "Đổi mật khẩu"
  ];

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
            {renderNavLink("/", "Trang chủ")}
            {!user && (
              <>
                {renderNavLink("/register", "Đăng ký")}
                {renderNavLink("/login", "Đăng nhập")}
              </>
            )}
            {user && (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden text-left sm:flex sm:flex-col">
                    <span className="text-sm font-semibold text-slate-800">
                      {userName}
                    </span>
                    <span className="text-xs text-slate-500">{user.email}</span>
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-slate-500 transition-transform ${
                      menuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <div
                    className="absolute right-0 mt-3 w-64 rounded-2xl border border-slate-200 bg-white shadow-[0_15px_40px_rgba(15,34,58,0.12)] z-50"
                    role="menu"
                  >
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800">
                        {userName}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <div className="max-h-72 overflow-y-auto px-2 py-2 text-sm text-slate-700">
                      {menuItems.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-50 focus:outline-none focus:bg-slate-100"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 px-2 py-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:bg-red-100"
                      >
                        Thoát
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
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

