const addcellform = document.getElementById('addcellform');

const addBattlePassCell = (e) => {
    e.preventDefault();
    const battlepass_id = document.getElementById('battlepass_id').value;
    const free_id = document.getElementById('free_id').value;
    const premium_id = document.getElementById('premium_id').value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/users/battlepass/cells/add', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        battlepass_id,
        free_id,
        premium_id
    }));
}

addcellform.addEventListener('submit', addBattlePassCell);