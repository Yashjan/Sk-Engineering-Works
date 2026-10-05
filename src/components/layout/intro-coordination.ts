const waiting = new Set<() => void>();

export function waitForIntro(start: () => void) {
  const { skIntro, skIntroRevealing } = document.documentElement.dataset;
  if (skIntroRevealing === "true" || skIntro !== "active") {
    start();
    return () => {};
  }
  waiting.add(start);
  return () => { waiting.delete(start); };
}

export function releaseHeroEntrance() {
  document.documentElement.dataset.skIntroRevealing = "true";
  waiting.forEach((start) => start());
  waiting.clear();
}
