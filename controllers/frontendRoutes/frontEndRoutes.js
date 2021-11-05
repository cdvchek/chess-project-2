// Front End Routes
const express = require('express');
const router = express.Router();
const {User,Lobby} = require('../../models');

// Home Page get request
router.get("/",(req,res)=>{
    // Home Page
    return res.render("home")
})

// Profile Page Get Request
router.get("/profile",(req,res)=>{
    // IF not logged in, return to login page
    if(!req.session.user){
        // return res.redirect("/")
    }
    // IF logged in, find user and render handblebars user page
    User.findByPk(req.session.user.id
    ).then(userData=>{
        const hbsUser = userData.get({plain:true});
        hbsUser.losses = hbsUser.ngames - hbsUser.wins - hbsUser.ties;
        if(hbsUser.losses === 0){
            hbsUser.winloss = 'N/A';
        } else {
            hbsUser.winloss = hbsUser.wins / hbsUser.losses;
        }
        const strFriends = userData.friends_list;
        const friendsArr = strFriends.split(' ');
        hbsUser.friend = [];
        for (let i = 0; i < friendsArr.length; i++) {
            if(i!==0){
                const friendUsername = friendsArr[i].split(',')[1];
                hbsUser.friend.push(friendUsername);
            }
        };
        res.render('user',hbsUser);
    })
})

// Lobby Page Get Request
router.get("/lobby", (req,res)=>{
    User.findByPk(req.session.user.id,{
    }).then(userData=>{
        const hbsUser = userData.get({plain:true});
        console.log(hbsUser);
        res.render("lobby", hbsUser)
    })
});

router.get("/lobby-guest", (req,res)=>{
    User.findByPk(req.session.user.id,{
    }).then(userData=>{
        const hbsUser = userData.get({plain:true});
        console.log(hbsUser);
        res.render("lobby-guest", hbsUser)
    })
});

// Game Board Get Request
router.get("/gameboard", (req,res)=> {
    res.render("game-board")
})


// router.get("/login",(req,res)=>{
//     // Serve login form here
//     res.render("login")
// })

module.exports = router;