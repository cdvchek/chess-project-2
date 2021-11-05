const socket = io();

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

const packGameboard = () => {
    const gameboard = [[],[],[],[],[],[],[],[]]            
    for (let l = 0; l < 8; l++) {
        for (let p = 0; p < 8; p++) {
            gameboard[l][p] = {
                piece: document.querySelector(`div[data-AN='${l}${p}']`).getAttribute('data-Piece'),
                An:document.querySelector(`div[data-AN='${l}${p}']`).getAttribute('data-AN'),
            }
        }        
    }
    return gameboard;
}
const renderGameboard = () => {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const icon = document.createElement('p');
            const gameTile = document.querySelector(`div[data-AN='${i}${j}']`);
            const gamePiece = gameTile.getAttribute('data-Piece');
            const gamePieceArr = gamePiece.split('-');
            switch(gamePieceArr[1]){
                default:
                    switch(gamePieceArr[0]){
                        case 'empty':
                            icon.textContent = ' ';
                        break;
                        case 'possible':
                            icon.textContent = '♙';
                        break;
                    }
                break;
                case 'Pawn':
                    icon.textContent = '♙';
                break;
                case 'King':
                    icon.textContent = '♔';
                break;
                case 'Queen':
                    icon.textContent = '♕';
                break;
                case 'Bishop':
                    icon.textContent = '♗';
                break;
                case 'Knight':
                    icon.textContent = '♘';
                break;
                case 'Rook':
                    icon.textContent = '♖';
                break;
            }
            gameTile.appendChild(icon);
        }
    }
}

const updateGameboard = () => {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const gameTile = document.querySelector(`div[data-AN='${i}${j}']`);
            const icon = gameTile.firstChild;
            const gamePiece = gameTile.getAttribute('data-Piece');
            const gamePieceArr = gamePiece.split('-');
            switch(gamePieceArr[1]){
                default:
                    switch(gamePieceArr[0]){
                        case 'empty':
                            icon.textContent = ' ';
                        break;
                        case 'possible':
                            icon.textContent = '♙';
                        break;
                    }
                break;
                case 'Pawn':
                    icon.textContent = '♙';
                break;
                case 'King':
                    icon.textContent = '♔';
                break;
                case 'Queen':
                    icon.textContent = '♕';
                break;
                case 'Bishop':
                    icon.textContent = '♗';
                break;
                case 'Knight':
                    icon.textContent = '♘';
                break;
                case 'Rook':
                    icon.textContent = '♖';
                break;
            }
        }
    }
}
const updateOpponentMove = (gameboard) => {
    for (let l = 0; l < 8; l++) {
        for (let p = 0; p < 8; p++) {
            const currPiece = gameboard[l][p].piece;
            const currAN = gameboard[l][p].An;
            document.querySelector(`div[data-AN='${l}${p}']`).setAttribute('data-Piece',currPiece);
            document.querySelector(`div[data-AN='${l}${p}']`).setAttribute('data-AN',currAN);
        }        
    }
    updateGameboard();
}

const user = {
    color: 'w'
}

