import { mount } from "./mount";

export { mount };

if (typeof window !== "undefined") {
  (window as unknown as { Optio: { mount: typeof mount } }).Optio = { mount };
}
