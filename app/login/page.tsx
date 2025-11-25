"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FormErrors {
  email?: string;
  password?: string;
  submit?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSubmitSuccess(false);
    setIsSubmitting(true);

    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!validateEmail(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setEmail("");
        setPassword("");
        // Redirect to home page after 1.5 seconds
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || "Đăng nhập thất bại. Vui lòng thử lại." });
      }
    } catch (error) {
      setErrors({ submit: "Có lỗi xảy ra. Vui lòng thử lại sau." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="card w-full max-w-md p-10 md:p-14">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-2">
          Đăng nhập
        </h1>
        <p className="text-sm text-slate-600 mb-8">
          Nhập thông tin đăng nhập của bạn để tiếp tục
        </p>

        {submitSuccess && (
          <div
            className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm"
            role="alert"
            aria-live="polite"
          >
            Đăng nhập thành công! Đang chuyển đến trang chủ...
          </div>
        )}

        {errors.submit && (
          <div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm"
            role="alert"
            aria-live="assertive"
          >
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={`input w-full ${
                errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-2 text-sm text-red-600"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className={`input w-full pr-12 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p
                id="password-error"
                className="mt-2 text-sm text-red-600"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 mb-2">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none rounded px-1"
            >
              Đăng ký ngay
            </Link>
          </p>
          <Link
            href="/"
            className="text-sm text-slate-600 hover:text-slate-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none rounded px-2 py-1"
          >
            ← Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