socket.on('the game is starting', (socketObj) => {
    console.log('we should now be playing the game and the host can move')
    fetch('/sessions').then(res => {
        if (res.ok) {
            hostID = socketObj.userID;
            res.json().then(res => {
                if(res.user.id === socketObj.userID) {
                    user.color = 'w';
                }
                if(res.user.id === socketObj.opponentID) {
                    user.color = 'b';
                }
            })
        } else {
            throw (err)
        }
    });
// Game Logic :)))))
// White starts the game (white = 0, black = 1)
let playerTurn = 0;

// Declaring global variables
let selected;
renderGameboard();
const tile = document.getElementsByClassName('tile');
for (let i = 0; i < tile.length; i++) {
    tile[i].addEventListener('click', (event) => {
        event.stopPropagation();
        event.preventDefault();
        let AN;
        if(event.target.parentElement.getAttribute('data-AN')!==null){
            AN = event.target.parentElement.getAttribute('data-AN');
        } else {
            AN = event.target.getAttribute('data-AN');
        }
        const AN0 = AN.split('')[0];
        const AN1 = AN.split('')[1];
    
        const curPiece = seeCurrentPiece(AN);
        const justPiece = curPiece.split('-');
        
        if ((user.color === 'w' && 
            (justPiece[0] === 'w' || 
            justPiece[0] === 'empty' ||
            justPiece[0] === 'possible' ||
            justPiece[2] === 'atk')) ||
            (user.color === 'b' &&
            (justPiece[0] === 'b' ||
            justPiece[0] === 'empty' ||
            justPiece[0] === 'possible' ||
            justPiece[2] === 'atk')))
        {
            if (user.color === 'w' && playerTurn === 0 ||
                user.color === 'b' && playerTurn === 1)
            {
                let atk = false;
                console.log(justPiece);
                switch (justPiece[2]) {
                    case 'atk':
                        atk = true;
                        clearPossibleAtks();
                        clearPossibleMoves();
                        movePiece(selected,AN);
                        const gameboard = packGameboard();
                        console.log(gameboard);
                        const gameInfoObj = {
                            hostID: socketObj.userID,
                            opponentID: socketObj.opponentID,
                            gameboard,
                            user:user.color
                        }
                        console.log(gameInfoObj);
                        socket.emit('move submitted',gameInfoObj);
                        console.log('i emmitted a move submit :)I ATTACKED!!!!!')
                    break;
                }
                if(!atk){
                    switch (justPiece[1]) {
                        default:
                            switch (justPiece[0]) {
                                case 'empty':
                                    clearPossibleMoves();
                                    clearPossibleAtks();
                                    updateGameboard();
                                break;
                                    
                                case 'possible':
                                    clearPossibleAtks();
                                    clearPossibleMoves();
                                    movePiece(selected,AN);
                                    const gameboard = packGameboard();
                                    console.log(gameboard);
                                    const gameInfoObj = {
                                        hostID: socketObj.userID,
                                        opponentID: socketObj.opponentID,
                                        gameboard,
                                        user:user.color
                                    }
                                    console.log(gameInfoObj);
                                    socket.emit('move submitted',gameInfoObj);
                                    console.log('i emmitted a move submit :)verygood')
                                break;
                            }
                        break;
                                    
                        case 'Rook':
                            clearPossibleAtks();
                            clearPossibleMoves();
                            const rookmovesObj = checkRookPossibleMoves(AN0,AN1);
                            const rookPossMoves = rookmovesObj.rookPossibleMoves;
                            const rookPossAtts = rookmovesObj.rookPossibleAtts;
                            updatePossibleMoves(rookPossMoves);
                            updatePossibleAtts(rookPossAtts);
                            selected = AN;
                        break;
                            
                        case 'Knight':
                            clearPossibleAtks();
                            clearPossibleMoves();
                            const knightmovesObj = checkKnightPossibleMoves(AN0,AN1);
                            const knightPossMoves = knightmovesObj.knightPossibleMoves;
                            const knightPossAtts = knightmovesObj.knightPossibleAtts;
                            updatePossibleMoves(knightPossMoves);
                            updatePossibleAtts(knightPossAtts);
                            selected = AN;
                        break;
                                
                        case 'Bishop':
                            clearPossibleAtks();
                            clearPossibleMoves();
                            console.log('bishop');
                            const bishopmovesObj = checkBishopPossibleMoves(AN0,AN1);
                            console.log(bishopmovesObj);
                            const bishopPossMoves = bishopmovesObj.bishopPossibleMoves;
                            const bishopPossAtts = bishopmovesObj.bishopPossibleAtts;
                            updatePossibleMoves(bishopPossMoves);
                            updatePossibleAtts(bishopPossAtts);
                            selected = AN;
                        break;
                                    
                        case 'Queen':
                            clearPossibleMoves();
                            clearPossibleAtks();
                            const firstHalfMovesObj = checkRookPossibleMoves(AN0,AN1);
                            const queenPossMovesOne = firstHalfMovesObj.rookPossibleMoves;
                            const queenPossAttsOne = firstHalfMovesObj.rookPossibleAtts;
                            const secondHalfMovesObj = checkBishopPossibleMoves(AN0,AN1);
                            const queenPossMovesTwo = secondHalfMovesObj.bishopPossibleMoves;
                            const queenPossAttsTwo = secondHalfMovesObj.bishopPossibleAtts;
                            console.log(queenPossAttsTwo);
                            let queenPossMoves = queenPossMovesOne;
                            if(queenPossMovesTwo){
                                queenPossMoves = queenPossMovesOne.concat(queenPossMovesTwo);
                            }
                            let queenPossAtts = queenPossAttsOne;
                            if(queenPossAttsTwo){
                                queenPossAtts = queenPossAttsOne.concat(queenPossAttsTwo)
                            }
                            updatePossibleMoves(queenPossMoves);
                            updatePossibleAtts(queenPossAtts);
                            selected = AN;
                        break;
                                        
                        case 'King':
                            clearPossibleMoves();
                            clearPossibleAtks();
                            const kingmovesObj = checkKingPossibleMoves(AN0,AN1);
                            const kingPossMoves = kingmovesObj.kingPossibleMoves;
                            const kingPossAtts = kingmovesObj.kingPossibleAtts;
                            updatePossibleMoves(kingPossMoves);
                            updatePossibleAtts(kingPossAtts);
                            selected = AN;
                        break;
                                            
                        case 'Pawn':
                            clearPossibleMoves();
                            clearPossibleAtks();
                            let pawnPossMovesObj;
                            let pawnPossMoves;
                            let pawnPossAtts;
                            if(justPiece[0]==='w'){
                                pawnPossMovesObj = checkWhitePawnPossibleMoves(AN0,AN1);
                                pawnPossMoves = pawnPossMovesObj.pawnPossibleMoves;
                                pawnPossAtts = pawnPossMovesObj.pawnPossibleAtts;
                            } else {
                                pawnPossMovesObj = checkBlackPawnPossibleMoves(AN0,AN1);
                                pawnPossMoves = pawnPossMovesObj.pawnPossibleMoves;
                                pawnPossAtts = pawnPossMovesObj.pawnPossibleAtts;
                            }
                            updatePossibleMoves(pawnPossMoves);
                            updatePossibleAtts(pawnPossAtts);
                            selected = AN;
                        break;
                    }
                }
            }
        }
    });
}

const checkRookPossibleMoves = (zero,one) => {
    const rookPossibleMoves = [];
    const rookPossibleAtts = [];
    const numAN0 = Number(zero);
    const numAN1 = Number(one);

    // checking possible moves above rook
    const upper = numAN0;
    for (let i = 1; i <= upper; i++) { 
        let checking = numAN0 - i;
        let strChecking = checking.toString();
        strChecking = strChecking.concat(one);
        if (seeCurrentPiece(strChecking) === 'empty') {
            rookPossibleMoves.push(strChecking);
        } else {
            if(user.color === 'w'){
                if(seeCurrentPiece(strChecking).split('-')[0] === 'b'){
                    rookPossibleAtts.push(strChecking);
                }
            }
            if(user.color === 'b'){
                if(seeCurrentPiece(strChecking).split('-')[0] === 'w'){
                    rookPossibleAtts.push(strChecking);
                }
            }
            break;
        }
    }

    // checking possible moves left of rook
    const left = numAN1;
    for (let i = 1; i <= left; i++) {
        let checking = numAN1 - i;
        checking = checking.toString();
        let strChecking = zero;
        strChecking = strChecking.concat(checking);
        if (seeCurrentPiece(strChecking) === 'empty') {
            rookPossibleMoves.push(strChecking);
        } else {
            if(user.color === 'w'){
                if(seeCurrentPiece(strChecking).split('-')[0] === 'b'){
                    rookPossibleAtts.push(strChecking);
                }
            }
            if(user.color === 'b'){
                if(seeCurrentPiece(strChecking).split('-')[0] === 'w'){
                    rookPossibleAtts.push(strChecking);
                }
            }
            break;
        }
    }

    // checking possible moves below rook
    const below = 8 - (numAN0 + 1);
    for (let i = 1; i <= below; i++) { 
        let checking = numAN0 + i;
        let strChecking = checking.toString();
        strChecking = strChecking.concat(one);
        if (seeCurrentPiece(strChecking) === 'empty') {
            rookPossibleMoves.push(strChecking);
        } else {
            if(user.color === 'w'){
                if(seeCurrentPiece(strChecking).split('-')[0] === 'b'){
                    rookPossibleAtts.push(strChecking);
                }
            }
            if(user.color === 'b'){
                if(seeCurrentPiece(strChecking).split('-')[0] === 'w'){
                    rookPossibleAtts.push(strChecking);
                }
            }
            break;
        }          
    }

    // checking possible moves right of rook
    const right = 8 - (numAN1 + 1);
    for (let i = 1; i <= right; i++) { 
        let checking = numAN1 + i;
        checking = checking.toString();
        let strChecking = zero;
        strChecking = strChecking.concat(checking);
        if (seeCurrentPiece(strChecking) === 'empty') {
            rookPossibleMoves.push(strChecking);
        } else {
            if(user.color === 'w'){
                if(seeCurrentPiece(strChecking).split('-')[0] === 'b'){
                    rookPossibleAtts.push(strChecking);
                }
            }
            if(user.color === 'b'){
                if(seeCurrentPiece(strChecking).split('-')[0] === 'w'){
                    rookPossibleAtts.push(strChecking);
                }
            }
            break;
        }
    }
    return { rookPossibleMoves, rookPossibleAtts };
}

const checkBishopPossibleMoves = (zero,one) => {
    const bishopPossibleMoves = [];
    const bishopPossibleAtts = [];
    const numAN0 = Number(zero);
    const numAN1 = Number(one);

    // checking upper right possible moves of bishop
    const upperUR = numAN0;
    const rightUR = 8 - (numAN1 + 1);
    let rightUpper = upperUR;
    if (upperUR > rightUR) {
        rightUpper = rightUR;
    }

    for (let i = 1; i <= rightUpper; i++) {
        const AN0check = numAN0 - i;
        const AN1check = numAN1 + i;
        let strChecking = AN0check.toString();
        strChecking = strChecking.concat(AN1check);
        if (seeCurrentPiece(strChecking) === 'empty') {
            bishopPossibleMoves.push(strChecking);
        } else {
            if(user.color === 'w'){
                if(seeCurrentPiece(strChecking).split('-')[0] === 'b'){
                    bishopPossibleAtts.push(strChecking);
                }
            }
            if(user.color === 'b'){
                if(seeCurrentPiece(strChecking).split('-')[0] === 'w'){
                    bishopPossibleAtts.push(strChecking);
                }
            }
            break;
        }           
    }

    // checking upper left possible moves of bishop
    const upperUL = numAN0;
    const leftUL = numAN1;
    let leftUpper = upperUL;
    if (upperUL > leftUL) {
        leftUpper = leftUL;
    }

    for (let i = 1; i <= leftUpper; i++) {
        const AN0check = numAN0 - i;
        const AN1check = numAN1 - i;
        let strChecking = AN0check.toString();
        strChecking = strChecking.concat(AN1check);
        if (seeCurrentPiece(strChecking) === 'empty') {
            bishopPossibleMoves.push(strChecking);
        } else {
            if(user.color === 'w'){
                if(seeCurrentPiece(strChecking).split('-')[0] === 'b'){
                    bishopPossibleAtts.push(strChecking);
                }
            }
            if(user.color === 'b'){
                if(seeCurrentPiece(strChecking).split('-')[0] === 'w'){
                    bishopPossibleAtts.push(strChecking);
                }
            }
            break;
        } 
    }

    // checking lower left possible moves of bishop
    const lowerLL = 8 - (numAN0 + 1);
    const leftLL = numAN1;
    let leftLower = lowerLL;
    if (lowerLL > leftLL) {
        leftLower = leftLL;
    }

    for (let i = 1; i <= leftLower; i++) {
        const AN0check = numAN0 + i;
        const AN1check = numAN1 - i;
        let strChecking = AN0check.toString();
        strChecking = strChecking.concat(AN1check);
        if (seeCurrentPiece(strChecking) === 'empty') {
            bishopPossibleMoves.push(strChecking);
        } else {
            if(user.color === 'w'){
                if(seeCurrentPiece(strChecking).split('-')[0] === 'b'){
                    bishopPossibleAtts.push(strChecking);
                }
            }
            if(user.color === 'b'){
                if(seeCurrentPiece(strChecking).split('-')[0] === 'w'){
                    bishopPossibleAtts.push(strChecking);
                }
            }
            break;
        }         
    }

    // checking lower right possible moves of bishop
    const lowerLR = 8 - (numAN0 + 1);
    const rightLR = 8 - (numAN1 + 1);
    let rightLower = lowerLR;
    if (lowerLR > rightLR) {
        rightLower = rightLR;
    }

    for (let i = 1; i <= rightLower; i++) {
        const AN0check = numAN0 + i;
        const AN1check = numAN1 + i;
        let strChecking = AN0check.toString();
        strChecking = strChecking.concat(AN1check);
        if (seeCurrentPiece(strChecking) === 'empty') {
            bishopPossibleMoves.push(strChecking);
        } else {
            if(user.color === 'w'){
                if(seeCurrentPiece(strChecking).split('-')[0] === 'b'){
                    bishopPossibleAtts.push(strChecking);
                }
            }
            if(user.color === 'b'){
                if(seeCurrentPiece(strChecking).split('-')[0] === 'w'){
                    bishopPossibleAtts.push(strChecking);
                }
            }
            break;
        }
    }   
    return { bishopPossibleMoves, bishopPossibleAtts };
}

const checkKnightPossibleMoves = (zero,one) => {
    const knightPossibleMoves = [];
    const knightPossibleAtts = [];
    const num0 = Number(zero);
    const num1 = Number(one);
    // checking upper moves for knight
    if (num0 !== 0) {
        if (num1 > 1) {
            // left upper move is up one and left two
            const tile1 = (num0-1).toString();
            const tile2 = (num1-2).toString();
            const check = tile1.concat(tile2);
            if (seeCurrentPiece(check) === 'empty') {
                knightPossibleMoves.push(check);
            } else {
                if(user.color === 'w'){
                    if(seeCurrentPiece(check).split('-')[0] === 'b'){
                        knightPossibleAtts.push(check);
                    }
                }
                if(user.color === 'b'){
                    if(seeCurrentPiece(check).split('-')[0] === 'w'){
                        knightPossibleAtts.push(check);
                    }
                }
            }  
        }
        if (num1 < 6) {
            // right upper move is up one and right two
            const tile1 = (num0-1).toString();
            const tile2 = (num1+2).toString();
            const check = tile1.concat(tile2);
            if (seeCurrentPiece(check) === 'empty') {
                knightPossibleMoves.push(check);
            } else {
                if(user.color === 'w'){
                    if(seeCurrentPiece(check).split('-')[0] === 'b'){
                        knightPossibleAtts.push(check);
                    }
                }
                if(user.color === 'b'){
                    if(seeCurrentPiece(check).split('-')[0] === 'w'){
                        knightPossibleAtts.push(check);
                    }
                }
            }  
        }
    }

    // checking left moves for knight
    if (num1 !== 0) {
        if (num0 > 1) {
            // upper left move is left one and up two
            const tile1 = (num0-2).toString();
            const tile2 = (num1-1).toString();
            const check = tile1.concat(tile2);
            if (seeCurrentPiece(check) === 'empty') {
                knightPossibleMoves.push(check);
            } else {
                if(user.color === 'w'){
                    if(seeCurrentPiece(check).split('-')[0] === 'b'){
                        knightPossibleAtts.push(check);
                    }
                }
                if(user.color === 'b'){
                    if(seeCurrentPiece(check).split('-')[0] === 'w'){
                        knightPossibleAtts.push(check);
                    }
                }
            }  
        }
        if (num0 < 6) {
            // lower left move is left one and down two
            const tile1 = (num0+2).toString();
            const tile2 = (num1-1).toString();
            const check = tile1.concat(tile2);
            if (seeCurrentPiece(check) === 'empty') {
                knightPossibleMoves.push(check);
            } else {
                if(user.color === 'w'){
                    if(seeCurrentPiece(check).split('-')[0] === 'b'){
                        knightPossibleAtts.push(check);
                    }
                }
                if(user.color === 'b'){
                    if(seeCurrentPiece(check).split('-')[0] === 'w'){
                        knightPossibleAtts.push(check);
                    }
                }
            }  
        }
    }
    // checking lower moves for knight
    if (num0 !== 7) {
        if (num1 > 1) {
            // left lower move is down one and left two
            const tile1 = (num0+1).toString();
            const tile2 = (num1-2).toString();
            const check = tile1.concat(tile2);
            if (seeCurrentPiece(check) === 'empty') {
                knightPossibleMoves.push(check);
            } else {
                if(user.color === 'w'){
                    if(seeCurrentPiece(check).split('-')[0] === 'b'){
                        knightPossibleAtts.push(check);
                    }
                }
                if(user.color === 'b'){
                    if(seeCurrentPiece(check).split('-')[0] === 'w'){
                        knightPossibleAtts.push(check);
                    }
                }
            }  
        }
        if (num1 < 6) {
            // right lower move is down one and right two
            const tile1 = (num0+1).toString();
            const tile2 = (num1+2).toString();
            const check = tile1.concat(tile2);
            if (seeCurrentPiece(check) === 'empty') {
                knightPossibleMoves.push(check);
            } else {
                if(user.color === 'w'){
                    if(seeCurrentPiece(check).split('-')[0] === 'b'){
                        knightPossibleAtts.push(check);
                    }
                }
                if(user.color === 'b'){
                    if(seeCurrentPiece(check).split('-')[0] === 'w'){
                        knightPossibleAtts.push(check);
                    }
                }
            }  
        }
    }
    //checking right moves for knight
    if (num1 !== 7) {
        if (num0 > 1) {
            // upper right move is right one and up two
            const tile1 = (num0-2).toString();
            const tile2 = (num1+1).toString();
            const check = tile1.concat(tile2);
            if (seeCurrentPiece(check) === 'empty') {
                knightPossibleMoves.push(check);
            } else {
                if(user.color === 'w'){
                    if(seeCurrentPiece(check).split('-')[0] === 'b'){
                        knightPossibleAtts.push(check);
                    }
                }
                if(user.color === 'b'){
                    if(seeCurrentPiece(check).split('-')[0] === 'w'){
                        knightPossibleAtts.push(check);
                    }
                }
            }  
        }
        if (num0 < 6) {
            // lower right move is right one and down two
            const tile1 = (num0+2).toString();
            const tile2 = (num1+1).toString();
            const check = tile1.concat(tile2);
            if (seeCurrentPiece(check) === 'empty') {
                knightPossibleMoves.push(check);
            } else {
                if(user.color === 'w'){
                    if(seeCurrentPiece(check).split('-')[0] === 'b'){
                        knightPossibleAtts.push(check);
                    }
                }
                if(user.color === 'b'){
                    if(seeCurrentPiece(check).split('-')[0] === 'w'){
                        knightPossibleAtts.push(check);
                    }
                }
            }  
        }
    }
    return { knightPossibleMoves, knightPossibleAtts };
}

const checkKingPossibleMoves = (zero,one) => {
    const kingPossibleMoves = [];
    const kingPossibleAtts = [];
    const num0 = Number(zero);
    const num1 = Number(one);

    // checking up
    if (num0 !== 0) {
        let check0 = (num0-1).toString();
        let check1 = (num1).toString();
        check0 = check0.concat(check1);
        if (seeCurrentPiece(check0) === 'empty') {
            kingPossibleMoves.push(check0);
        } else {
            if(user.color === 'w'){
                if(seeCurrentPiece(check0).split('-')[0] === 'b'){
                    kingPossibleAtts.push(check0);
                }
            }
            if(user.color === 'b'){
                if(seeCurrentPiece(check0).split('-')[0] === 'w'){
                    kingPossibleAtts.push(check0);
                }
            }
        }  
    }

    // checking up left
    if (num0 !== 0 && num1 !== 0) {
        let check0 = (num0-1).toString();
        let check1 = (num1-1).toString();
        check0 = check0.concat(check1);
        if (seeCurrentPiece(check0) === 'empty') {
            kingPossibleMoves.push(check0);
        } else {
            if(user.color === 'w'){
                if(seeCurrentPiece(check0).split('-')[0] === 'b'){
                    kingPossibleAtts.push(check0);
                }
            }
            if(user.color === 'b'){
                if(seeCurrentPiece(check0).split('-')[0] === 'w'){
                    kingPossibleAtts.push(check0);
                }
            }
        }  
    }

    // checking left
    if (num1 !== 0) {
        let check0 = (num0).toString();
        let check1 = (num1-1).toString();
        check0 = check0.concat(check1);
        if (seeCurrentPiece(check0) === 'empty') {
            kingPossibleMoves.push(check0);
        } else {
            if(user.color === 'w'){
                if(seeCurrentPiece(check0).split('-')[0] === 'b'){
                    kingPossibleAtts.push(check0);
                }
            }
            if(user.color === 'b'){
                if(seeCurrentPiece(check0).split('-')[0] === 'w'){
                    kingPossibleAtts.push(check0);
                }
            }
        }  
    }

    // checking down left
    if (num0 !== 7 && num1 !== 0) {
        let check0 = (num0+1).toString();
        let check1 = (num1-1).toString();
        check0 = check0.concat(check1);
        if (seeCurrentPiece(check0) === 'empty') {
            kingPossibleMoves.push(check0);
        } else {
            if(user.color === 'w'){
                if(seeCurrentPiece(check0).split('-')[0] === 'b'){
                    kingPossibleAtts.push(check0);
                }
            }
            if(user.color === 'b'){
                if(seeCurrentPiece(check0).split('-')[0] === 'w'){
                    kingPossibleAtts.push(check0);
                }
            }
        }  
    }

    // checking down
    if (num0 !== 7) {
        let check0 = (num0 + 1).toString();
        let check1 = (num1).toString();
        check0 = check0.concat(check1);
        if (seeCurrentPiece(check0) === 'empty') {
            kingPossibleMoves.push(check0);
        } else {
            if(user.color === 'w'){
                if(seeCurrentPiece(check0).split('-')[0] === 'b'){
                    kingPossibleAtts.push(check0);
                }
            }
            if(user.color === 'b'){
                if(seeCurrentPiece(check0).split('-')[0] === 'w'){
                    kingPossibleAtts.push(check0);
                }
            }
        }  
    }

    // checking down right
    if (num0 !== 7 && num1 !== 7) {
        let check0 = (num0+1).toString();
        let check1 = (num1+1).toString();
        check0 = check0.concat(check1);
        if (seeCurrentPiece(check0) === 'empty') {
            kingPossibleMoves.push(check0);
        } else {
            if(user.color === 'w'){
                if(seeCurrentPiece(check0).split('-')[0] === 'b'){
                    kingPossibleAtts.push(check0);
                }
            }
            if(user.color === 'b'){
                if(seeCurrentPiece(check0).split('-')[0] === 'w'){
                    kingPossibleAtts.push(check0);
                }
            }
        }  
    }

    // checking right
    if (num1 !== 7) {
        let check0 = (num0).toString();
        let check1 = (num1+1).toString();
        check0 = check0.concat(check1);
        if (seeCurrentPiece(check0) === 'empty') {
            kingPossibleMoves.push(check0);
        } else {
            if(user.color === 'w'){
                if(seeCurrentPiece(check0).split('-')[0] === 'b'){
                    kingPossibleAtts.push(check0);
                }
            }
            if(user.color === 'b'){
                if(seeCurrentPiece(check0).split('-')[0] === 'w'){
                    kingPossibleAtts.push(check0);
                }
            }
        }  
    }

    // checking up right
    if (num0 !== 0 && num1 !== 7) {
        let check0 = (num0-1).toString();
        let check1 = (num1+1).toString();
        check0 = check0.concat(check1);
        if (seeCurrentPiece(check0) === 'empty') {
            kingPossibleMoves.push(check0);
        } else {
            if(user.color === 'w'){
                if(seeCurrentPiece(check0).split('-')[0] === 'b'){
                    kingPossibleAtts.push(check0);
                }
            }
            if(user.color === 'b'){
                if(seeCurrentPiece(check0).split('-')[0] === 'w'){
                    kingPossibleAtts.push(check0);
                }
            }
        }  
    }
    return { kingPossibleMoves, kingPossibleAtts };
}

const checkWhitePawnPossibleMoves = (zero,one) => {
    const pawnPossibleMoves = [];
    const pawnPossibleAtts = [];
    const num0 = Number(zero);
    const num1 = Number(one);
    if(num1>0){
        let check0 = num0.toString();
        let check1 = (num1-1).toString();
        check0 = check0.concat(check1);
        if (seeCurrentPiece(check0) === 'empty') {
            pawnPossibleMoves.push(check0);
        }
        // check attacking spot above pawn
        if(num0>0){    
            let atk10 = (num0 - 1).toString();
            let atk11 = (num1 - 1).toString();
            atk10 = atk10.concat(atk11);
            if (seeCurrentPiece(atk10).split('-')[0] === 'b'){   
                pawnPossibleAtts.push(atk10);
            }
        }
        // check attacking spot below pawn
        if(num0<7){    
            let atk10 = (num0 + 1).toString();
            let atk11 = (num1 - 1).toString();
            atk10 = atk10.concat(atk11);
            if (seeCurrentPiece(atk10).split('-')[0] === 'b'){   
                pawnPossibleAtts.push(atk10);
            }
        }
    }
    return { pawnPossibleMoves, pawnPossibleAtts };
}

const checkBlackPawnPossibleMoves = (zero,one) => {
    const pawnPossibleMoves = [];
    const pawnPossibleAtts = [];
    const num0 = Number(zero);
    const num1 = Number(one);
    if(num1<7){
        let check0 = num0.toString();
        let check1 = (num1+1).toString();
        check0 = check0.concat(check1);
        if (seeCurrentPiece(check0) === 'empty') {
            pawnPossibleMoves.push(check0);
        }
        // check attacking spot above pawn
        if(num0>0){    
            let atk10 = (num0 - 1).toString();
            let atk11 = (num1 + 1).toString();
            atk10 = atk10.concat(atk11);
            if (seeCurrentPiece(atk10).split('-')[0] === 'w'){   
                pawnPossibleAtts.push(atk10);
            }
        }
        // check attacking spot below pawn
        if(num0<7){    
            let atk10 = (num0 + 1).toString();
            let atk11 = (num1 + 1).toString();
            atk10 = atk10.concat(atk11);
            if (seeCurrentPiece(atk10).split('-')[0] === 'w'){   
                pawnPossibleAtts.push(atk10);
            }
        }
    }
    return { pawnPossibleMoves, pawnPossibleAtts };
}

// takes in a number of moves and sets the piece equal to "possibleMove"
const updatePossibleMoves = (movesArr) => {
    for (let i = 0; i < movesArr.length; i++) {
        const newPossMove = movesArr[i].split('');
        const h = newPossMove[0];
        const g = newPossMove[1];
        document.querySelector(`div[data-AN='${h}${g}']`).setAttribute('data-Piece','possible');
    }
    updateGameboard();
}
const updatePossibleAtts = (attsArr) => {
    console.log(attsArr);
    for (let i = 0; i < attsArr.length; i++) {
        const newPossAtt = attsArr[i].split('');
        const h = newPossAtt[0];
        const g = newPossAtt[1];
        const piece = document.querySelector(`div[data-AN='${h}${g}']`).getAttribute('data-Piece');
        const newAttackPoss = piece + '-atk';
        document.querySelector(`div[data-AN='${h}${g}']`).setAttribute('data-Piece',newAttackPoss);
    }
    updateGameboard();
}

const clearPossibleMoves = () => {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if(seeCurrentPiece(`${i}${j}`) === 'possible') {
                document.querySelector(`div[data-AN='${i}${j}']`).setAttribute('data-Piece','empty');
            }
        }
    }
}
const clearPossibleAtks = () => {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if(seeCurrentPiece(`${i}${j}`).split('-')[2] === 'atk') {
                const totPiece = document.querySelector(`div[data-AN='${i}${j}']`).getAttribute('data-Piece');
                const totPieceArr = totPiece.split('-');
                const piece = totPieceArr[0] + '-' + totPieceArr[1];
                console.log(piece);
                document.querySelector(`div[data-AN='${i}${j}']`).setAttribute('data-Piece',piece);
            }
        }
    }
}
// function that accepts moving a piece 'from' a tile 'to' another tile.
const movePiece = (from,to) => {
    const nfrom = from.split('');
    const piece = document.querySelector(`div[data-AN='${nfrom[0]}${nfrom[1]}']`).getAttribute('data-Piece');
    const nto = to.split('');
    document.querySelector(`div[data-AN='${nfrom[0]}${nfrom[1]}']`).setAttribute('data-Piece','empty');
    document.querySelector(`div[data-AN='${nto[0]}${nto[1]}']`).setAttribute('data-Piece',piece);
    clearPossibleMoves();
    updateGameboard();
    playerTurn = Math.abs(playerTurn - 1);
}

