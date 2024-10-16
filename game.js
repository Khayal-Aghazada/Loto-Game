import Player from './player.js';  // Import the Player class

let containerPieceList = [];
let selectedPieceList = [];
let playerList = [];
let isGameOver = false;
let continuingGame = false; // Flag to check if it's a continuation
const maxNumberCnt = 35;
const cardLineCnt = 3;
const lineCellCnt = 5;

// Event listener to start a new game
document.getElementById('startGameBtn').addEventListener('click', () => {
    const playerCount = parseInt(document.getElementById('playerCount').value) || 2;
    continuingGame = false; // New game, not continuing
    startGame(playerCount);
    document.getElementById('gameArea').style.display = 'block';
});

// Event listener for continuing the game
document.getElementById('continueGameBtn').addEventListener('click', () => {
    continuingGame = true; // Continue the game with existing players
    startGame(playerList.length); // Use the existing number of players
    document.getElementById('gameArea').style.display = 'block';
});

// Function to start a new game (or continue the existing one)
// Function to start a new game (or continue the existing one)
function startGame(playerCount) {
    containerPieceList = [...Array(maxNumberCnt).keys()].map(x => x + 1); // Reset numbers
    selectedPieceList = []; // Clear selected pieces

    const playerCardsDiv = document.getElementById('playerCards');
    playerCardsDiv.innerHTML = ''; // Clear previous player cards

    // Check if we are continuing or starting a new game
    if (!continuingGame) {
        playerList = []; // Reset player list for a new game
        for (let i = 0; i < playerCount; i++) {
            const player = new Player(`Player ${i + 1}`);
            playerList.push(player);
        }

        // Reset player scores when starting a new game
        playerList.forEach(player => player.resetStats());
        updateScoreTable();  // Immediately update the score table to reflect the reset
    }

    // Generate new cards and reset winner flags
    playerList.forEach(player => {
        player.isWinner = false; // Reset winner status
        const cards = generateCards(1); // Generate new cards
        player.setCards(cards);
        displayPlayerCards(player);
    });

    isGameOver = false;
    document.getElementById('drawPieceBtn').disabled = false;
    document.getElementById('gameStatus').textContent = ''; // Clear game status

    // Hide the Continue button during the game
    document.getElementById('continueGameBtn').style.display = 'none';
    document.getElementById('startGameBtn').style.display = 'none';
}


// Draw the next piece and check for matches
document.getElementById('drawPieceBtn').addEventListener('click', nextPiece);

function nextPiece() {
    if (isGameOver || containerPieceList.length === 0) {
        return; // Stop if the game is already over
    }

    const curPiece = containerPieceList.splice(Math.floor(Math.random() * containerPieceList.length), 1)[0];
    selectedPieceList.push(curPiece);
    document.getElementById('drawnNumbers').textContent = selectedPieceList.join(', ');

    playerList.forEach(player => {
        player.checkCard(curPiece);

        // Highlight the number in red if it is drawn
        const drawnNumberCell = document.getElementById(`number-${player.getName()}-${curPiece}`);
        if (drawnNumberCell) {
            drawnNumberCell.style.backgroundColor = '#e74c3c'; // Change background to red
            drawnNumberCell.style.color = 'white'; // Change text color to white for contrast
        }
    });

    checkGameOver(); // Check if the game is over after drawing a number
}

function checkGameOver() {
    const winner = playerList.find(player => player.hasWon());

    // If a player has won or no numbers are left to draw, end the game
    if (winner || containerPieceList.length === 0) {
        isGameOver = true; // Mark the game as over

        // Update games played and won for each player
        playerList.forEach(player => {
            if (player === winner) {
                player.addWin(); // Increment games won
            } else {
                player.addGame(); // Increment games played for non-winners
            }
        });

        // Display winner message in the game area
        const message = winner
            ? `${winner.getName()} wins!`
            : "No more numbers left. It's a draw!";
        document.getElementById('gameStatus').textContent = message;

        // Disable the "Draw Next Piece" button so no further numbers can be drawn
        document.getElementById('drawPieceBtn').disabled = true;

        // Show an alert popup with winner information
        if (winner) {
            setTimeout(() => {
                alert(`${winner.getName()} has won the game!`);
            }, 200); // Add slight delay before showing the popup
        }

        // Update the score table
        updateScoreTable();

        // Show Continue button after game ends
        document.getElementById('continueGameBtn').style.display = 'block';
        document.getElementById('startGameBtn').style.display = 'block'; // Show Start New Game button
    }
}

// Function to display the score table
function updateScoreTable() {
    const scoreTableBody = document.getElementById('scoreTableBody');
    scoreTableBody.innerHTML = ''; // Clear previous score table

    playerList.forEach(player => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const scoreCell = document.createElement('td');

        nameCell.textContent = player.getName();
        scoreCell.textContent = player.getScore();

        row.appendChild(nameCell);
        row.appendChild(scoreCell);
        scoreTableBody.appendChild(row);
    });
}

// Generate cards with unique numbers
function generateCards(cardCount) {
    let cards = {};
    let usedNumbers = new Set(); // Track used numbers to avoid duplicates

    for (let i = 0; i < cardCount; i++) {
        let card = {};

        for (let j = 0; j < cardLineCnt; j++) {
            let line = new Set();

            while (line.size < lineCellCnt) {
                let randomNum = Math.floor(Math.random() * maxNumberCnt) + 1;
                if (!usedNumbers.has(randomNum)) {
                    line.add(randomNum);
                    usedNumbers.add(randomNum); // Mark the number as used
                }
            }

            card[`Line ${j + 1}`] = Array.from(line); // Convert set to array
        }

        cards[`Card ${i + 1}`] = card;
    }

    return cards;
}

function displayPlayerCards(player) {
    const playerCardsDiv = document.getElementById('playerCards');
    const playerDiv = document.createElement('div');
    playerDiv.classList.add('player-card');
    playerDiv.innerHTML = `<h4>${player.getName()}</h4>`; // Player's name at the top

    for (let cardKey in player.cards) {
        let card = player.cards[cardKey];

        // For each line in the card, create a row (div.line)
        for (let lineKey in card) {
            const lineDiv = document.createElement('div');
            lineDiv.classList.add('line'); // Create a row for numbers

            card[lineKey].forEach(number => {
                const numberDiv = document.createElement('div');
                numberDiv.classList.add('number');
                numberDiv.id = `number-${player.getName()}-${number}`; // Unique ID for each number
                numberDiv.textContent = number;
                lineDiv.appendChild(numberDiv); // Add number to the row
            });

            playerDiv.appendChild(lineDiv); // Add the row to the player's card
        }
    }

    playerCardsDiv.appendChild(playerDiv); // Add the full card to the player cards container
}
