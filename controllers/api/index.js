// API Controllers
const express = require('express');
const router = express.Router();

// const apiRoutes = require('./api');
// router.use("/api", apiRoutes)

const userRoutes = require("./userController");
router.use("/users",userRoutes);

const lobbyRoutes = require("./lobbyController");
router.use("/lobby",lobbyRoutes);

const gameRoutes = require("./gamesController");
router.use("/game",gameRoutes);

// const sessionRoutes = require("../sessionsRoutes/sessionsRoutes");
// router.use("/sessions",sessionRoutes)

router.get("/",(req,res)=>{
    // Catchall
    res.send("API Deadend!")
})
module.exports = router;