"use client";
import { useMemo, useState } from "react";
import AutoMeter from "@/components/AutoMeter";
import { analyze } from "@/lib/strength";

export default function Page() {
  const [pw, setPw] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const result = useMemo(() => analyze(pw), [pw]);

  // Password Generator states
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecial, setIncludeSpecial] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);

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
