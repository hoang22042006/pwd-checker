import "./../styles/globals.css";
import Header from "@/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kiểm tra độ mạnh yếu mật khẩu",
  description: "Nhập là thấy kết quả ngay. Không gửi mật khẩu đi đâu.",
  openGraph: {
    title: "Kiểm tra độ mạnh yếu mật khẩu",
    description: "Nhập là thấy kết quả ngay. Không gửi mật khẩu đi đâu.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
