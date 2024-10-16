class Player {
    constructor(name) {
        this.name = name;
        this.cards = {};
        this.isWinner = false;
        this.winLineInfo = "";
        this.gamesPlayed = 0;
        this.gamesWon = 0;
    }

    // Set cards for the player
    setCards(cards) {
        this.cards = cards;
    }

    // Check if the drawn piece is on the player's cards and remove it
    checkCard(curPiece) {
        for (let cardKey in this.cards) {
            let card = this.cards[cardKey];
            for (let lineKey in card) {
                const line = card[lineKey];
                const index = line.indexOf(curPiece);
                if (index > -1) {
                    line.splice(index, 1); // Remove the piece from the line
                    if (line.length === 0) { // Line completed
                        this.isWinner = true;
                        this.winLineInfo = `${cardKey}, ${lineKey}`;
                    }
                }
            }
        }
    }

    // Check if the player is a winner
    hasWon() {
        return this.isWinner;
    }

    // Increment games played and games won
    addWin() {
        this.gamesPlayed++;
        this.gamesWon++;
    }

    // Increment games played only
    addGame() {
        this.gamesPlayed++;
    }

    // Get player's name
    getName() {
        return this.name;
    }

    // Get player score
    getScore() {
        return `${this.gamesWon}/${this.gamesPlayed}`;
    }

    // Reset the player's stats
    resetStats() {
        this.gamesPlayed = 0;
        this.gamesWon = 0;
    }
}

// Export the Player class
export default Player;
