// Empty because this one is the most complex and will be built last.
const express = require("express");
const router = express.Router();
const { UserFriends, User, Lobby } = require("../../models");

// router.get("/", (req, res) => {
//     // Game Board Page
//     // ASSUMES gameBoard VIEW IN MVC PARADIGM, 
//     // expects gameBoard.handlebars to exist?
//   res.render("game-board")
// });

// router.post("/", (req, res) => {
//   if(!req.session.user){
//     return res.status(401).send("Log in first!")
//   }
//   // Play Game Route

//   res.render("lobby");
//   Lobby

// });

router.get("/",(req,res)=>{
  // Get all
  Game.findAll().then(GameData=>{
      res.json(GameData)
  }).catch(err=>{
      console.log(err)
      res.status(500).json(err);
  })
})

router.get("/:id",(req,res)=>{
  // Get one
  Game.findByPk(req.params.id).then(GameData=>{
      if(UserData){
          res.json(GameData)
      } else {
          res.status(404).json(err);
      }
  }).catch(err=>{
      console.log(err)
      res.status(500).json(err);
  })
});

router.post("/",(req,res)=>{
  // Create new Game API route 
  Game.create({
      // username:req.body.username,
      // password:req.body.password,
      // email:req.body.email
  }).then(newGame=>{
      res.json(newGame);
  }).catch(err=>{
      console.log(err);
      res.status(500).json({message:"User creation failed:",err:err})
  })
});

router.put("/:id", (req,res)=>{
  // Update Game API Route
  // 
  Game.update({
      // username = req.body.username,
      // email:req.body.email,
      // TODO
      // THIS IS WHERE LOGIC TO ADD PLAYED GAMES HAPPENS
      // Update user by id every time there is
  },{
      where:{
          id:req.params.id
      }
  })
})

router.delete("/:id",(req,res)=>{
  // Delete Game
  Game.destroy({
      where:{
          id:req.params.id
      }
  }).then(delGame=>{
      if(delGame){       
        res.json(delGame)}
      else {res.status(404)}

  })
})

module.exports = router;

