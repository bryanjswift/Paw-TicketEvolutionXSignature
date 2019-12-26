declare type RuntimeInfoTask = 'requestSend' | 'dynamicValuePreview' | 'codeGenerationPreview' | 'codeGenerationCopyToClipboard' | 'export' | 'stringCopyToClipboard';

declare function registerDynamicValueClass(o: any): void;

declare function DynamicValueInput(key: string, label: string, valueType: string): void;

declare class DynamicValue {
  constructor(valueType: string, options: any);
  getEvaluatedString(): string;
}

declare interface PawRequest {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly url: string;
  readonly urlBase: string;
  readonly urlQuery: string;
  readonly method: HttpMethod;
  getMethod(): HttpMethod;
  getUrl(): string;
  getUrlParametersNames(): string[];
  getUrlParametersByName(name: string): string;
  getHeadersNames(): string[];
  getHeadersByName(name: string): string;
  addHeader(name: string, value: string): void;
  setHeader(name: string, value: string): void;
}

declare interface RuntimeInfo {
  readonly task: RuntimeInfoTask;
  readonly isMainThread: boolean;
}

declare interface PawContext {
  runtimeInfo: RuntimeInfo;
  getCurrentRequest(): PawRequest;
}
