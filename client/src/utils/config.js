export const SLUG = [
        "league-of-legends"
];

export const VICTORY_REQUIREMENTS = [
    {
        "identifier": "MATCH_WIN",
        "label": "Victory",
        "figure": "images/crown.svg",
        "params": false,
        "type": "boolean"
    },
    {
        "identifier": "KILLS_AMOUNT",
        "label": "Minimum player killed",
        "figure": "images/tower.svg",
        "params": true,
        "type": "number",
        "min": 1,
        "max": 40
    },
    {
        "identifier": "DESTROYED_TURRET",
        "label": "Minimum destroyed turret",
        "figure": "images/tower.svg",
        "params": true,
        "type": "number",
        "min": 1,
        "max": 11
    }
];