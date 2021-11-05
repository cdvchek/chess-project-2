const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const sequelize = require("./config/connection.js");
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const routes = require("./controllers");
const { createServer } = require('http');
const { Server } = require('socket.io');


// Sets up the Express App
// =============================================================
const app = express();
const socketServer = require('./controllers/socketServer');
const httpServer = createServer(app);
const io = new Server(httpServer);
socketServer(io);

const PORT = process.env.PORT || 3000;

// Requiring our models for syncing
const {User, UserFriends, Lobby} = require('./models');

const sess = {
    secret: process.env.SESSION_SECRET,
    // cookie: {
    //     maxAge:1000*60*60*2
    // },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
app.use(express.static('public'));


const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use("/", routes);

sequelize.sync({ force: false }).then(function() {
    httpServer.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
    });
});
