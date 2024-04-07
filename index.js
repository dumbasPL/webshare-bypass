#! /usr/bin/env node
const { program } = require('commander');
const ProxyChain = require('proxy-chain');
const dns = require('dns');
const { promisify } = require('util');
const package = require('./package.json');

const resolve4 = promisify(dns.resolve4);

if (require.main !== module) {
  throw new Error('This script should be run as a cli tool, if you need this as a module, please just copy the code and adjust it to your needs');
}

program
  .name(package.name)
  .version(package.version, '-v, --version')
  .description(package.description)
  .option('-p, --port <port>', 'Port to listen on', 8080)
  .option('-l, --listen <listen>', 'Host to listen on', 'localhost')
  .option('-h, --host <host>', 'Proxy host to connect to', 'p.webshare.io:80')

program.parse();

const { port, host: proxyHost, listen } = program.opts();

const server = new ProxyChain.Server({
  port: port,
  host: listen,
  prepareRequestFunction: async ({ request, username, password }) => {
    if (request.method != 'CONNECT') {
      throw new ProxyChain.RequestError('Only CONNECT method is supported', 405);
    }
    const [host, port] = request.url.split(':');

    // resolve the host locally
    const ip = (await resolve4(host))[0];

    request.url = `${ip}:${port}`;
    request.headers.host;

    return {
      upstreamProxyUrl: `http://${username}:${password}@${proxyHost}`,
    }
  },
});

server.listen().then(() => {
  console.log(`Proxy server is listening on port ${server.port}`);
});

// ctrl+c handler
let closing = false;
process.on('SIGINT', async () => {
  if (closing) {
    console.log('Forcing exit...');
    await server.close(true);
    process.exit(1);
  }

  console.log('Closing server...');
  closing = true;
  await server.close();
  process.exit(0);
});

// unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// uncaught exception handler
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception thrown', error);
  process.exit(1);
});