import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const BACKEND_BASE =
      process.env.LARAVEL_API_URL ?? "http://127.0.0.1:8000/api/";

    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/(?:^|; )token=([^;]+)/);
    const token = match ? match[1] : null;

    if (token) {
      try {
        await fetch(`${BACKEND_BASE}public/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({}),
        }).catch(() => null);
      } catch {
        // ignore errors from backend logout — we'll still clear the cookie
      }
    }

    const res = NextResponse.json({ message: "Logged out" }, { status: 200 });

    res.headers.set(
      "Set-Cookie",
      `token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
    );

    return res;
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("/api/auth/logout error:", error);

    return NextResponse.json({ message: "Logout failed" }, { status: 500 });
  }
}
