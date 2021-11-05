// This deals with the Users Table
const express = require('express');
const router = express.Router();
const io = require('../../index')
const { User, UserFriends, Lobby } = require('../../models');
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
    // Basic get Requests - get all
    User.findAll().then(UserData => {
        res.json({UserData})
    }).catch(err => {
        console.log(err)
        res.status(500).json(err);
    })
});

router.get("/logout", (req,res)=>{
    // Logout request
    req.session.destroy(()=>{
        res.json({msg:"Session destroyed"})
    })
})

router.get("/:id", (req, res) => {
    // Basic get Requests - get one
    User.findByPk(req.params.id).then(UserData => {
        if (UserData) {
            res.json({UserData})
        } else {
            res.status(404).json({err:"No such user."});
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({err});
    })
});

router.post("/", (req, res) => {
    // Create new user API route 
    User.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    }).then(newUser => {
        req.session.user = {
            username: newUser.username,
            email: newUser.email,
            id: newUser.id
        }
        res.json({newUser});
    }).catch(err => {
        console.log(err);
        res.status(500).json({ message: "User creation failed:", err: err })
    })
});

router.post("/login", (req, res) => {
    // Login Form Route
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(foundUser => {
        if (!foundUser) {
            req.session.destroy()
            res.status(401).json({ message: "Incorrect email or password" })
        } else {
            if (bcrypt.compareSync(req.body.password, foundUser.password)) {
                req.session.user = {
                    username: foundUser.username,
                    email: foundUser.email,
                    id: foundUser.id
                }
                res.json({foundUser})
            } else {
                req.session.destroy()
                res.status(401).json({ message: "Incorrect email or password" })
            }
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

router.put("/:id", (req, res) => {
    // Update User API Route
    // 
    User.update({
        username: req.body.username,
        email: req.body.email,
        ngames: req.body.ngames,
        wins: req.body.wins,
        ties: req.body.ties,
        user_rank: req.body.user_rank,
        // TODO
        // THIS IS WHERE LOGIC TO ADD PLAYED GAMES HAPPENS
        // Update user by id every time there is
    }, {
        where: {
            id: req.params.id
        }
    }).then(updatedData => {
        if (updatedData[0]) {
          res.json({updatedData});
        } else {
          res.status(404).json({ err: "no such user found!" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ err });
      });
})

router.delete("/:id", (req, res) => {
    // We don't have a use case for deleting users now but I'm keeping it in case.
    User.destroy({
        where: {
            id: req.params.id
        }
    }).then(delUser => {
        if (delUser) { res.json(delUser) }
        else { res.status(404) }
    })
})

router.get("/logout", (req, res) => {
    // User logout
    req.session.destroy();
    res.redirect("/login")
})

router.post('/', (req, res) => {
    // Add a Friend
    // Takes in session id and puts as user 1
    // Takes in input user id and puts as user 2
    User.findOne({
        where: {
            email: req.body.email
        }
    });
})

module.exports = router;

