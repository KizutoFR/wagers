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