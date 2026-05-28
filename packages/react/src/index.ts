import { Block } from "./block";
import { Variant } from "./variant";
import { WhichlyPicker } from "./whichly-picker";

export { WhichlyProvider, type WhichlyProviderProps } from "./provider";
export { Block, type BlockProps } from "./block";
export { Variant, type VariantProps } from "./variant";
export { WhichlyPicker, type WhichlyPickerProps } from "./whichly-picker";

export const Whichly = {
  Block,
  Variant,
  Picker: WhichlyPicker,
};
