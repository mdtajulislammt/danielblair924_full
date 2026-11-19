export const getBody = (res: any) =>
  res && typeof res === "object" && "config" in res && "headers" in res ? res.data : res;

export function unwrap<T = any>(res: any): T {
  const body = getBody(res);
  if (
    body &&
    typeof body === "object" &&
    !Array.isArray(body) &&
    (body.status === "success" || body.status === "error") &&
    "data" in body
  ) {
    return body.data as T;
  }
  return body as T;
}

export function getErrorMessage(err: any, fallback = "Something went wrong"): string {
  const m = err?.response?.data?.message ?? err?.message;
  return Array.isArray(m) ? m.join(", ") : m || fallback;
}

