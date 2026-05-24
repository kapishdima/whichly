export function makeObserver(onChange: () => void): MutationObserver {
  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      onChange();
    });
  });
  observer.observe(document.body, { subtree: true, childList: true });
  return observer;
}
