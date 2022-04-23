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
            stdout: "piped"
        });
        let output = await p.output();
        let decoder = new TextDecoder();
        let text = decoder.decode(output);
        return text;
    }
}