const express = require('express');
const connectDB = require('./config/db');
const session = require('express-session')
const cors = require('cors');
const isAuthenticated = require('./middleware/authenticated');

const league = require('./routes/league');
const users = require('./routes/users');
const games = require('./routes/games');
const accounts = require('./routes/accounts');
const challenges = require('./routes/challenges');
const friends = require('./routes/friends');
const auth = require('./routes/auth');
const admin = require('./routes/admin');


const app = express();

connectDB();

app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(express.json({ extended: false }));

app.use(cors());
app.options('*', cors())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  next();
});

app.use(
    session({
      secret: process.env.SESSION_SECRET || 'Super Secret (change it)',
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: 'none',
        secure: true,
      }
    })
  );

app.use('/league', isAuthenticated, league);
app.use('/users', isAuthenticated, users);
app.use('/games', isAuthenticated, games);
app.use('/accounts', isAuthenticated, accounts);
app.use('/friends', isAuthenticated, friends);
app.use('/challenges', isAuthenticated, challenges);
app.use('/auth', auth);
app.use('/admin', admin);



const port = process.env.PORT || 3030;

app.listen(port, () => console.log(`Server running on port http://localhost:${port}`));