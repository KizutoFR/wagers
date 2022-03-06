/**
 * Replace matches in a string
 * @param {String} str string to format
 * @param {Object} matches object of pair<substr, replacement> matches
 * @example
 * 	format(
 * 		"https://api.riotgames.com/{region}/{username}",
 * 		{
 * 			region: 'EUW1',
 * 			username: 'noxfly
 * 		}
 * 	);
 * // --> "https://api.riotgames.com/EUW1/noxfly"
 * @return {String} formated string
 */
module.exports.format = (str, matches = {}) => {
    for (let match of Object.keys(matches)) {
        const reg = new RegExp(`\{${match}\}`);
        str = str.replace(reg, matches[match]);
    }

    return str;
};

module.exports.getAverageValues = (arr) => {
    let result = {};
    arr.forEach((stats, index) => {
        for(const name in stats) {
            if(!result[name])
                result[name] = 0;
            if(typeof stats[name] === 'number') {
                result[name] += stats[name];
            }else if(typeof stats[name] === 'boolean') {
                if(stats[name]) {
                    result[name] += 1;
                }
            }
            if(index === arr.length - 1){
                result[name] = result[name] / arr.length;
            }
        }
    });

    return result;
}

module.exports.calculateCote = (req, moy) => {
    const min = req.value < moy ? req.min : moy;
    const max = req.value < moy ? moy : req.max;
    const min_cote = req.value < moy ? 1.1 : 1.5;
    const max_cote = req.value < moy ? 1.5 : 3;
    const diff_ratio = req.value / moy;
    const cote_final = ((req.value - min) / (max - min)) * (max_cote - min_cote) + min_cote;

    return req.value < moy ? cote_final : (cote_final + (1.5 * diff_ratio)) / 2;
}