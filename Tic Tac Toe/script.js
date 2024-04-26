let currentPlayer;
let player1Name;
let player2Name;
let turnTimer;
let countdown;
function updateTimerDisplay(timeLeft) {
    document.getElementById('timer').textContent = timeLeft;
}
function startTurn() {
    let timeLeft = 30; // Start with 30 seconds
    updateTimerDisplay(timeLeft);
    clearInterval(countdown); // Clear the previous interval if any

    countdown = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(countdown); // Stop the countdown
            endTurn(); // Time's up, switch turns
        }
    }, 1000);

    document.getElementById('current-player-name').textContent = currentPlayer;
}
function gameOver(winner) {
    clearInterval(countdown); // Stop the countdown
    alert(winner + " has won the game!"); // Alert the winner
    // Here you can reset the game or disable further clicks etc.
}

function endTurn() {
    currentPlayer = (currentPlayer === player1Name) ? player2Name : player1Name;
    startTurn();
}

document.getElementById('generateButton').addEventListener('click', function () {
    player1Name = document.getElementById('player1').value.trim();
    player2Name = document.getElementById('player2').value.trim();

    if (!player1Name || !player2Name) {
        alert('Please enter both player names.');
        return;
    }
    document.getElementById('player-inputs').style.display = 'none';
    document.getElementById('team-inputs').style.display = 'none';
    currentPlayer = player1Name; // Player 1 starts
    document.getElementById('current-turn').style.display = 'block';
    startTurn(); // Start the first turn

    document.getElementById('current-player-name').textContent = currentPlayer;

    // Get the team images from the inputs
    let teams = [];
    for (let i = 1; i <= 6; i++) {
        const input = document.getElementById('team' + i);
        if (input.files.length > 0) {
            const file = input.files[0];
            const imageUrl = URL.createObjectURL(file); // Create blob URL
            teams.push(imageUrl);
        } else {
            teams.push(null);
        }
    }


    // Assign team images to headers with CSS classes for fixed sizes
    document.getElementById('column1-header').innerHTML = `<img src="${teams[0]}" alt="Team Image" class="team-image">`;
    document.getElementById('column2-header').innerHTML = `<img src="${teams[1]}" alt="Team Image" class="team-image">`;
    document.getElementById('column3-header').innerHTML = `<img src="${teams[2]}" alt="Team Image" class="team-image">`;
    document.getElementById('row1-header').innerHTML = `<img src="${teams[3]}" alt="Team Image" class="team-image">`;
    document.getElementById('row2-header').innerHTML = `<img src="${teams[4]}" alt="Team Image" class="team-image">`;
    document.getElementById('row3-header').innerHTML = `<img src="${teams[5]}" alt="Team Image" class="team-image">`;


    // When a cell is clicked, place the symbol and switch turns
    document.querySelectorAll('.board-cell').forEach(cell => {
        cell.addEventListener('click', function () {
            if (!cell.textContent) {
                cell.textContent = currentPlayer === player1Name ? player1Name : player2Name;

                if (checkWin(currentPlayer)) {
                    gameOver(currentPlayer); // Handle the win
                } else {
                    endTurn(); // End the current turn after a cell is clicked
                }
            }
        }, { once: true });
    });
});

function checkWin(player) {
    const cells = [...document.querySelectorAll('.board-cell')].map(cell => cell.textContent);
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winningCombinations.some(combination => 
        combination.every(index => cells[index] === player)
    );
}

// Function to revoke blob URLs after use to prevent memory leaks
function revokeBlobURLs() {
    teams.forEach(team => {
        if (team !== null) {
            URL.revokeObjectURL(team);
        }
    });
}

// Make sure to reinitialize the board cells' event listeners after the game starts or is reset
function setupCells() {
    document.querySelectorAll('.board-cell').forEach(cell => {
        cell.removeEventListener('click', handleCellClick); // Remove existing listeners to avoid duplicates
        cell.addEventListener('click', handleCellClick); // Reattach the listener
    });
}


function resetGame() {
    document.querySelectorAll('.board-cell').forEach(cell => {
        cell.textContent = '';  // Clear the board cell content
        cell.removeEventListener('click', handleCellClick); // Remove the old event listener
        cell.addEventListener('click', handleCellClick); // Reattach the event listener
    });

    // Reset current player to Player 1
    currentPlayer = player1Name;
    document.getElementById('current-player-name').textContent = currentPlayer;

    // Restart the game timer if there's one
    clearInterval(countdown);
    startTurn();  // Start a new turn
}

function handleCellClick() {
    // Check if the cell already contains the current player's name
    if (this.textContent === currentPlayer) {
        // If so, clear the cell
        this.textContent = '';
    } else if (!this.textContent) {
        // If the cell is empty, mark it with the current player's name
        this.textContent = currentPlayer;

        // After marking the cell, check if this move wins the game or not
        if (checkWin(currentPlayer)) {
            gameOver(currentPlayer); // If a win is detected, handle the game over scenario
        } else {
            endTurn(); // If no win, proceed to end the turn
        }
    }
}

