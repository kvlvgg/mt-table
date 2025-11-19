export type KebabToSnakeCase<S extends string> = S extends `${infer Head}-${infer Tail}`
  ? `${Head}_${KebabToSnakeCase<Tail>}`
  : S;

export type ChemicalElementType =
  | 'reactive-nonmetal'
  | 'noble-gase'
  | 'alkali-metal'
  | 'alkali-earth-metal'
  | 'metalloid'
  | 'post-transition-metal'
  | 'transition-metal'
  | 'not-defined'
  | 'lanthanoid'
  | 'actinoid';

export type ChemicalElement = {
  atomicNumber: number;
  chemicalSymbol: string;
  atomicMass: string;
  group: number;
  period: number;
  type: ChemicalElementType;
};
