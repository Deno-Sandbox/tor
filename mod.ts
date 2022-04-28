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
        let i = setTimeout(async () => {
            try{
                //console.log('Max time reached, killing process...');
                let p2 = await Deno.run({
                    cmd: ("kill -9 "+p.pid).split(' '),
                    stdout: "piped",
                    stderr: "piped"
                })
                let status = await p2.status();
                if(status.success){
                    await p2.output();
                } else {
                    await p2.stderrOutput();
                };
            } catch(err){
                //console.log(err)
            }
        }, 60000);
        let text
        try{
            // get the p status
            let status = await p.status();
            if(status.success){
                text = await p.output();
            } else {
                text = await p.stderrOutput();
            };
            //clearTimeout(i);
            text = new TextDecoder().decode(text)+"\n";
        } catch(err){
            text = "";
        }
        
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