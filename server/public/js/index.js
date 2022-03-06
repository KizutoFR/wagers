const battlepassform = document.getElementById('addbattlepass');

const addBattlePass = (e) => {
    e.preventDefault();
    const data = document.getElementById('battlepassdata').value;
    if(data !== '') {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/users/battlepass/add', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            date: new Date(data)
        }));
    }
}

battlepassform.addEventListener('submit', addBattlePass);