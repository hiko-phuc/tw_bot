import needle from 'needle'

export default class Tweet {
    constructor(token, rules) {
        this.token = token;
        this.rules = rules || [];
        this.rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
        this.streamURL = 'https://api.twitter.com/2/tweets/search/stream';
        let currentRules;
        try {
            currentRules = this.getAllRules();
            this.deleteAllRules(currentRules);
            this.setRules(this.rules);

        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    }

    async getAllRules() {

        const response = await needle('get', this.rulesURL, {
            headers: {
                "authorization": `Bearer ${this.token}`
            }
        })
        if (response.statusCode !== 200) {
            console.log("Error:", response.statusMessage, response.statusCode)
            throw new Error(response.body);
        }

        return (response.body);
    }

    async deleteAllRules(rules) {

        if (!Array.isArray(rules.data)) {
            return null;
        }

        const ids = rules.data.map(rule => rule.id);

        const data = {
            "delete": {
                "ids": ids
            }
        }

        const response = await needle('post', this.rulesURL, data, {
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${this.token}`
            }
        })

        if (response.statusCode !== 200) {
            throw new Error(response.body);
        }

        return (response.body);

    }

    async setRules(rules) {

        const data = {
            "add": rules
        }

        const response = await needle('post', this.rulesURL, data, {
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${this.token}`
            }
        })

        if (response.statusCode !== 201) {
            throw new Error(response.body);
        }

        return (response.body);

    }

    streamConnect(retryAttempt, cb) {

        const stream = needle.get(this.streamURL, {
            headers: {
                "User-Agent": "v2FilterStreamJS",
                "Authorization": `Bearer ${this.token}`
            },
            timeout: 20000
        });

        stream.on('data', data => {
            try {
                const json = JSON.parse(data);
                cb(json);
                retryAttempt = 0;
            } catch (e) {
                if (data.detail === "This stream is currently at the maximum allowed connection limit.") {
                    console.log(data.detail)
                    process.exit(1)
                } else {
                }
            }
        }).on('err', error => {
            if (error.code !== 'ECONNRESET') {
                console.log(error.code);
                process.exit(1);
            } else {
                setTimeout(() => {
                    console.warn("A connection error occurred. Reconnecting...")
                    streamConnect(++retryAttempt);
                }, 2 ** retryAttempt)
            }
        });
        return stream;
    }
}
