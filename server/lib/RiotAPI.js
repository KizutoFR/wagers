const axios = require('axios');
const riotConsts = require('../config/url.json');
const { format } = require('../config/utils.js');
const champions = require('../config/champion.json');

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
        return get(format(url('API', 'currentMatch'), {
            region: riotConsts.REGIONS[region.toUpperCase()],
            version: 'v4',
            encryptedSummonerId
        }));
    }

    static getMatchDetails (matchId, region) {
        return get(format(url('API', 'lastMatchDetails'), {
            region: riotConsts.REGIONS['match_'+region.toUpperCase()],
            version: 'v5',
            matchId
        }))
    }

    static getCurrentMatch(summonerName, match_id, region) {
        return new Promise((resolve, reject) => {
            this.getSummonerByName(summonerName, region)
                .then(async summoner => {
                    try {
                        const currentMatch = await this.getLastMatch(summoner.id, region);
                        if(currentMatch) {
                            currentMatch.participants = await Promise.all(currentMatch.participants.map(async p => {
                                const summonerInfo = await this.getSummonerRank(p.summonerId, region);
                                const champ = findInChamp(p.championId);
                                let game_type_id = 0;
                                if(currentMatch.gameType === "MATCHED_GAME") {
                                    game_type_id = 1
                                }
                                const rank = summonerInfo && summonerInfo[game_type_id] ? summonerInfo[game_type_id].tier : "None";
                                return {...p, championName: champ, rank}
                            }))
                        }
                        
                        const current_match_id = match_id ? match_id : currentMatch.gameId;
                        const match_identifier = riotConsts.REGIONS[region.toUpperCase()].toUpperCase() + '_' + current_match_id;
                        const matchDetails = await this.getMatchDetails(match_identifier, region);
                        resolve(currentMatch, matchDetails);
                    } catch (err) {
                        reject(err.message)
                    }
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
                    resolve({
                        overview: summoner,
                        rank
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
    return null;
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
        .catch(err => console.error(err.message));
};

const findInChamp = id => {
    for (const [key, value] of Object.entries(champions.data)) {
        if(parseInt(value.key) === id){
            return key;
        }
    }
}

const getRiotAPIkey = (query = false) => (query ? '?api_key=' : '') + process.env.RIOT_API_KEY;


module.exports = RiotAPI;