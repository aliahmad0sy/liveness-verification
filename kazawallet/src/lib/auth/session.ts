export function getSessionFromRequest(request: Request): string | null {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/kaza_session=([^;]+)/);
  return match ? match[1] : null;
}

export function makeSessionCookie(token: string, clear = false): string {
  if (clear) {
    return "kaza_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
  }
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const maxAge = 60 * 60 * 24 * 7;
  return `kaza_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}
