// Game state and configuration
const gameState = {
    board: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    gameActive: true,
    gameMode: 'pvp',
    difficulty: 'medium',
    stats: {
        xWins: 0,
        oWins: 0,
        draws: 0,
        totalGames: 0,
        history: []
    },
    winLine: null
};

// DOM Elements
const elements = {
    cells: document.querySelectorAll('.cell'),
    statusDisplay: document.querySelector('.status'),
    restartButton: document.getElementById('restart-btn'),
    newGameButton: document.getElementById('new-game-btn'),
    pvpButton: document.getElementById('pvp-btn'),
    pvcButton: document.getElementById('pvc-btn'),
    easyButton: document.getElementById('easy-btn'),
    mediumButton: document.getElementById('medium-btn'),
    hardButton: document.getElementById('hard-btn'),
    gameModeDisplay: document.getElementById('game-mode'),
    board: document.getElementById('board'),
    statXWins: document.getElementById('stat-x-wins'),
    statOWins: document.getElementById('stat-o-wins'),
    statTotalGames: document.getElementById('stat-total-games'),
    statDraws: document.getElementById('stat-draws'),
    historyList: document.getElementById('history-list'),
    resetStatsButton: document.getElementById('reset-stats-btn')
};

// Winning conditions
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
];

// Messages
const messages = {
    winning: () => `Player <span class="player-${gameState.currentPlayer.toLowerCase()}">${gameState.currentPlayer}</span> wins!`,
    draw: () => `Game ended in a draw!`,
    currentTurn: () => `Player <span class="player-${gameState.currentPlayer.toLowerCase()}">${gameState.currentPlayer}</span>'s turn`
};

// Initialize the game
function initGame() {
    // Reset board state
    gameState.board = ['', '', '', '', '', '', '', '', ''];
    gameState.gameActive = true;
    gameState.currentPlayer = 'X';
    
    // Remove existing win line
    if (gameState.winLine) {
        gameState.winLine.remove();
        gameState.winLine = null;
    }
    
    // Reset UI
    elements.statusDisplay.innerHTML = messages.currentTurn();
    elements.cells.forEach(cell => {
        cell.classList.remove('x', 'o', 'win-animation');
        cell.innerHTML = '';
    });
    
    // Update stats display
    updateStatsDisplay();
}

// Handle cell click
function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = parseInt(cell.getAttribute('data-cell-index'));
    
    // Check if cell is already taken or game is inactive
    if (gameState.board[cellIndex] !== '' || !gameState.gameActive) {
        return;
    }
    
    // Process player move
    placeMark(cell, cellIndex);
    
    // Check for win or draw
    if (checkWin()) {
        endGame(false);
    } else if (checkDraw()) {
        endGame(true);
    } else {
        // Switch player
        changePlayer();
        
        // If playing against computer and it's computer's turn
        if (gameState.gameMode === 'pvc' && gameState.currentPlayer === 'O' && gameState.gameActive) {
            setTimeout(computerMove, 600);
        }
    }
}

// Place mark on the board
function placeMark(cell, cellIndex) {
    gameState.board[cellIndex] = gameState.currentPlayer;
    cell.classList.add(gameState.currentPlayer.toLowerCase());
}

// Change player
function changePlayer() {
    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
    elements.statusDisplay.innerHTML = messages.currentTurn();
}

// Check for win
function checkWin() {
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (gameState.board[a] && 
            gameState.board[a] === gameState.board[b] && 
            gameState.board[a] === gameState.board[c]) {
            
            // Highlight winning cells
            elements.cells[a].classList.add('win-animation');
            elements.cells[b].classList.add('win-animation');
            elements.cells[c].classList.add('win-animation');
            
            // Draw win line
            drawWinLine(a, b, c);
            return true;
        }
    }
    return false;
}

