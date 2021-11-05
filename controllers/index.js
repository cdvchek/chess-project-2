// Index router - WSK checked
const express = require('express');
const router = express.Router();

// Front End Handlebars Work
const frontEndRoutes = require("./frontEndRoute");
router.use("/", frontEndRoutes);

// Back End SQL Work
const apiRoutes = require("./api");
router.use("/api", apiRoutes);

// Log sessions
// TO-DO Check this vs
router.get("/sessions",(req,res)=>{
    res.json(req.session)
})
// const sessionRoutes = require("./sessionsRoutes/sessionsRoutes")
// router.use("/sessions", sessionRoutes)

module.exports = router;