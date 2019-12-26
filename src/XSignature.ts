interface TicketEvolutionDynamicValues {
  readonly secret: string;
}

/**
 * Used to strip protocol from the front of `Request.url`.
 */
const PROTOCOL_MATCHER = /^.*\/\//;

/**
 * Create the input value for the `com.luckymarmot.HMACDynamicValue` based on
 * the request method.
 * @param request used to generate input.
 * @returns appropriate input based on request method.
 * @see https://ticketevolution.atlassian.net/wiki/spaces/API/pages/983115/Signing+requests+with+X-Signature
 */
function createHmacInput(request: Request) {
  switch (request.getMethod()) {
    case 'GET':
      return createHmacInputQuery(request);
    default:
      return createHmacInputBody(request);
  }
}

/**
 * Use the request body to create HMAC input.
 * @param request used to generate input.
 * @returns generated HMAC input based on request body.
 */
function createHmacInputBody(request: Request) {
  const method = request.getMethod();
  const url = request.getUrl().replace(PROTOCOL_MATCHER, '');
  const suffix = `?${request.body}`;
  return `${method} ${url}${suffix}`;
}

/**
 * Use the request query parameters to create HMAC input.
 * @param request used to generate input.
 * @returns generated HMAC input based on request query parameters.
 */
function createHmacInputQuery(request: Request) {
  const method = request.getMethod();
  const url = request.getUrl().replace(PROTOCOL_MATCHER, '');
  // If the query is empty append a '?'
  const suffix = request.urlQuery.length === 0 ? '?' : '';
  return `${method} ${url}${suffix}`;
}

class XSignature implements TicketEvolutionDynamicValues {
  static identifier = 'com.bryanjswift.PawExtensions.XSignature'
  static title = 'Ticket Evolution X-Signature'
  static help = 'https://ticketevolution.atlassian.net/wiki/spaces/API/pages/983115/Signing+requests+with+X-Signature'
  static inputs = [
    DynamicValueInput('secret', 'API Secret', 'SecureValue'),
  ]
  secret = '';

  evaluate(context: Context) {
    const request = context.getCurrentRequest();
    const input = createHmacInput(request);
    const hmac = new DynamicValue('com.luckymarmot.HMACDynamicValue', {
      input,
      key: this.secret,
      encoding: 'Base64',
      algorithm: 3, /* sha256 */
      uppercase: true,
    });
    return hmac.getEvaluatedString();
  }

  text() {
    return this.secret;
  }
}

// call to register function is required
registerDynamicValueClass(XSignature);
