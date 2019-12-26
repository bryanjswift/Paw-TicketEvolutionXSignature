This is an implementation to generate the X-Signature required of the [Ticket
Evolution API][tevo-api] for the [Paw][paw] application.

[tevo-api]: https://ticketevolution.atlassian.net/wiki/spaces/API/pages/983115/Signing+requests+with+X-Signature
[paw]: https://paw.cloud

## Development

### Prerequisites

```shell
npm install
```

### Build

Compiles the source files into the JavaScript which can be used by the Paw
application.

```shell
make build
```

### Install

Moves the built files into the local "Application Support" directory for
`com.luckymarmot.Paw`.

```shell
make install
```

### Test

```shell
npm test
```

## License

This Paw Extension is released under the [MIT License](LICENSE). Feel free to
fork, and modify!

Copyright © 2019 Bryan J Swift