// Draw win line
function drawWinLine(a, b, c) {
    // Remove any existing win line
    if (gameState.winLine) {
        gameState.winLine.remove();
    }
    
    const cellA = elements.cells[a];
    const cellB = elements.cells[b];
    const cellC = elements.cells[c];
    
    // Calculate line position and dimensions
    const rectA = cellA.getBoundingClientRect();
    const rectB = cellB.getBoundingClientRect();
    const rectC = cellC.getBoundingClientRect();
    
    // Get the board's position
    const boardRect = elements.board.getBoundingClientRect();
    
    // Create win line element
    const winLine = document.createElement('div');
    winLine.classList.add('win-line');
    
    // Determine line direction and position
    if (a % 3 === 0 && b % 3 === 1 && c % 3 === 2) { // Row
        winLine.style.width = `${rectC.right - rectA.left}px`;
        winLine.style.height = '10px';
        winLine.style.top = `${(rectA.top + rectA.bottom)/2 - boardRect.top - 5}px`;
        winLine.style.left = `${rectA.left - boardRect.left}px`;
    } else if (a < 3 && b < 6 && c < 9) { // Column
        winLine.style.width = '10px';
        winLine.style.height = `${rectC.bottom - rectA.top}px`;
        winLine.style.left = `${(rectA.left + rectA.right)/2 - boardRect.left - 5}px`;
        winLine.style.top = `${rectA.top - boardRect.top}px`;
    } else if (a === 0 && c === 8) { // Diagonal top-left to bottom-right
        winLine.style.width = `${Math.sqrt(Math.pow(rectC.left - rectA.left, 2) + Math.pow(rectC.top - rectA.top, 2))}px`;
        winLine.style.transform = 'rotate(45deg)';
        winLine.style.transformOrigin = 'top left';
        winLine.style.top = `${rectA.top - boardRect.top + rectA.height/2}px`;
        winLine.style.left = `${rectA.left - boardRect.left}px`;
    } else { // Diagonal top-right to bottom-left
        winLine.style.width = `${Math.sqrt(Math.pow(rectC.left - rectA.left, 2) + Math.pow(rectC.top - rectA.top, 2))}px`;
        winLine.style.transform = 'rotate(-45deg)';
        winLine.style.transformOrigin = 'top right';
        winLine.style.top = `${rectA.top - boardRect.top + rectA.height/2}px`;
        winLine.style.left = `${rectA.right - boardRect.left}px`;
    }
    
    elements.board.appendChild(winLine);
    gameState.winLine = winLine;
}

// Check for draw
function checkDraw() {
    return !gameState.board.includes('');
}

// End game
function endGame(draw) {
    gameState.gameActive = false;
    gameState.stats.totalGames++;
    
    // Add to game history
    const gameResult = {
        date: new Date().toLocaleString(),
        mode: gameState.gameMode,
        result: draw ? 'draw' : (gameState.currentPlayer === 'X' ? 'x-win' : 'o-win')
    };
    
    gameState.stats.history.unshift(gameResult);
    if (gameState.stats.history.length > 10) {
        gameState.stats.history.pop();
    }
    
    if (draw) {
        elements.statusDisplay.innerHTML = messages.draw();
        gameState.stats.draws++;
    } else {
        elements.statusDisplay.innerHTML = messages.winning();
        if (gameState.currentPlayer === 'X') {
            gameState.stats.xWins++;
        } else {
            gameState.stats.oWins++;
        }
    }
    
    // Update stats display
    updateStatsDisplay();
    updateHistoryDisplay();
}

// Computer move logic
function computerMove() {
    if (!gameState.gameActive) return;
    
    let move;
    
    switch(gameState.difficulty) {
        case 'easy':
            move = getRandomMove();
            break;
        case 'medium':
            move = getMediumMove();
            break;
        case 'hard':
            move = getBestMove();
            break;
        default:
            move = getMediumMove();
    }
    
    if (move !== -1) {
        const cell = elements.cells[move];
        placeMark(cell, move);
        
        if (checkWin()) {
            endGame(false);
        } else if (checkDraw()) {
            endGame(true);
        } else {
            changePlayer();
        }
    }
}

// Get random move
function getRandomMove() {
    const availableMoves = gameState.board
        .map((cell, index) => cell === '' ? index : null)
        .filter(index => index !== null);
    
    if (availableMoves.length === 0) return -1;
    
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
}

// Get medium difficulty move
function getMediumMove() {
    // Try to win
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (gameState.board[a] === 'O' && gameState.board[b] === 'O' && gameState.board[c] === '') return c;
        if (gameState.board[a] === 'O' && gameState.board[c] === 'O' && gameState.board[b] === '') return b;
        if (gameState.board[b] === 'O' && gameState.board[c] === 'O' && gameState.board[a] === '') return a;
    }
    
    // Block opponent
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (gameState.board[a] === 'X' && gameState.board[b] === 'X' && gameState.board[c] === '') return c;
        if (gameState.board[a] === 'X' && gameState.board[c] === 'X' && gameState.board[b] === '') return b;
        if (gameState.board[b] === 'X' && gameState.board[c] === 'X' && gameState.board[a] === '') return a;
    }
    
    // Take center if available
    if (gameState.board[4] === '') return 4;
    
    // Take a corner if available
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(index => gameState.board[index] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Take any available move
    return getRandomMove();
}

