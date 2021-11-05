function SocketClient() {
    var socket = io.connect();
    var emailInput = document.getElementby("#email-form")
    
    
    //Enter room with Id
    //Rework to be the function to allow players to enter other players' notification room and send a friend request 
    emailInput.addEventListener('submit',function () {
        socket.emit("sendEmail", email.val());
        email.text(emailInput.val());
        emailInput.val('');
        emailForm.hide();
        return false;
    })
    socket.on('roomId', function (roomId) {
        room = roomId;
        //showRoomId.text('Room ID : ' + room);
    })

    socket.on("joinGameRoom", function (newRoom, host) {
        //
    })
}