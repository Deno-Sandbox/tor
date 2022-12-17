# Tor 🧅
Make request on the Tor network with Deno 🕶

> need to have Tor socks5 proxy running, on linux run `tor`

```ts
import { Tor } from "https://deno.land/x/tor/mod.ts"
const tor = new Tor()
```

## Start tor
```ts
await tor.start()
```


## Check the tor socks5 proxy is online
```ts
let check = tor.checkProxyIsOnline()
```

## Make a request
### Get
```ts
let response =  await tor.get("YOUR_ONION_URL");
```
### Post
```ts
let response =  await tor.post("YOUR_ONION_URL", "HERE YOUR DATA");
```