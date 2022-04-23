import { Tor } from "./mod.ts";
const tor = new Tor();

let torWiki = await tor.get("http://zqktlwiuavvvqqt4ybvgvi7tyo4hjl5xgfuvpdf6otjiycgwqbym2qad.onion/wiki/index.php/Main_Page");
console.log(torWiki);
Deno.writeTextFile("torWiki.html", torWiki);