// function that accepts a 'tile' that you want to see if there are any pieces on
const seeCurrentPiece = (tile) => {
    const ntile = tile.split('');
    const i = Number(ntile[0]);
    const j = Number(ntile[1]);
    const gamePiece = document.querySelector(`div[data-AN='${i}${j}']`).getAttribute('data-Piece');
    return gamePiece;
}

// socket that listens for when the opponent moves
socket.on('opponent moved', (socketObj) => {
    console.log('i got that the opponent moved');
    updateOpponentMove(socketObj.gameboard);
    playerTurn = Math.abs(playerTurn-1);
});
socket.on('game over', (socketObj) => {
    if(socketObj.winner === 'w'){
        if(socketObj.winner === user.color){
            console.log('you won the game!');
            // TODO: update host stats to reflect that they won
            document.location.replace('/profile')
        } else {
            console.log('you lost the game!');
            // TODO: update opponent stats to reflect that they lost
            document.location.replace('/profile')
        }
    } else {
        if(socketObj.winner === user.color){
            console.log('you won the game!');
            // TODO: update opponent stats to reflect that they won
            document.location.replace('/profile')
        } else {
            console.log('you lost the game!');
            // TODO: update host stats to reflect that they lost
            document.location.replace('/profile')
        }
    }
});
})