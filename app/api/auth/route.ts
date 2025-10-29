import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();

  const BACKEND_BASE =
    process.env.LARAVEL_API_URL ?? "http://127.0.0.1:8000/api/";

  try {
    const url = `${BACKEND_BASE}public/auth/login`;

    const laravelRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const body = await laravelRes.json().catch(() => null);

    if (!laravelRes.ok) {
      return NextResponse.json(
        { message: body?.message || "Login failed", body },
        { status: laravelRes.status },
      );
    }

    const token = body?.data?.token;
    const user = body?.data?.user ?? body?.user ?? null;

    const res = NextResponse.json(
      { user, message: body?.message || "OK" },
      { status: 200 },
    );

    if (token) {
      res.headers.set(
        "Set-Cookie",
        `token=${token}; Path=/; HttpOnly; SameSite=Lax`,
      );
    }

    return res;
  } catch (error: any) {
    console.error("/api/auth proxy error:", error);

    const devExtra =
      process.env.NODE_ENV !== "production" ? { stack: error?.stack } : {};

    return NextResponse.json(
      { message: error?.message || "Internal error", ...devExtra },
      { status: 500 },
    );
  }
}