// Get best move (minimax algorithm)
function getBestMove() {
    let bestScore = -Infinity;
    let move;
    
    for (let i = 0; i < gameState.board.length; i++) {
        if (gameState.board[i] === '') {
            gameState.board[i] = 'O';
            let score = minimax(gameState.board, 0, false);
            gameState.board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    
    return move;
}

// Minimax algorithm
function minimax(board, depth, isMaximizing) {
    // Check for terminal states
    if (checkWinForPlayer('O')) return 10 - depth;
    if (checkWinForPlayer('X')) return depth - 10;
    if (checkDraw()) return 0;
    
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Check win for specific player
function checkWinForPlayer(player) {
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (gameState.board[a] === player && 
            gameState.board[b] === player && 
            gameState.board[c] === player) {
            return true;
        }
    }
    return false;
}

// Update stats display
function updateStatsDisplay() {
    elements.statXWins.textContent = gameState.stats.xWins;
    elements.statOWins.textContent = gameState.stats.oWins;
    elements.statTotalGames.textContent = gameState.stats.totalGames;
    elements.statDraws.textContent = gameState.stats.draws;
}

// Update history display
function updateHistoryDisplay() {
    if (gameState.stats.history.length === 0) {
        elements.historyList.innerHTML = '<div class="history-item"><span>No games played yet</span></div>';
        return;
    }
    
    elements.historyList.innerHTML = '';
    
    gameState.stats.history.forEach(game => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        
        let resultText, resultClass;
        switch(game.result) {
            case 'x-win':
                resultText = 'Player X Win';
                resultClass = 'win';
                break;
            case 'o-win':
                resultText = 'Player O Win';
                resultClass = game.gameMode === 'pvp' ? 'win' : 'loss';
                break;
            default:
                resultText = 'Draw';
                resultClass = 'draw';
        }
        
        historyItem.innerHTML = `
            <div>${game.date}</div>
            <div class="history-result ${resultClass}">${resultText}</div>
            <div>${game.mode.toUpperCase()}</div>
        `;
        
        elements.historyList.appendChild(historyItem);
    });
}

// Reset statistics
function resetStatistics() {
    gameState.stats = {
        xWins: 0,
        oWins: 0,
        draws: 0,
        totalGames: 0,
        history: []
    };
    updateStatsDisplay();
    updateHistoryDisplay();
}

// Event listeners setup
function setupEventListeners() {
    elements.cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    elements.restartButton.addEventListener('click', initGame);
    
    elements.newGameButton.addEventListener('click', () => {
        resetStatistics();
        initGame();
    });
    
    elements.pvpButton.addEventListener('click', () => {
        gameState.gameMode = 'pvp';
        elements.pvpButton.classList.add('active-mode');
        elements.pvcButton.classList.remove('active-mode');
        elements.gameModeDisplay.textContent = 'Mode: Player vs Player';
        initGame();
    });
    
    elements.pvcButton.addEventListener('click', () => {
        gameState.gameMode = 'pvc';
        elements.pvcButton.classList.add('active-mode');
        elements.pvpButton.classList.remove('active-mode');
        elements.gameModeDisplay.textContent = 'Mode: Player vs Computer';
        initGame();
    });
    
    elements.easyButton.addEventListener('click', () => {
        gameState.difficulty = 'easy';
        elements.easyButton.classList.add('active-mode');
        elements.mediumButton.classList.remove('active-mode');
        elements.hardButton.classList.remove('active-mode');
    });
    
    elements.mediumButton.addEventListener('click', () => {
        gameState.difficulty = 'medium';
        elements.mediumButton.classList.add('active-mode');
        elements.easyButton.classList.remove('active-mode');
        elements.hardButton.classList.remove('active-mode');
    });
    
    elements.hardButton.addEventListener('click', () => {
        gameState.difficulty = 'hard';
        elements.hardButton.classList.add('active-mode');
        elements.easyButton.classList.remove('active-mode');
        elements.mediumButton.classList.remove('active-mode');
    });
    
    elements.resetStatsButton.addEventListener('click', resetStatistics);
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    initGame();
    updateHistoryDisplay();
});