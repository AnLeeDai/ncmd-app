import { NextResponse } from "next/server";

type Params = { params: { path: string[] } };

function parseSetCookie(setCookieHeader: string) {
  const parts = setCookieHeader.split(";").map((p) => p.trim());
  const [namePart, ...attrParts] = parts;
  const eq = namePart.indexOf("=");
  const name = namePart.substring(0, eq);
  const value = namePart.substring(eq + 1);

  const opts: Record<string, any> = {};

  for (const attr of attrParts) {
    const [k, v] = attr.split("=");
    const key = k.toLowerCase();

    if (key === "path") opts.path = v;
    else if (key === "domain") opts.domain = v;
    else if (key === "max-age") opts.maxAge = parseInt(v, 10);
    else if (key === "expires") opts.expires = new Date(v);
    else if (key === "httponly") opts.httpOnly = true;
    else if (key === "secure") opts.secure = true;
    else if (key === "samesite") opts.sameSite = v as "lax" | "strict" | "none";
  }

  return { name, value: decodeURIComponent(value), opts };
}

async function forward(request: Request, ctx: Params | Promise<Params>) {
  const BACKEND_BASE =
    process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/";

  // `ctx` may be a promise in the Next runtime. Await it before using `params`.
  const { params } = await ctx;

  const path = params.path.join("/");

  // preserve querystring
  const reqUrl = new URL(request.url);
  const qs = reqUrl.search || "";

  const target = `${BACKEND_BASE}${path}${qs}`;

  // Build headers to send to backend. Only copy headers we care about.
  const headers: Record<string, string> = {};
  const contentType = request.headers.get("content-type");

  if (contentType) headers["content-type"] = contentType;
  const accept = request.headers.get("accept") || "application/json";

  headers["accept"] = accept;

  // Extract token cookie from incoming request and set Authorization if present
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|; )token=([^;]+)/);
  const rawToken = match ? match[1] : null;
  const token = rawToken ? decodeURIComponent(rawToken) : null;

  if (token) headers["authorization"] = `Bearer ${token}`;

  const init: RequestInit = {
    method: request.method,
    headers,
    // forward body when present
    body: ["GET", "HEAD"].includes(request.method)
      ? undefined
      : await request.text(),
  };

  const laravelRes = await fetch(target, init);

  // clone response body
  const resContentType = laravelRes.headers.get("content-type") || "";

  // Build NextResponse
  let nextRes: NextResponse;

  if (resContentType.includes("application/json")) {
    const body = await laravelRes.json().catch(() => null);

    nextRes = NextResponse.json(body, { status: laravelRes.status });

    // If backend returned a token in the JSON body (common when backend
    // doesn't set cookies), set a cookie on the response so the browser will
    // include it on subsequent proxied requests. We only set this when we
    // didn't already receive Set-Cookie headers from the backend.
    try {
      const tokenFromBody =
        body?.token ?? body?.data?.token ?? body?.data?.user?.token ?? null;

      // Always set a token cookie from the response body so the browser will
      // include it in subsequent proxied requests. This makes the proxy
      // guarantee a cookie is present regardless of whether the backend set
      // Set-Cookie headers.
      if (tokenFromBody) {
        const cookieOpts: Record<string, any> = {
          path: "/",
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 7 days
          sameSite: "lax",
          secure: false,
        };

        // Remove any domain to make cookie apply to the current host.
        if (cookieOpts.domain) delete cookieOpts.domain;

        nextRes.cookies.set("token", String(tokenFromBody), cookieOpts);
      }
    } catch {
      // ignore errors - setting a cookie is best-effort here
    }
  } else {
    const text = await laravelRes.text();

    nextRes = new NextResponse(text, { status: laravelRes.status });
  }

  // Forward Set-Cookie header(s) from backend (if present).
  // In Node (undici) the headers can be read via `headers.raw()` which returns
  // an array of set-cookie strings. In other runtimes there may be a single
  // `set-cookie` header string. Try both approaches and forward each cookie.
  const rawHeaders = (laravelRes.headers as any)?.raw?.();
  let setCookies: string[] = [];

  if (rawHeaders && rawHeaders["set-cookie"]) {
    setCookies = rawHeaders["set-cookie"] as string[];
  } else {
    const scHeader = laravelRes.headers.get("set-cookie");

    if (scHeader) setCookies = [scHeader];
  }

  for (const sc of setCookies) {
    try {
      const { name, value, opts } = parseSetCookie(sc);

      // Normalize cookie options so the cookie applies to this host and the
      // browser will store it. We remove domain, mark non-secure and fall
      // back SameSite to lax to increase compatibility across environments.
      if (opts && opts.domain) delete opts.domain;
      opts.secure = false;
      if (opts.sameSite && String(opts.sameSite).toLowerCase() === "none") {
        opts.sameSite = "lax";
      }

      nextRes.cookies.set(name, value, opts);
    } catch {
      // If parsing fails, forward the raw header as a fallback.
      nextRes.headers.append("set-cookie", sc);
    }
  }

  // Expose raw set-cookie values for local debugging so you can see what the
  // backend actually returned. This is only enabled in development.
  if (process.env.NODE_ENV === "development" && setCookies.length > 0) {
    try {
      nextRes.headers.set("x-debug-set-cookies", JSON.stringify(setCookies));
    } catch {
      // ignore JSON errors
    }
  }

  // copy a few useful headers back to the client
  const allowList = ["content-type", "cache-control", "vary"];

  for (const h of allowList) {
    const v = laravelRes.headers.get(h);

    if (v) nextRes.headers.set(h, v);
  }

  return nextRes;
}

export async function GET(request: Request, ctx: Params) {
  return forward(request, ctx);
}

export async function POST(request: Request, ctx: Params) {
  return forward(request, ctx);
}

export async function PUT(request: Request, ctx: Params) {
  return forward(request, ctx);
}

export async function PATCH(request: Request, ctx: Params) {
  return forward(request, ctx);
}

export async function DELETE(request: Request, ctx: Params) {
  return forward(request, ctx);
}

export async function OPTIONS(request: Request, ctx: Params) {
  return forward(request, ctx);
}
