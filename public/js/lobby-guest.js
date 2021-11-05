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

const opponent = document.getElementById('users');
socket.on('i am joining lobby', (id) => {
    fetch('api/users/'+id).then(userData => {
        userData.json().then(userData => {
        opponent.textContent = userData.UserData.username;
    })})
});

socket.on('start the game', (socketObj) => {
    console.log("i am emmiting 'moving to gameboard'");
    console.log(socketObj);
    socket.emit('moving to gameboard',socketObj)
    document.location.replace('/gameboard');
});