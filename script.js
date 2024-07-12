document.addEventListener('DOMContentLoaded', () => {
    const setup = document.getElementById('setup');
    const game = document.getElementById('game');
    const startGameBtn = document.getElementById('startGameBtn');
    const modeSelect = document.getElementById('modeSelect');
    const playerNames = document.getElementById('playerNames');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const player1Score = document.getElementById('player1Score');
    const player2Score = document.getElementById('player2Score');
    const turnIndicator = document.getElementById('turnIndicator');
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const resetGameBtn = document.getElementById('resetGameBtn');
    let mode;
    let player1;
    let player2;
    let currentPlayer;
    let gameActive = true;
    let boardState = Array(9).fill('');
    let scores = { player1: 0, player2: 0 };

    modeSelect.addEventListener('change', () => {
        if (modeSelect.value === 'ai') {
            player2Input.value = 'AI';
            player2Input.disabled = true;
        } else {
            player2Input.value = '';
            player2Input.disabled = false;
        }
    });

    startGameBtn.addEventListener('click', startGame);

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetGameBtn.addEventListener('click', resetGame);

    function startGame() {
        mode = modeSelect.value;
        player1 = player1Input.value || 'Player 1';
        player2 = player2Input.value || (mode === 'ai' ? 'AI' : 'Player 2');
        player1Score.textContent = `${player1}: ${scores.player1}`;
        player2Score.textContent = `${player2}: ${scores.player2}`;
        turnIndicator.textContent = `${player1}'s turn (X)`;
        currentPlayer = 'X';
        gameActive = true;
        boardState.fill('');
        cells.forEach(cell => {
            cell.textContent = '';
        });
        setup.classList.add('hidden');
        game.classList.remove('hidden');
    }

    function handleCellClick(e) {
        const cell = e.target;
        const index = Array.from(cells).indexOf(cell);

        if (boardState[index] !== '' || !gameActive) {
            return;
        }

        boardState[index] = currentPlayer;
        cell.textContent = currentPlayer;

        if (checkWin()) {
            gameActive = false;
            scores[currentPlayer === 'X' ? 'player1' : 'player2']++;
            player1Score.textContent = `${player1}: ${scores.player1}`;
            player2Score.textContent = `${player2}: ${scores.player2}`;
            turnIndicator.textContent = `${currentPlayer === 'X' ? player1 : player2} wins!`;
        } else if (boardState.every(cell => cell !== '')) {
            gameActive = false;
            turnIndicator.textContent = 'Draw!';
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            turnIndicator.textContent = `${currentPlayer === 'X' ? player1 : player2}'s turn (${currentPlayer})`;
            if (mode === 'ai' && currentPlayer === 'O' && gameActive) {
                setTimeout(aiMove, 500);
            }
        }
    }

    function aiMove() {
        const emptyCells = boardState.map((val, index) => val === '' ? index : null).filter(val => val !== null);
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        boardState[randomIndex] = 'O';
        cells[randomIndex].textContent = 'O';
        if (checkWin()) {
            gameActive = false;
            scores.player2++;
            player2Score.textContent = `${player2}: ${scores.player2}`;
            turnIndicator.textContent = 'AI wins!';
        } else if (boardState.every(cell => cell !== '')) {
            gameActive = false;
            turnIndicator.textContent = 'Draw!';
        } else {
            currentPlayer = 'X';
            turnIndicator.textContent = `${player1}'s turn (X)`;
        }
    }

    function checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winPatterns.some(pattern => {
            return pattern.every(index => {
                return boardState[index] === currentPlayer;
            });
        });
    }

    function resetGame() {
        gameActive = true;
        boardState.fill('');
        cells.forEach(cell => {
            cell.textContent = '';
        });
        currentPlayer = 'X';
        turnIndicator.textContent = `${player1}'s turn (X)`;
    }
});
