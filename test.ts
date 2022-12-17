import { Tor } from "./mod.ts";
const tor = new Tor();

// Start Tor
await tor.start();

setTimeout(async () => {
    console.log("getting website")
    let torWiki = await tor.get("http://juhanurmihxlp77nkq76byazcldy2hlmovfu2epvl5ankdibsot4csyd.onion/");
    console.log("Tor Wiki:");
    console.log(torWiki);
    Deno.writeTextFile("torWiki.html", torWiki);
}, 5000);