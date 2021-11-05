const { User } = require("../models");

// sockets to listen to connection
exports = module.exports = function (io) {
    io.on('connection', function (socket) {
        io.emit('greeting', 'welcome to our site!');


        socket.on("join game room", joinGameRoom)
        socket.on("join notification room", joinNotiRoom)
        socket.on("send friend request", sendFriendReq)
        socket.on("friend request accepted", friendReqAcc)
        socket.on('send game invite', sendGameInv)
        socket.on('game invite accepted', gameInvAcc)
        socket.on('starting game', startGame)
        socket.on('moving to gameboard', moveToGame)
        socket.on('move submitted', moveSubmitted)

        function friendReqAcc(socketObj) {
            const userId = socketObj.userId
            const friendId = socketObj.friendID
            User.findOne({
                where: { id: userId }
            }).then(userData => {
                const friendsList = userData.friends_list;
                const friendsListArr = friendsList.split(' ');
                friendsListArr.push(friendId + "," + socketObj.friendUsername);
                User.update({friends_list: friendsListArr.join(' ')},{
                    where: { id: userId }
                })
            })
            User.findOne({
                where: { id: friendId }
            }).then(userData => {
                const friendsList = userData.friends_list;
                const friendsListArr = friendsList.split(' ');
                friendsListArr.push(userId + "," + socketObj.userUsername);
                User.update({friends_list: friendsListArr.join(' ')},{
                    where: { id: friendId }
                })
            })
        }

        function joinGameRoom(gameRoom) {
            socket.broadcast.to(gameRoom).emit("sendMessage", "SERVER : a user just joined");
            if (gameRoom) {
                socket.join(gameRoom);
                //users.filter(foundUser => foundUser.id == socket.id)[0].gameRoom = gameRoom;
            }
        }

        function joinNotiRoom(notiRoom) {

            socket.broadcast.to(notiRoom).emit("sendMessage", "SERVER : a user just joined");
            if (notiRoom) {
                socket.join(notiRoom);
                //users.filter(foundUser => foundUser.id == socket.id)[0].notiRoom = notiRoom;
            }
        }
        function sendFriendReq(socketObj) {
            const newFriendEmail = socketObj.email
            User.findOne({
                where: { email: newFriendEmail }
            }).then(res => {
                const friendID = res.id
                socket.broadcast.to(friendID + "noti").emit("friend request sent", socketObj.id)
            })
        }
        function sendGameInv(socketObj) {
            const friendID = socketObj.friendID;
            socket.broadcast.to(friendID + "noti").emit("game invite sent", socketObj.id);
        }
        function gameInvAcc(socketObj) {
            const friendID = socketObj.friendID;
            const userID = socketObj.userId;
            socket.broadcast.to(friendID + 'game').emit('player joining lobby',userID);
            const stopper = 0;
            const interval = setInterval(() => {
                socket.broadcast.to(userID + 'game').emit('i am joining lobby',friendID);
                if(stopper==0){
                    clearInterval(interval);
                }
            },1000)
        }
        function startGame(socketObj) {
            const opponentID = socketObj.opponentID;
            socket.broadcast.to(opponentID + 'game').emit('start the game',socketObj);
        }
        function moveToGame(socketObj) {
            const hostID = socketObj.userID;
            const opponentID = socketObj.opponentID;
            const stopper = 0;
            const interval = setInterval(() => {
                socket.broadcast.to(hostID + 'game').emit('the game is starting',socketObj);
                socket.broadcast.to(opponentID + 'game').emit('the game is starting',socketObj);
                if(stopper==0){
                    clearInterval(interval);
                }
            },5000)
        }
        function moveSubmitted(socketObj) {
            const hostID = socketObj.hostID;
            const opponentID = socketObj.opponentID;
            let wKingLeft = false;
            let bKingLeft = false;
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if(socketObj.gameboard[i][j].piece==='w-King'){
                        wKingLeft = true;
                    }
                    if(socketObj.gameboard[i][j].piece==='b-King'){
                        bKingLeft = true;
                    }
                }                
            }
            if(wKingLeft && bKingLeft){
                if(socketObj.user === 'w'){
                    socket.broadcast.to(opponentID + 'game').emit('opponent moved',socketObj);
                } else {
                    socket.broadcast.to(hostID + 'game').emit('opponent moved',socketObj);
                }
            } else if (wKingLeft) {
                console.log('white has won the game!');
                socket.broadcast.to(opponentID + 'game').emit('you lost',socketObj);
                const interval = setInterval(() => {
                    socket.broadcast.to(hostID + 'game').emit('you won',socketObj);
                    console.log(hostID);
                    if(true){
                        clearInterval(interval);
                    }
                },5000)
            } else {
                console.log('black has won the game!');
                socket.broadcast.to(hostID + 'game').emit('you lost',socketObj);
                const interval = setInterval(() => {
                socket.broadcast.to(opponentID + 'game').emit('you won',socketObj);
                console.log(opponentID);
                    if(true){
                        clearInterval(interval);
                    }
                },1000)
            }
        }
    })
}
