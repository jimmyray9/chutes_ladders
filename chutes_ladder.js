window.addEventListener('DOMContentLoaded', (event) => {
    // constants for the game
    const players = {
        player1: 1,
        player2: 1, 
        player1Turn: true
    }

    const chutesLadders = {
        "2": 38,
        "7": 14,
        "8": 31,
        "15": 26,
        "16": 6,
        "21": 42,
        "28": 84,
        "36": 44,
        "46": 25,
        "49": 11,
        "51": 67,
        "62": 19,
        "64": 60,
        "71": 91,
        "74": 53,
        "78": 98,
        "87": 94,
        "89": 68,
        "92": 88, 
        "95": 75,
        "99": 80
    };

    //Dom elements
    const player1Pos = document.getElementById('player1Pos');
    const player2Pos = document.getElementById('player2Pos');
    const gameBoard = document.getElementsByClassName('gameboard')[0];
    const dice1Image = document.getElementsByClassName('dice-1')[0];
    const dice2Image = document.getElementsByClassName('dice-2')[0];
    const diceButton = document.getElementById('rollDice');
    const player1Choices = document.getElementsByClassName('player1choices')[0];
    const player2Choices = document.getElementsByClassName('player2choices')[0];
    const pieces = {};
        
    diceButton.onclick = rollDie;

    function initializeGame() {
        players.player1 = 1;
        players.player2 = 1;
        players.player1Turn = true;
        choosePieces("lego")
        generateBoard();
        displayPositions();
        //Need to wait until after the page has loaded otherwise the following will be undefined
        pieces.player1Piece = document.getElementById('player1Piece');
        pieces.player2Piece = document.getElementById('player2Piece');
        pieces.theme = document.getElementsByClassName('themes')[0];
        pieces.theme.addEventListener('click', e => choosePieces(e.toElement.innerText))
   }

    function choosePieces(theme) {
        // remove previous icons if not text
        while (player1Choices.lastChild.tagName != "H3") {
            player1Choices.lastChild.remove();
        }
        while (player2Choices.lastChild.tagName != "H3") {
            player2Choices.lastChild.remove();
        }
        //load up the theme icons
        let selections = ['piece-1.svg','piece-2.svg','piece-3.svg','piece-4.svg','piece-5.svg','piece-6.svg','piece-7.svg','piece-8.svg'];
        for (let i = 0; i != 4; ++i) {
            let piece = document.createElement('img');
            piece.classList.add('player1', 'piece');
            piece.src = './images/' + `${theme}/` + selections.pop();
            piece.setAttribute('data-num', i + 1);
            piece.setAttribute('data-piece-1', piece.src.replace(window.location.href, ""))
            player1Choices.append(piece);    
        }
        for (let i = 0; i != 4; ++i) {
            let piece = document.createElement('img');
            piece.classList.add('player2', 'piece');
            piece.src = './images/' + `${theme}/` + selections.pop();
            piece.setAttribute('data-num', i);
            piece.setAttribute('data-piece-2', piece.src.replace(window.location.href, ""))
            player2Choices.append(piece);            
        }
        //set the player pieces
        player1Choices.addEventListener('click', function(event) {
            const player1Piece = document.getElementById('player1Piece');
            player1Piece.setAttribute('src', event.target.src);
         });

         player2Choices.addEventListener('click', function(event) {
            const player2Piece = document.getElementById('player2Piece');
            player2Piece.setAttribute('src', event.target.src);
         });

         
    }

    function generateBoard() {
        // squares for the board - perhaps use flex order?
        for (let i = 1; i != 101; ++i) {
            let square = document.createElement("div");
            square.setAttribute('data', i)
            let text = document.createElement('h4')
            text.innerText = i;
            let image = document.createElement("div")
            image.classList.add('piecesSpace')
            // add the pieces to square 1
            if (i == 1) {
                let piece1 = document.createElement('img')
                let piece2 = document.createElement('img')
                piece1.id = 'player1Piece';
                piece1.src = '/images/lego/piece-7.svg';
                piece2.id = 'player2Piece';
                piece2.src = '/images/lego/piece-3.svg';
                image.appendChild(piece1);
                image.appendChild(piece2);
            }
            
            square.setAttribute("class", "square");
            // add additional classes for special squares
            if (chutesLadders[i]) {
                if (chutesLadders[i] > i) {
                    square.classList.add('ladder', 'green');
                } else {
                    square.classList.add('chute', 'red');
                }
            }
            //reverse the row direction for alternating rows
            // if ((i + "").split('')[0] % 2 == 0) {
            //     square.classList.add('reverse');
            // }
            gameBoard.prepend(square);
            square.appendChild(text);
            square.appendChild(image);
        }
        // ladders

        // chutes
    }


    function displayPositions() {
        player1Pos.innerText = players.player1;
        player2Pos.innerText = players.player2;
    }

    function movePiece(totalRoll) {
        if (players.player1Turn) {
            let newPosition = document.querySelector(`div[data='${players.player1}'] > div.piecesSpace`);
            newPosition.appendChild(pieces.player1Piece);
            newPosition.scrollIntoView({behavior: "smooth", block: "center"});
            console.log("offesetTop:", newPosition.offsetTop)
        } else {
            let newPosition = document.querySelector(`div[data='${players.player2}'] > div.piecesSpace`);
            newPosition.appendChild(pieces.player2Piece);
            newPosition.scrollIntoView({behavior: "smooth", block: "center"});
        }
        
    }

    function removePiece() {
        if (players.player1Turn) {
            document.getElementById('player1Piece').remove()
        } else {
            document.getElementById('player2Piece').remove()
        }
    }

    function checkChutesLadders() {
        if (players.player1Turn && chutesLadders[`${players.player1}`]) {
            console.log(`Hit a chute/ladder! Was at ${players.player1}... `)
            players.player1 = chutesLadders[`${players.player1}`]
            console.log(`and now at ${players.player1}`)
        } else if (chutesLadders[`${players.player2}`]) {
            console.log(`Hit a chute/ladder! Was at ${players.player1}... `)
            players.player2 = chutesLadders[`${players.player2}`]
            console.log(`and now at ${players.player1}`)
        }
    }

    function rollDie() {
        let dieRoll1 =  Math.ceil(Math.random() * Math.floor(6));
        let dieRoll2 =  Math.ceil(Math.random() * Math.floor(6));
        dice1Image.src = `./images/die-${dieRoll1}.svg`;
        dice2Image.src = `./images/die-${dieRoll2}.svg`;
        let totalRoll = dieRoll1 + dieRoll2;
        removePiece();
        checkOver(totalRoll);
        checkChutesLadders();
        movePiece(totalRoll);
        checkDoubles(dieRoll1, dieRoll2);
        displayPositions();
        checkWinner();
    }

        
    function checkDoubles( die1, die2) {
        if (die1 == die2) {
            return
        } else if (players.player1Turn) {
            players.player1Turn = false;
            player2Pos.parentElement.classList.add('currentPlayer');
            player1Pos.parentElement.className = ""
        } else {
            players.player1Turn = true;
            player1Pos.parentElement.classList.add('currentPlayer');
            player2Pos.parentElement.className = "";
        }
    }

    function checkWinner() {
        if (players.player1 == 100) {
            alert("Player 1 has won! How about another game?")
        } else if (players.player2 == 100) {
            alert("Player 2 has won! How about another game?")
        }
    }

    function checkOver(num) {
        if (players.player1Turn) {
            if ((players.player1 + num) > 100) {
                players.player1 = (100 - (players.player1 + num - 100))
            } else {
                players.player1 += num;
            }
            
        } else if (players.player2 + num > 100) {
            players.player2 = (100 - (players.player2 + num - 100))
        } else {
            players.player2 += num;
        }
    }
       
    initializeGame();
});
