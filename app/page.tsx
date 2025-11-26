"use client";
import { useEffect, useMemo, useState } from "react";
import AutoMeter from "@/components/AutoMeter";
import EyeIcon from "@/components/EyeIcon";
import { analyze } from "@/lib/strength";
import {
  calculateEntropy,
  checkCommonPassword,
  checkOwaspRules
} from "@/lib/passwordInsights";

export default function Page() {
  const [pw, setPw] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const result = useMemo(() => analyze(pw), [pw]);
  const entropyInfo = useMemo(() => calculateEntropy(pw), [pw]);
  const commonInfo = useMemo(() => checkCommonPassword(pw), [pw]);
  const owaspInfo = useMemo(() => checkOwaspRules(pw), [pw]);
  const [pwnedInfo, setPwnedInfo] = useState<{
    status: "idle" | "checking" | "safe" | "pwned" | "error";
    count?: number;
    message?: string;
  }>({ status: "idle" });

  // Password Generator states
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecial, setIncludeSpecial] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!pw) {
      setPwnedInfo({ status: "idle" });
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    setPwnedInfo({ status: "checking" });

    const timer = setTimeout(async () => {
      try {
        const hash = await sha1Hex(pw);
        const prefix = hash.slice(0, 5);
        const suffix = hash.slice(5);
        const response = await fetch(`/api/hibp?prefix=${prefix}`, {
          signal: controller.signal
        });
        if (!response.ok) throw new Error("Không thể truy vấn HIBP");
        const text = await response.text();
        if (cancelled) return;
        const matchLine = text
          .split("\n")
          .map((line) => line.trim())
          .find((line) => line.startsWith(suffix));
        const count = matchLine ? parseInt(matchLine.split(":")[1], 10) || 0 : 0;
        setPwnedInfo(
          count > 0
            ? { status: "pwned", count }
            : { status: "safe", count: 0 }
        );
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("HIBP check failed:", error);
        setPwnedInfo({
          status: "error",
          message: "Không kiểm tra được rò rỉ. Thử lại sau."
        });
      }
    }, 600);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [pw]);

  const advancedHints = useMemo(() => {
    if (!pw) return [];
    const hints = [...result.reasons];
    if (entropyInfo.bits > 0 && entropyInfo.bits < 60) {
      hints.push(
        "Entropy thấp (<60 bit). Tăng độ dài và đa dạng ký tự để khó đoán hơn."
      );
    }
    if (commonInfo.isCommon) {
      hints.push(
        `Mật khẩu nằm trong danh sách phổ biến (Top ${commonInfo.rank}). Hãy chọn chuỗi độc nhất.`
      );
    }
    if (pwnedInfo.status === "pwned" && pwnedInfo.count) {
      hints.push(
        `Mật khẩu đã bị rò rỉ ${pwnedInfo.count.toLocaleString()} lần. Tuyệt đối không tái sử dụng.`
      );
    }
    if (owaspInfo.violations.length) {
      hints.push(...owaspInfo.violations);
    }
    if (pw.length < 16) {
      hints.push("Nên đặt mật khẩu tối thiểu 16 ký tự theo khuyến nghị NIST.");
    }
    return Array.from(new Set(hints));
  }, [
    pw,
    result.reasons,
    entropyInfo.bits,
    commonInfo.isCommon,
    commonInfo.rank,
    pwnedInfo.status,
    pwnedInfo.count,
    owaspInfo.violations
  ]);

  const generatePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let charset = lowercase;
    if (includeUppercase) charset += uppercase;
    if (includeNumbers) charset += numbers;
    if (includeSpecial) charset += special;

    if (charset.length === 0) {
      setGeneratedPassword("");
      return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    setGeneratedPassword(password);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (!generatedPassword) return;
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = generatedPassword;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="page">
      <div className="w-full max-w-6xl space-y-6">
        {/* Password Checker Section */}
        <div className="card p-10 md:p-14">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Kiểm tra độ mạnh yếu mật khẩu
          </h1>

          <div className="mt-8">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="pwd-demo"
                autoComplete="new-password"
                autoCorrect="off"
                spellCheck={false}
                inputMode="text"
                data-lpignore="true"
                data-1p-ignore="true"
                placeholder="Nhập mật khẩu của bạn"
                className="input pr-12"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                <EyeIcon open={showPassword} />

              </button>
            </div>
            {pw && <AutoMeter score={result.score} label={result.label} />}
          </div>

          {pw && result.reasons.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-800">
                Vì sao mật khẩu yếu / cần cải thiện?
              </h3>
              <ul className="list-disc list-inside text-sm text-slate-700 mt-2 space-y-1">
                {result.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="hint mt-8">
            Mẹo: dùng cụm từ dài, thêm chữ hoa, số và ký tự đặc biệt để tăng độ
            mạnh.
          </p>

          {pw && (
            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-800">
                  Phân tích nâng cao
                </h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-medium text-slate-600">Entropy</dt>
                    <dd className="text-right text-slate-900">
                      {entropyInfo.bits.toFixed(2)} bit ({entropyInfo.classification})
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-medium text-slate-600">
                      Kiểm tra rò rỉ (HIBP)
                    </dt>
                    <dd className="text-right text-slate-900">
                      {pwnedInfo.status === "checking" && "Đang kiểm tra..."}
                      {pwnedInfo.status === "idle" && "Nhập mật khẩu để kiểm tra."}
                      {pwnedInfo.status === "safe" &&
                        "Không tìm thấy trong dữ liệu rò rỉ."}
                      {pwnedInfo.status === "error" && pwnedInfo.message}
                      {pwnedInfo.status === "pwned" &&
                        `Bị rò rỉ ${pwnedInfo.count?.toLocaleString()} lần!`}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-medium text-slate-600">
                      Mật khẩu phổ biến
                    </dt>
                    <dd className="text-right text-slate-900">
                      {commonInfo.isCommon
                        ? `Có trong top phổ biến (#${commonInfo.rank})`
                        : "Không trùng danh sách phổ biến."}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-600">Quy tắc OWASP</dt>
                    <dd className="mt-1 text-sm text-slate-900">
                      {owaspInfo.violations.length === 0 ? (
                        "Không vi phạm quy tắc nào."
                      ) : (
                        <ul className="list-disc list-inside space-y-1">
                          {owaspInfo.violations.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_15px_40px_rgba(15,34,58,0.08)]">
                <h3 className="text-base font-semibold text-slate-800">
                  Gợi ý cải thiện
                </h3>
                {advancedHints.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-600">
                    Tuyệt vời! Mật khẩu đã đáp ứng các tiêu chí chính.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {advancedHints.map((hint, index) => (
                      <li
                        key={index}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                      >
                        {hint}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Password Generator Section */}
        <div className="card p-10 md:p-14">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
            Bạn cần một mật khẩu mới an toàn?
          </h2>

          <div className="space-y-6">
            {/* Length Slider */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Độ dài: <span className="font-semibold">{length}</span> ký tự
              </label>
              <input
                type="range"
                min="8"
                max="32"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                aria-label={`Độ dài mật khẩu: ${length} ký tự`}
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>8</span>
                <span>32</span>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-slate-700">
                  Bao gồm Chữ hoa (A-Z)
                </span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-slate-700">
                  Bao gồm Số (0-9)
                </span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSpecial}
                  onChange={(e) => setIncludeSpecial(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-slate-700">
                  Bao gồm Ký tự đặc biệt (!@#...)
                </span>
              </label>
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={generatePassword}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none shadow-lg hover:shadow-xl"
            >
              Tạo mật khẩu ngẫu nhiên
            </button>

            {/* Generated Password Display */}
            {generatedPassword && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mật khẩu đã tạo:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedPassword}
                    className="input flex-1 font-mono text-sm"
                    aria-label="Mật khẩu đã tạo"
                  />
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:outline-none whitespace-nowrap"
                    aria-label="Sao chép mật khẩu"
                  >
                    {copied ? "Đã sao chép!" : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="card p-10 md:p-14">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
            Tiêu chí cho một mật khẩu mạnh
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <span className="text-green-600 text-lg font-bold">✅</span>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">
                    Độ dài
                  </h3>
                  <p className="text-sm text-slate-700">
                    Nên từ 12 ký tự trở lên
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <span className="text-green-600 text-lg font-bold">✅</span>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">
                    Đa dạng
                  </h3>
                  <p className="text-sm text-slate-700">
                    Kết hợp chữ hoa, thường, số và ký tự đặc biệt
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <span className="text-green-600 text-lg font-bold">✅</span>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">
                    Độc nhất
                  </h3>
                  <p className="text-sm text-slate-700">
                    Không dùng chung mật khẩu cho nhiều tài khoản
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start gap-2">
                <span className="text-red-600 text-lg font-bold">❌</span>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">
                    Tránh
                  </h3>
                  <p className="text-sm text-slate-700">
                    Không dùng ngày sinh, số điện thoại hoặc tên riêng
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function sha1Hex(value: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}
