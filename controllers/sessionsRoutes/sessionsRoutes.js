// Routes for whether or not the user is logged in - WSK Checked
const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.json(req.session);
})

router.get("/chessclub",(req,res)=>{
    if(req.session.user){
        res.send(`Welcome to the chess club, ${req.session.user.username}!`)
    } else{
        res.status(401).send("You need to log in")
    }
})

module.exports = router;