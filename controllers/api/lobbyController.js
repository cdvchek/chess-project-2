// This deals with the Lobby Table
const express = require("express");
const router = express.Router();
const { UserFriend, User, Lobby } = require("../../models");

router.get("/",(req,res)=>{
  // Basic get Requests - get all Lobbies
  Lobby.findAll().then(LobbyData=>{
      res.json({LobbyData})
  }).catch(err=>{
      console.log(err)
      res.status(500).json(err);
  })
})

router.get("/:id",(req,res)=>{
  // Basic get Requests - get one Lobby
  Lobby.findByPk(req.params.id).then(LobbyData=>{
      if(LobbyData){
          res.json({LobbyData})
      } else {
          res.status(404).json(err);
      }
  }).catch(err=>{
      console.log(err)
      res.status(500).json(err);
  })
});

router.post("/",(req,res)=>{
  // Create new Lobby API route 
  // that includes the logged in user
  Lobby.create({
      lobby_id: req.body.id,
      user1_id: req.session.User.id,
      // user2_id: req.body.username,
  }).then(newUser=>{
      res.json({newUser});
  }).catch(err=>{
      console.log(err);
      res.status(500).json({message:"Lobby creation failed:",err:err})
  })
});

router.put("/:id", (req,res)=>{
  // Update lobby to include second person
  Lobby.update({
    user1_id: req.session.User.id,
    user2_id: req.body.username,
  },{
      where:{
          id:req.params.id
      }
  })
});

router.delete("/:id",(req,res)=>{
// Delete Lobby
  Lobby.destroy({
      where:{
          id:req.params.id
      }
  }).then(delLobby=>{
      if(delLobby){res.json({delLobby})}
      else {res.status(404)}

  })
})
module.exports = router;

// Extra routes

// when you're the host of a lobby
//     hit start GamepadButton
//     request Lobby
// router.get("/", (req, res) => {
//     // Lobby Board
//     // render lobyy on "start game" button and accept request button
//   res.render("lobby")
// });

// router.post("/", (req, res) => {
//   if(!req.session.user){
//     return res.status(401).send("Log in first!")
//   }
//   // Play Game Route

//   res.render("lobby");
  

// });