export function sortByDocumentPosition<V>(registry: Map<string, V>): Map<string, V> {
  if (typeof document === "undefined" || registry.size <= 1) return registry;

  const positions = new Map<string, number>();
  let counter = 0;
  for (const el of document.querySelectorAll<HTMLElement>("[data-vp-block]")) {
    const name = el.dataset.vpBlock;
    if (name && !positions.has(name) && registry.has(name)) {
      positions.set(name, counter++);
    }
  }

  const sorted = [...registry.entries()].sort(([a], [b]) => {
    const pa = positions.get(a) ?? Number.MAX_SAFE_INTEGER;
    const pb = positions.get(b) ?? Number.MAX_SAFE_INTEGER;
    return pa - pb;
  });

  return new Map(sorted);
}
