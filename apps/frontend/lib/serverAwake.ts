/** 무료 서버 콜드스타트 후 유지되는 예상 시간 */
export const SERVER_AWAKE_TTL_MS = 15 * 60 * 1000;

const SERVER_AWAKE_KEY = "serverAwakeUntil";

export function isServerAwakeCached(): boolean {
  if (typeof window === "undefined") return false;
  const until = Number(localStorage.getItem(SERVER_AWAKE_KEY) || 0);
  return Date.now() < until;
}

export function markServerAwake(): void {
  localStorage.setItem(
    SERVER_AWAKE_KEY,
    String(Date.now() + SERVER_AWAKE_TTL_MS),
  );
}

export function clearServerAwake(): void {
  localStorage.removeItem(SERVER_AWAKE_KEY);
}
