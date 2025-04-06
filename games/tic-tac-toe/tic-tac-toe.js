document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusMessage = document.getElementById('status');
    const resetButton = document.getElementById('reset-btn');
    const resetScoreButton = document.getElementById('reset-score-btn');
    const xScoreElement = document.getElementById('x-score');
    const oScoreElement = document.getElementById('o-score');
    const tiesElement = document.getElementById('ties');
    const modeInputs = document.querySelectorAll('input[name="mode"]');
    const difficultyContainer = document.getElementById('difficulty-container');
    const difficultySelect = document.getElementById('difficulty');
    const firstMoveSelect = document.getElementById('first-move');
    
    // Game state
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'x';
    let gameActive = true;
    let aiMode = false;
    let aiDifficulty = 'medium';
    let scores = {
        x: 0,
        o: 0,
        ties: 0
    };
    
    // Winning combinations
    const winPatterns = [
        [0, 1, 2], // top row
        [3, 4, 5], // middle row
        [6, 7, 8], // bottom row
        [0, 3, 6], // left column
        [1, 4, 7], // middle column
        [2, 5, 8], // right column
        [0, 4, 8], // diagonal from top-left
        [2, 4, 6]  // diagonal from top-right
    ];
    
    // Load saved scores from localStorage
    loadScores();
    
    // Initialize UI based on saved settings
    initializeUI();
    
    // Add event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    resetButton.addEventListener('click', resetGame);
    resetScoreButton.addEventListener('click', resetScores);
    
    modeInputs.forEach(input => {
        input.addEventListener('change', handleModeChange);
    });
    
    difficultySelect.addEventListener('change', (e) => {
        aiDifficulty = e.target.value;
        localStorage.setItem('ticTacToeDifficulty', aiDifficulty);
    });
    
    firstMoveSelect.addEventListener('change', (e) => {
        resetGame();
        localStorage.setItem('ticTacToeFirstMove', e.target.value);
    });
    
    // Initialize UI based on saved settings
    function initializeUI() {
        // Load game mode
        const savedMode = localStorage.getItem('ticTacToeMode') || 'two-player';
        document.querySelector(`input[value="${savedMode}"]`).checked = true;
        aiMode = savedMode === 'ai';
        
        // Show/hide difficulty selector
        if (aiMode) {
            difficultyContainer.classList.add('active');
        }
        
        // Load AI difficulty
        aiDifficulty = localStorage.getItem('ticTacToeDifficulty') || 'medium';
        difficultySelect.value = aiDifficulty;
        
        // Load first move preference
        const savedFirstMove = localStorage.getItem('ticTacToeFirstMove') || 'x';
        firstMoveSelect.value = savedFirstMove;
        
        // Set first player based on settings
        setFirstPlayer();
    }
    
    // Set the first player based on the selection
    function setFirstPlayer() {
        const firstMove = firstMoveSelect.value;
        
        if (firstMove === 'random') {
            currentPlayer = Math.random() < 0.5 ? 'x' : 'o';
        } else {
            currentPlayer = firstMove;
        }
        
        updateStatusMessage();
        
        // If AI starts first, make the AI move
        if (aiMode && currentPlayer === 'o') {
            setTimeout(makeAiMove, 700);
        }
    }
    
    // Handle game mode change
    function handleModeChange(e) {
        aiMode = e.target.value === 'ai';
        localStorage.setItem('ticTacToeMode', e.target.value);
        
        // Show/hide difficulty selector
        if (aiMode) {
            difficultyContainer.classList.add('active');
        } else {
            difficultyContainer.classList.remove('active');
        }
        
        resetGame();
    }
    
    // Handle cell click
    function handleCellClick(e) {
        const cell = e.target;
        const cellIndex = parseInt(cell.getAttribute('data-cell-index'));
        
        // Check if cell is already filled or game is not active
        if (gameBoard[cellIndex] !== '' || !gameActive) {
            return;
        }
        
        // Check if it's AI's turn
        if (aiMode && currentPlayer === 'o') {
            return;
        }
        
        // Update the board and UI
        makeMove(cellIndex);
        
        // If AI mode is on and game is still active, make AI move
        if (aiMode && gameActive) {
            setTimeout(makeAiMove, 700);
        }
    }
    
    // Make a move
    function makeMove(cellIndex) {
        gameBoard[cellIndex] = currentPlayer;
        cells[cellIndex].classList.add(currentPlayer);
        
        // Add text content for better compatibility
        cells[cellIndex].textContent = currentPlayer.toUpperCase();
        
        // Check for win or draw
        if (checkWin()) {
            gameOver(false);
        } else if (checkDraw()) {
            gameOver(true);
        } else {
            // Switch player and update status
            currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
            updateStatusMessage();
        }
    }
    
    // Make AI move based on difficulty
    function makeAiMove() {
        if (!gameActive) return;
        
        let cellIndex;
        
        switch (aiDifficulty) {
            case 'easy':
                cellIndex = getRandomEmptyCell();
                break;
                
            case 'medium':
                // 70% chance of making a smart move, 30% chance of random move
                if (Math.random() < 0.7) {
                    cellIndex = getBestMove();
                } else {
                    cellIndex = getRandomEmptyCell();
                }
                break;
                
            case 'hard':
                cellIndex = getBestMove();
                break;
                
            default:
                cellIndex = getRandomEmptyCell();
        }
        
        if (cellIndex !== null) {
            makeMove(cellIndex);
        }
    }
    
    // Get random empty cell
    function getRandomEmptyCell() {
        const emptyCells = gameBoard.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);
        
        if (emptyCells.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    }
    
    // Get the best move using minimax algorithm
    function getBestMove() {
        let bestScore = -Infinity;
        let bestMove = null;
        
        for (let i = 0; i < gameBoard.length; i++) {
            // Check if cell is empty
            if (gameBoard[i] === '') {
                // Make a temporary move
                gameBoard[i] = 'o';
                // Get score from minimax
                const score = minimax(gameBoard, 0, false);
                // Undo the move
                gameBoard[i] = '';
                
                // Update best score and move
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        return bestMove;
    }
    
    // Minimax algorithm
    function minimax(board, depth, isMaximizing) {
        // Check terminal states
        const winner = checkWinnerForMinimax();
        
        if (winner === 'o') return 10 - depth;
        if (winner === 'x') return depth - 10;
        if (checkDraw()) return 0;
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'o';
                    const score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            
            return bestScore;
        } else {
            let bestScore = Infinity;
            
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'x';
                    const score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            
            return bestScore;
        }
    }
    
    // Check for winner for minimax
    function checkWinnerForMinimax() {
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                return gameBoard[a];
            }
        }
        return null;
    }
    
    // Check for a win
    function checkWin() {
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                // Highlight winning cells
                cells[a].classList.add('win');
                cells[b].classList.add('win');
                cells[c].classList.add('win');
                return true;
            }
        }
        return false;
    }
    
    // Check for a draw
    function checkDraw() {
        return !gameBoard.includes('');
    }
    
    // Game over handling
    function gameOver(isDraw) {
        gameActive = false;
        
        if (isDraw) {
            statusMessage.textContent = "It's a draw!";
            statusMessage.className = 'status-message draw';
            scores.ties++;
            tiesElement.textContent = scores.ties;
        } else {
            statusMessage.textContent = `${currentPlayer.toUpperCase()} wins!`;
            statusMessage.className = 'status-message win';
            scores[currentPlayer]++;
            
            if (currentPlayer === 'x') {
                xScoreElement.textContent = scores.x;
            } else {
                oScoreElement.textContent = scores.o;
            }
        }
        
        // Save scores
        saveScores();
    }
    
    // Update status message
    function updateStatusMessage() {
        statusMessage.textContent = `${currentPlayer.toUpperCase()}'s turn`;
        statusMessage.className = `status-message ${currentPlayer}-turn`;
    }
    
    // Reset game
    function resetGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        
        // Clear board UI
        cells.forEach(cell => {
            cell.className = 'cell';
            cell.textContent = '';
        });
        
        // Set first player based on settings
        setFirstPlayer();
    }
    
    // Reset scores
    function resetScores() {
        scores = {
            x: 0,
            o: 0,
            ties: 0
        };
        
        xScoreElement.textContent = '0';
        oScoreElement.textContent = '0';
        tiesElement.textContent = '0';
        
        saveScores();
    }
    
    // Save scores to localStorage
    function saveScores() {
        localStorage.setItem('ticTacToeScores', JSON.stringify(scores));
    }
    
    // Load scores from localStorage
    function loadScores() {
        const savedScores = localStorage.getItem('ticTacToeScores');
        if (savedScores) {
            scores = JSON.parse(savedScores);
            xScoreElement.textContent = scores.x;
            oScoreElement.textContent = scores.o;
            tiesElement.textContent = scores.ties;
        }
    }
}); 