export class Tor {
    private hostname = "127.0.0.1:9050"

    constructor(hostname?){
        if(hostname){
            this.hostname = hostname;
        }
        this.checkProxyIsOnline()
    }

    public async get(url){
        let cmd = `curl -x socks5h://${this.hostname} ${url}`;
        return await this.executeCurl(cmd);
    }

    public async post(url, data){
        let cmd = `curl -x socks5h://${this.hostname} -d '${data}' ${url}`;
        return await this.executeCurl(cmd);
    }

    private async executeCurl(cmd){
        cmd = cmd.split(' ');
        let p = await Deno.run({
            cmd,
            stdout: "piped",
            stderr: "piped"
        });
        
        // get the p status
        let status = await p.status();
        let text
        if(status.success){
            text = await p.output();
        } else {
            text = await p.stderrOutput();
        };
        text = new TextDecoder().decode(text);
        return text;
    }

    public async checkProxyIsOnline(){
        console.group("Checking Tor proxy is online...");
        let cmd = `curl -x socks5h://${this.hostname} http://www.google.com`;
        let text = await this.executeCurl(cmd);
        if(!text.includes("Google")){
            console.log("Tor proxy is not online 🧅");
            console.log("Please check your proxy settings");
            Deno.exit(1);
        } else {
            console.log("Tor proxy is online 🧞");
        }
    }
}