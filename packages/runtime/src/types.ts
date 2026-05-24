export type BlockName = string;
export type VariantName = string;

export type BlocksMap = Map<BlockName, VariantName[]>;

export type State = Record<BlockName, VariantName>;
