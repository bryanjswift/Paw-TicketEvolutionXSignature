interface TicketEvolutionDynamicValues {
  readonly secret: string;
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
    const url = request.getUrl().replace(/^.*\/\//, '');
    const input = `${request.getMethod()} ${url}`;
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
