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
    
    diceButton.onclick = rollDie;



    function initializeGame() {
        players.player1 = 1;
        players.player2 = 1;
        players.player1Turn = true;
        generateBoard();
        displayPositions();
    }

    function generateBoard() {
        // squares for board -- maybe flex order? 
        for (let i = 1; i != 101; ++i) {
            let square = document.createElement("div");
            square.setAttribute('data', i)
            let text = document.createElement('h4')
            text.innerText = i;
            let image = document.createElement("div")
            image.classList.add('pieceSpace1')
            let image2 = document.createElement("div")
            image2.classList.add('pieceSpace2')
            if (i == 1) {
                image.classList.add('player1Piece')
                image2.classList.add('player2Piece')
            }
            
            square.setAttribute("class", "square");
            // add additional classes for special squares
            if (chutesLadders[i]) {
                square.classList.add('ladder', 'red');
            }
            //reverse the row direction for alternating rows
            if ((i + "").split('')[0] % 2 == 0) {
                square.classList.add('reverse');
            }

            gameBoard.prepend(square);
            square.appendChild(text);
            square.appendChild(image);
            square.appendChild(image2);
        }
        // ladders

        // shutes
    }


    function displayPositions() {
        player1Pos.innerText = players.player1;
        player2Pos.innerText = players.player2;
    }

    function movePiece(totalRoll) {
        if (players.player1Turn) {
            let newPosition = document.querySelector(`div[data='${players.player1}'] > div.pieceSpace1`);
            newPosition.classList.add('player1Piece');
        } else {
            let newPosition = document.querySelector(`div[data='${players.player2}'] > div.pieceSpace2`);
            newPosition.classList.add('player2Piece');
        }
        
    }

    function removePiece() {
        if (players.player1Turn) {
            let initialPosition = document.querySelector(`div[data='${players.player1}'] > div.pieceSpace1`);
            initialPosition.classList.remove('player1Piece');
        } else {
            let initialPosition = document.querySelector(`div[data='${players.player2}'] > div.pieceSpace2`);
            initialPosition.classList.remove('player2Piece');
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
