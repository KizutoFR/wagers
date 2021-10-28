const axios = require('axios');
const riotConsts = require('../config/url.json');
const { format } = require('../config/utils.js');

class RiotAPI {

    static getSummonerByName(username, region) {
        return get(format(url('API', 'summonerByName'), {
            region: riotConsts.REGIONS[region.toUpperCase()],
            version: 'v4',
            username
        }));
    }

    static getSummonerRank(encryptedSummonerId, region) {
        return get(format(url('API', 'summonerRank'), {
            region: riotConsts.REGIONS[region.toUpperCase()],
            version: 'v4',
            encryptedSummonerId
        }));
    }

    static getSummonerMasteries(encryptedSummonerId, region) {
        return get(format(url('API', 'summonerMasteries'), {
            region: riotConsts.REGIONS[region.toUpperCase()],
            version: 'v4',
            encryptedSummonerId
        }));
    }

    static getLastMatch (encryptedSummonerId, region) {
        return get(format(url('API', 'lastMatch'), {
            region: riotConsts.REGIONS[region.toUpperCase()],
            version: 'v4',
            encryptedSummonerId
        }));
    }

    static getCurrentMatch(summonerName, region) {
        return new Promise((resolve, reject) => {
            this.getSummonerByName(summonerName, region)
                .then(async summoner => {
                    const currentMatch = await this.getLastMatch(summoner.id, region);
                    //no

                    resolve({
                        overview: summoner,
                        currentMatch
                    });
                })
                .catch(() => {
                    reject();
                });
        });
    }

    static getSummonerOverview(summonerName, region) {
        return new Promise((resolve, reject) => {
            this.getSummonerByName(summonerName, region)
                .then(async summoner => {
                    const rank = await this.getSummonerRank(summoner.id, region);
                    //no
                    
                    const masteries = await this.getSummonerMasteries(summoner.id, region);
                    //const matches = await ...;

                    resolve({
                        overview: summoner,
                        rank,
                        masteries
                    });
                })
                .catch(() => {
                    reject();
                });
        });
    }
};





const checkStatus = res => {
    if (res.status === 200)
        return res;
    throw new Error();
};

/**
 * Find and returns the value corresponding to the key on given json
 * For URL only
 * @param {Object} jsonObj the json object it has to find in
 * @param {String} key key to find in the json object
 * @return {String} the found url
 */
const url = (domain, key) => {
    if (domain in riotConsts && key in riotConsts[domain])
        return riotConsts[domain].base + riotConsts[domain][key];

    return '';
};

const get = url => {
    const options = {
        headers: {}
    };

    const suffix = url.includes('api.riotgames.com');

    if (suffix)
        options.headers['X-Riot-Token'] = getRiotAPIkey();

    if (process.env.LOG_LEVEL === 'dev')
        console.info("[RIOT JSON REQUEST] " + url + (suffix ? getRiotAPIkey(true) : ''));

    return axios.get(url, options)
        .then(checkStatus)
        .then(res => res.data)
        .catch(console.error);
};

const getRiotAPIkey = (query = false) => (query ? '?api_key=' : '') + process.env.RIOT_API_KEY;


module.exports = RiotAPI;