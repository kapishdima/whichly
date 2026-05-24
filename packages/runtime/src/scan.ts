import type { BlocksMap } from "./types";

export function scanBlocks(root: ParentNode = document): BlocksMap {
  const map: BlocksMap = new Map();

  for (const el of root.querySelectorAll<HTMLElement>("[data-vp-block]")) {
    const block = el.dataset.vpBlock;
    const variant = el.dataset.vpVariant;
    if (!block || !variant) continue;

    let variants = map.get(block);
    if (!variants) {
      variants = [];
      map.set(block, variants);
    }
    if (!variants.includes(variant)) variants.push(variant);
  }

  return map;
}

export function sameShape(a: BlocksMap, b: BlocksMap): boolean {
  if (a.size !== b.size) return false;
  for (const [block, av] of a) {
    const bv = b.get(block);
    if (!bv || bv.length !== av.length) return false;
    for (let i = 0; i < av.length; i++) {
      if (av[i] !== bv[i]) return false;
    }
  }
  return true;
}
