import { NextRequest, NextResponse } from "next/server";

const USER_AGENT =
  "pwd-checker/1.0 (https://github.com/hoang22042006/pwd-checker)";

export async function GET(request: NextRequest) {
  const prefix = request.nextUrl.searchParams.get("prefix");

  if (!prefix || prefix.length !== 5 || !/^[0-9A-Fa-f]{5}$/.test(prefix)) {
    return NextResponse.json(
      { error: "Thiếu hoặc sai định dạng prefix (5 ký tự SHA-1)." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        "User-Agent": USER_AGENT,
        "Add-Padding": "true"
      },
      // Ensure we don't cache user-sensitive results longer than needed
      cache: "no-store"
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Không thể truy vấn HIBP." },
        { status: res.status }
      );
    }

    const text = await res.text();

    return new NextResponse(text, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400"
      }
    });
  } catch (error) {
    console.error("HIBP proxy error:", error);
    return NextResponse.json(
      { error: "Lỗi khi gọi HIBP." },
      { status: 500 }
    );
  }
}

