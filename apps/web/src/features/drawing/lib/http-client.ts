type RequestOptions = RequestInit & {
  token?: string;
};

const DEFAULT_HTTP_URL = "http://localhost:3002";

export const httpApiBaseUrl =
  process.env.NEXT_PUBLIC_HTTP_API_URL ?? DEFAULT_HTTP_URL;

export async function httpRequest<T>(
  path: string,
  { token, headers, ...init }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`${httpApiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    credentials: "include",
  });

  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : "Request failed";
    throw new Error(message);
  }

  return payload as T;
}
