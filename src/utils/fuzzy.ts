export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[] = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(
        dp[j] + 1,
        dp[j - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      prev = tmp;
    }
  }
  return dp[n];
}

export function fuzzyIncludes(haystack: string, needle: string): boolean {
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  if (h.includes(n)) return true;
  const hWords = h.split(/\s+/);
  const nWords = n.split(/\s+/);
  for (const hw of hWords) {
    for (const nw of nWords) {
      if (hw.startsWith(nw) || nw.startsWith(hw)) return true;
      if (nw.length >= 4 && hw.length >= 4) {
        const dist = levenshtein(hw, nw);
        const tol = Math.floor(Math.max(hw.length, nw.length) * 0.3);
        if (dist <= tol) return true;
      }
    }
  }
  return false;
}
