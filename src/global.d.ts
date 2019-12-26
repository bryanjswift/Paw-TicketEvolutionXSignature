declare function registerDynamicValueClass(o: any): void;

declare function DynamicValueInput(key: string, label: string, valueType: string): void;

declare class DynamicValue {
  constructor(valueType: string, options: any);
  getEvaluatedString(): string;
}
