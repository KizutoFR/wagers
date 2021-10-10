const express = require('express');
const connectDB = require('./config/db');
var cors = require('cors');

const league = require('./routes/league');
const users = require('./routes/users');

const app = express();

connectDB();

app.use(cors({ origin: true, credentials: true }));

app.use(express.json({ extended: false }));

app.use('/league', league);
app.use('/users', users);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server running on port ${port}`));