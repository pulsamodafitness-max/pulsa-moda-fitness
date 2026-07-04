import { getIronSession, SessionOptions } from "iron-session"

const SESSION_SECRET = process.env.SESSION_SECRET
if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
  throw new Error("SESSION_SECRET must be set and at least 32 characters long")
}

const SESSION_OPTIONS: SessionOptions = {
  password: SESSION_SECRET,
  cookieName: "pulsa-admin",
  cookieOptions: { secure: process.env.NODE_ENV === "production", httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 8 },
}

export interface AdminSession {
  authenticated?: boolean
}

export function getSession(request: Request, response: Response) {
  return getIronSession<AdminSession>(request, response, SESSION_OPTIONS)
}

export function getSessionOptions() {
  return SESSION_OPTIONS
}
