const express = require('express');
const connectDB = require('./config/db');
const session = require('express-session');
const league = require('./routes/league');
const users = require('./routes/users');
const app = express();
var cors = require('cors');

connectDB();

app.use(express.static('public'))

app.use(cors({ origin: true, credentials: true }));

app.use(express.json({ extended: false }));

app.use(
  session({
    secret: 'm4y1s4e2c4r4e6t_p5h8r6a3s4e7',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge : 655555555 }
  })
);

app.use('/league', league);
app.use('/users', users);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server running on port http://localhost:${port}`));