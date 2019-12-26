type HttpMethod = 'GET' | 'POST';

interface PawRequest {
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

interface RuntimeInfo {
  readonly task: 'requestSend' | 'dynamicValuePreview' | 'codeGenerationPreview' | 'codeGenerationCopyToClipboard' | 'export' | 'stringCopyToClipboard';
  readonly isMainThread: boolean;
}

interface PawContext {
  runtimeInfo: RuntimeInfo;
  getCurrentRequest(): PawRequest;
}

interface TicketEvolutionDynamicValues {
  readonly secret: string;
  readonly token: string;
}

class XSignature implements TicketEvolutionDynamicValues {
  static identifier = 'com.bryanjswift.PawExtensions.XSignature'
  static title = 'Ticket Evolution X-Signature'
  static help = 'https://ticketevolution.atlassian.net/wiki/spaces/API/pages/983115/Signing+requests+with+X-Signature'
  static inputs = [
    DynamicValueInput('secret', 'API Secret', "SecureValue"),
  ]
  secret = '';
  token = '';

  evaluate(context: PawContext) {
    const request = context.getCurrentRequest();
    // GET api.ticketevolution.com/v9/brokerages?page=1&per_page=1
    const url = request.getUrl().replace(/^.*\/\//, '');
    const input = `${request.getMethod()} ${url}`;
    const hmac = new DynamicValue('com.luckymarmot.HMACDynamicValue', {
      input,
      key: this.secret,
      encoding: 'Base64',
      algorithm: 3, /* sha256 */
      uppercase: true,
    });
    // GET api.ticketevolution.com/v9/brokerages?page=1&per_page=1
    // GET api.sandbox.ticketevolution.com/v9/brokerages?page=1&per_page=1
    return hmac.getEvaluatedString();
  }
}

// call to register function is required
registerDynamicValueClass(XSignature);