const socket = io.connect();
fetch('/sessions').then(res => {
    if (res.ok) {
        res.json().then(res => {
        console.log(res)
        const gameRoom = res.user.id + "game"
        const notiRoom = res.user.id + "noti"
        socket.emit('join game room', gameRoom)
        socket.emit('join notification room', notiRoom)
        console.log(gameRoom,notiRoom)
    })
    } else {
        // TODO: Show that there was an error and that the friend request wasn't sent
        throw (err)
    }
});

const invFriendBtn = document.getElementById('invite-your-friend-btn');
// TODO: somehow figure out how to get the id of the friend you are inviting
invFriendBtn.addEventListener('click', (event) => {
    event.preventDefault();
    console.log('something happened');
    const friendID = document.getElementById('friend-id').value;
    fetch('/sessions').then(res => {
        if(res.ok) {
            res.json().then(res => {
                console.log(res)
                const socketObj = {
                    friendID,
                    id: res.user.id
                }
                socket.emit('send game invite', socketObj);
            })
        } else {
            throw err;
        }
    })
});

const backFromLobbyBtn = document.getElementById('back-btn');
// TODO: somehow figure out how to get the lobby id
backFromLobbyBtn.addEventListener('click', (event) => {
    event.preventDefault();
    fetch('/profile').then(res => {
        if(res.ok) {
            document.location.replace('/profile');
        } else {
            throw (err);
        }
    })
});


const opponent = document.getElementById('users2');
socket.on('player joining lobby', (id) => {
    fetch('api/users/'+id).then(userData => {
        userData.json().then(userData => {
        opponent.textContent = userData.UserData.username;
    })})
    const startGameBtn = document.getElementById('start-btn');
    startGameBtn.addEventListener('click', (event) => {
        event.preventDefault();
        fetch('/sessions').then(res => {
            if (res.ok) {
                res.json().then(res => {
                    const socketObj = {
                        userID: res.user.id,
                        opponentID: id
                    }
                    socket.emit('starting game',socketObj);
                    document.location.replace('/gameboard');
                })
            } else {
            // TODO: Show that there was an error and that the friend request wasn't sent
            throw (err)
            }
        });
    });
});