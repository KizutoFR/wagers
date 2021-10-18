const express = require('express');
const connectDB = require('./config/db');
const league = require('./routes/league');
const users = require('./routes/users');
const games = require('./routes/games');

const app = express();
var cors = require('cors');

connectDB();

app.use(express.static('public'))
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ extended: false }));

app.use('/league', league);
app.use('/users', users);
app.use('/games', games);


const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server running on port http://localhost:${port}`));