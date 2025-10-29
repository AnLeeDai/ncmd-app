import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Keep same BACKEND_BASE shape as other proxy routes (auth/route.ts)
    const BACKEND_BASE =
      process.env.LARAVEL_API_URL ?? "http://127.0.0.1:8000/api/";

    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/(?:^|; )token=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Endpoints to try (BACKEND_BASE may already include /api/)
    const endpoints = ["private/user/profile"];

    let user: any = null;

    for (const ep of endpoints) {
      try {
        const url = `${BACKEND_BASE}${ep}`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) continue;

        const body = await res.json().catch(() => null);

        // Normalize shapes: Laravel often wraps user inside `data`.
        user = body?.data ?? body?.user ?? body ?? null;

        // If body.data contains { user: {...} } normalize that too
        if (user && user.user) user = user.user;

        if (user) break;
      } catch {
        // try next endpoint
      }
    }

    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("/api/private/auth/me error:", error);

    return NextResponse.json({ message: "Bad Gateway" }, { status: 502 });
  }
}
