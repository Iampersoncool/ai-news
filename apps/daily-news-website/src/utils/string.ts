import { timingSafeEqual } from 'node:crypto';

export function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);

  if (aBuf.length !== bBuf.length) return false;

  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
