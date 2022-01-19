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
    static getOPGGByName(username, region) {
        return format(url('OPGG', 'summonerByName'), {
            region: riotConsts.REGIONSOPGG[region.toUpperCase()],
            username
        });
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
        return get(format(url('API', 'matchDetails'), {
            region: riotConsts.REGIONS['match_'+region.toUpperCase()],
            version: 'v5',
            matchId
        }))
    }

    static getMatchesIdList(start, limit, puuid, region){
        return get(format(url('API', 'matchList'), {
            region: riotConsts.REGIONS['match_'+region.toUpperCase()],
            version: 'v5',
            start,
            limit,
            puuid
        }))
    }

    static getMatchHistory(summonerName, limit, region) {
        const BATCH_SIZE = 5;
        const BATCH_DELAY = 1500;
        let i = 0;

        return new Promise(async (resolve) => {
            let matchStatsList = [];

            const summoner = await this.getSummonerByName(summonerName, region)
            if(summoner) {
                const matches_id = await this.getMatchesIdList(0, limit, summoner.puuid, region);
                const queue = setInterval(async () => {
                    const batch = matches_id.slice(BATCH_SIZE*i, BATCH_SIZE + (BATCH_SIZE * i))

                    if(batch.length < 1) {
                        clearInterval(queue);
                        resolve(matchStatsList);
                    }

                    matchStatsList.push(...await Promise.all(batch.map(async e => {
                        const match = await this.getMatchDetails(e, region);
                        const summoner_stats = match.info.participants.find(e => e.puuid === summoner.puuid);
                        const {kills, win, visionScore, turretKills, pentaKills, goldEarned, assists} = summoner_stats;
                        return {kills, win, visionScore, turretKills, pentaKills, goldEarned, assists};
                    })))

                    i++;
                }, BATCH_DELAY)
            }
        })
    }

    static getCurrentMatch(summonerName, match_id, region) {
        return new Promise(async (resolve, reject) => {
            const summoner = await this.getSummonerByName(summonerName, region)
            let currentMatch = {}
            if(summoner) {
                currentMatch = await this.getLastMatch(summoner.id, region);
                let current_match_id = match_id;
                if(currentMatch) {
                    currentMatch.participants = await Promise.all(currentMatch.participants.map(async p => {
                        let summonerInfo = await this.getSummonerRank(p.summonerId, region);
                        const champ = findInChamp(p.championId);
                        let rank = "None";
                        if(summonerInfo){
                            summonerInfo = summonerInfo.filter(info => allowedQueueType.includes(info.queueType))
                            rank = summonerInfo.find(info => {
                                if(currentMatch.gameQueueConfigId === allowedQueueId.RANKED_SOLO_DUO && info.queueType === "RANKED_SOLO_5x5") {
                                    return info;
                                }

                                if(currentMatch.gameQueueConfigId === allowedQueueId.RANKED_FLEX && info.queueType === "RANKED_FLEX_SR") {
                                    return info;
                                }
                            });
                            
                            rank = rank ? rank.tier : null;
                        }
                        return {...p, championName: champ, rank}
                    }))
                } else {
                    currentMatch = {};
                }
                let matchDetails = null;
                if (current_match_id) {
                    const match_identifier = riotConsts.REGIONS[region.toUpperCase()].toUpperCase() + '_' + current_match_id;
                    matchDetails = await this.getMatchDetails(match_identifier, region);
                    if(matchDetails){
                        matchDetails.info.participants = matchDetails.info.participants.find(player => player.puuid === summoner.puuid);
                    }
                    currentMatch.matchDetails = matchDetails ? matchDetails : null;
                }
            }
            resolve(currentMatch);
        });
    }

    static getSummonerOverview(summonerName, region) {
        return new Promise((resolve, reject) => {
            this.getSummonerByName(summonerName, region)
                .then(async summoner => {
                    let rank = await this.getSummonerRank(summoner.id, region);
                    rank = rank.filter(r => allowedQueueType.includes(r.queueType))
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

const allowedQueueType = [
    "RANKED_FLEX_SR",
    "RANKED_SOLO_5x5"
]

const allowedQueueId = {
    "RANKED_SOLO_DUO": 420,
    "RANKED_FLEX": 440
}

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