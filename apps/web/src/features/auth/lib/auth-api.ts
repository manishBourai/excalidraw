import { httpRequest } from "../../drawing/lib/http-client";
import type { AuthUser } from "./auth-storage";

type AuthResponse = {
  message: string;
  data: AuthUser;
  token: string;
};

export function signin(email: string, password: string) {
  return httpRequest<AuthResponse>("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signup(username: string, email: string, password: string) {
  return httpRequest<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}
