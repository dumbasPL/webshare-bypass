# webshare-bypass

Bypass client_connect_forbidden_host error on webshare.io by resolving the dns locally.

This program creates a proxy that forwards all requests to the upstream proxy replaces the
hostname with the resolved ip address. This bypasses their blacklist of hostnames.

Please be nice and don't abuse this too hard so it can continue to work for as long as possible ;)

When connecting to the local proxy simply specify your webshare credentials and 
they will be forwarded to the upstream proxy meaning you only need a single 
instance of this running and can connect to may proxies at once via the webshare
backbone connection.

ONLY WORKS WITH `HTTP` PROXIES AND THE `CONNECT` METHOD!

## Usage

`npm install -g webshare-bypass`
`webshare-bypass --help`
```
Usage: webshare-bypass [options]

Bypass client_connect_forbidden_host on webshare.io

Options:
  -v, --version          output the version number
  -p, --port <port>      Port to listen on (default: 8080)
  -l, --listen <listen>  Host to listen on (default: "localhost")
  -h, --host <host>      Proxy host to connect to (default: "p.webshare.io:80")
  --help                 display help for command
```