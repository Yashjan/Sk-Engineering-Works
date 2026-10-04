const waiting = new Set<() => void>();
let released = false;

export function waitForIntro(start: () => void) {
  if (released || document.documentElement.dataset.skIntro !== "active") {
    start();
    return () => {};
  }
  waiting.add(start);
  return () => { waiting.delete(start); };
}

export function releaseHeroEntrance() {
  released = true;
  waiting.forEach((start) => start());
  waiting.clear();
}
