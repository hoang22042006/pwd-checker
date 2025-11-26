import commonPasswords from "@/data/common-passwords";

export type EntropyInfo = {
  bits: number;
  classification: "Chưa nhập" | "Rất yếu" | "Yếu" | "Ổn" | "Mạnh" | "Rất mạnh";
};

export function calculateEntropy(password: string): EntropyInfo {
  if (!password) {
    return { bits: 0, classification: "Chưa nhập" };
  }

  const charsets = [
    { regex: /[a-z]/, size: 26 },
    { regex: /[A-Z]/, size: 26 },
    { regex: /[0-9]/, size: 10 },
    { regex: /[^A-Za-z0-9]/, size: 33 }
  ];

  let poolSize = 0;
  charsets.forEach((set) => {
    if (set.regex.test(password)) poolSize += set.size;
  });

  if (poolSize === 0) poolSize = 1;

  const bits = password.length * Math.log2(poolSize);
  let classification: EntropyInfo["classification"] = "Rất mạnh";

  if (bits === 0) classification = "Chưa nhập";
  else if (bits < 28) classification = "Rất yếu";
  else if (bits < 36) classification = "Yếu";
  else if (bits < 60) classification = "Ổn";
  else if (bits < 80) classification = "Mạnh";

  return { bits, classification };
}

export function checkCommonPassword(password: string) {
  if (!password) return { isCommon: false as const };
  const normalized = password.toLowerCase();
  const index = commonPasswords.indexOf(normalized);
  if (index === -1) {
    return { isCommon: false as const };
  }
  return { isCommon: true as const, rank: index + 1 };
}

type OwaspContext = {
  email?: string;
};

export function checkOwaspRules(password: string, context: OwaspContext = {}) {
  const violations: string[] = [];
  if (!password) return { violations };

  const lower = password.toLowerCase();

  if (/^(.)\1+$/.test(password)) {
    violations.push("Mật khẩu là chuỗi ký tự lặp lại.");
  }

  if (/^\d+$/.test(password)) {
    violations.push("Mật khẩu chỉ gồm số, rất dễ bị đoán.");
  }

  if (/(.)\1{2,}/.test(password)) {
    violations.push("Có chuỗi ký tự lặp lại ≥3 lần liên tiếp.");
  }

  const keyboardPatterns = [
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm",
    "1234567890",
    "0987654321",
    "1qaz2wsx",
    "qazwsx",
    "poiuytrewq",
    "lkjhgfds",
    "mnbvcxz"
  ];

  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const reversedAlphabet = alphabet.split("").reverse().join("");
  keyboardPatterns.push(alphabet, reversedAlphabet);

  keyboardPatterns.forEach((pattern) => {
    for (let i = 0; i <= pattern.length - 5; i++) {
      const slice = pattern.slice(i, i + 5);
      if (lower.includes(slice)) {
        violations.push("Mật khẩu chứa chuỗi bàn phím dễ đoán (ví dụ: qwerty, 12345).");
        return;
      }
    }
  });

  const dateRegex =
    /(19|20)\d{2}[-\/.]?(0[1-9]|1[0-2])[-\/.]?(0[1-9]|[12]\d|3[01])/;
  if (dateRegex.test(password)) {
    violations.push("Mật khẩu trông giống ngày tháng (YYYYMMDD), dễ bị đoán.");
  }

  if (context.email) {
    const [emailUser] = context.email.toLowerCase().split("@");
    if (emailUser && emailUser.length >= 3 && lower.includes(emailUser)) {
      violations.push("Mật khẩu chứa email hoặc tên đăng nhập.");
    }
  }

  return { violations };
}

