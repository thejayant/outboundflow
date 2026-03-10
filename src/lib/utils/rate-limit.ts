type RateLimitConfig = {
  current: number;
  max: number;
};

export function assertUnderLimit({ current, max }: RateLimitConfig) {
  if (current >= max) {
    throw new Error(`Rate limit reached (${current}/${max}).`);
  }
}
