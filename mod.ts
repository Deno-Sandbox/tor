export class Tor {
    private hostname = "127.0.0.1:9050"

    constructor(hostname?){
        if(hostname){
            this.hostname = hostname;
        }
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
        
        //stop after 60 sec
        setTimeout(() => {
            p.close();
        }, 60000);

        // get the p status
        let status = await p.status();
        let text
        if(status.success){
            text = await p.output();
        } else {
            text = await p.stderrOutput();
        };
        text = new TextDecoder().decode(text)+"\n";
        return text;
    }

    public async checkProxyIsOnline(fatal?, verbose?){
        if(fatal === undefined){
            fatal = false;
        }
        if(verbose === undefined){
            verbose = true;
        }
        if(verbose){
            console.log("Checking Tor proxy is online...");
        }
        let cmd = `curl -x socks5h://${this.hostname} http://www.google.com`;
        let text = await this.executeCurl(cmd);
        if(!text.includes("Google")){
            if(verbose){
                console.log("Tor proxy is not online 🧅");
                console.log("Please check your proxy settings");
            }
            if(fatal){
                Deno.exit(1);
            }
            return false
        } else {
            if(verbose){
                console.log("Tor proxy is online 🧞");
            }
            return true
        }
    }
}