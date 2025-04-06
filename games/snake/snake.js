document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const gameMessage = document.querySelector('.game-message');
    const currentScoreElement = document.getElementById('current-score');
    const highScoreElement = document.getElementById('high-score');
    const upBtn = document.getElementById('up-btn');
    const downBtn = document.getElementById('down-btn');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    
    // Set up the canvas to be responsive
    function setupCanvas() {
        // For mobile devices, make the canvas fill the screen minus some padding
        if (window.innerWidth <= 600) {
            const gameContainer = document.querySelector('.game-container');
            const containerWidth = gameContainer.clientWidth;
            const containerHeight = gameContainer.clientHeight;
            
            // Leave room for controls and score
            const maxSize = Math.min(containerWidth, containerHeight - 150);
            
            canvas.width = maxSize;
            canvas.height = maxSize;
            
            // Update the grid size based on canvas dimensions
            gridSize = canvas.width / tileCount;
        } else {
            // Default size for desktop
            canvas.width = 400;
            canvas.height = 400;
            gridSize = 20;
        }
    }
    
    // Call setupCanvas on resize
    window.addEventListener('resize', () => {
        setupCanvas();
        if (gameRunning) {
            // If game is running, we need to redraw
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, 1000 / fps);
        }
    });
    
    // Initial setup
    setupCanvas();
    
    // Game variables
    let gameRunning = false;
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gridSize = 20;
    let tileCount = 20; // Fixed tile count for consistency
    let fps = 10;
    let gameInterval;
    
    // Set high score on load
    highScoreElement.textContent = highScore;
    
    // Snake properties
    let snake = [];
    let snakeHeadX = 10;
    let snakeHeadY = 10;
    let velocityX = 0;
    let velocityY = 0;
    let lastDirection = '';
    
    // Food properties
    let foodX = 5;
    let foodY = 5;
    
    // Game functions
    function startGame() {
        if (!gameRunning) {
            gameRunning = true;
            snake = [];
            snake.push({x: snakeHeadX, y: snakeHeadY});
            velocityX = 0;
            velocityY = 0;
            lastDirection = '';
            score = 0;
            currentScoreElement.textContent = score;
            gameMessage.style.display = 'none';
            placeFood();
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, 1000 / fps);
        }
    }
    
    function gameOver() {
        gameRunning = false;
        clearInterval(gameInterval);
        
        if (window.innerWidth <= 600) {
            gameMessage.innerHTML = 'Game Over!<br>Tap or use controls to restart';
        } else {
            gameMessage.textContent = 'Game Over! Press Any Arrow Key to Restart';
        }
        
        gameMessage.style.display = 'block';
        
        // Update high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            highScoreElement.textContent = highScore;
        }
    }
    
    function placeFood() {
        // Random position for food
        let valid = false;
        while (!valid) {
            foodX = Math.floor(Math.random() * tileCount);
            foodY = Math.floor(Math.random() * tileCount);
            
            // Make sure food doesn't appear on snake
            valid = true;
            for (let i = 0; i < snake.length; i++) {
                if (snake[i].x === foodX && snake[i].y === foodY) {
                    valid = false;
                    break;
                }
            }
        }
    }
    
    function drawSnake() {
        // Draw snake body parts
        for (let i = 0; i < snake.length; i++) {
            if (i === 0) {
                // Snake head
                ctx.fillStyle = '#4CAF50';
            } else {
                // Snake body
                ctx.fillStyle = '#8BC34A';
            }
            ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);
            
            // Add eyes to snake head
            if (i === 0) {
                ctx.fillStyle = 'white';
                
                // Adjust eye positions based on direction
                let eyeX1, eyeY1, eyeX2, eyeY2;
                let eyeSize = 3;
                
                switch(lastDirection) {
                    case 'up':
                        eyeX1 = snake[i].x * gridSize + gridSize / 3 - eyeSize / 2;
                        eyeY1 = snake[i].y * gridSize + gridSize / 3 - eyeSize / 2;
                        eyeX2 = snake[i].x * gridSize + 2 * gridSize / 3 - eyeSize / 2;
                        eyeY2 = snake[i].y * gridSize + gridSize / 3 - eyeSize / 2;
                        break;
                    case 'down':
                        eyeX1 = snake[i].x * gridSize + gridSize / 3 - eyeSize / 2;
                        eyeY1 = snake[i].y * gridSize + 2 * gridSize / 3 - eyeSize / 2;
                        eyeX2 = snake[i].x * gridSize + 2 * gridSize / 3 - eyeSize / 2;
                        eyeY2 = snake[i].y * gridSize + 2 * gridSize / 3 - eyeSize / 2;
                        break;
                    case 'left':
                        eyeX1 = snake[i].x * gridSize + gridSize / 3 - eyeSize / 2;
                        eyeY1 = snake[i].y * gridSize + gridSize / 3 - eyeSize / 2;
                        eyeX2 = snake[i].x * gridSize + gridSize / 3 - eyeSize / 2;
                        eyeY2 = snake[i].y * gridSize + 2 * gridSize / 3 - eyeSize / 2;
                        break;
                    case 'right':
                        eyeX1 = snake[i].x * gridSize + 2 * gridSize / 3 - eyeSize / 2;
                        eyeY1 = snake[i].y * gridSize + gridSize / 3 - eyeSize / 2;
                        eyeX2 = snake[i].x * gridSize + 2 * gridSize / 3 - eyeSize / 2;
                        eyeY2 = snake[i].y * gridSize + 2 * gridSize / 3 - eyeSize / 2;
                        break;
                    default:
                        // Default eyes position if no direction yet
                        eyeX1 = snake[i].x * gridSize + gridSize / 3 - eyeSize / 2;
                        eyeY1 = snake[i].y * gridSize + gridSize / 3 - eyeSize / 2;
                        eyeX2 = snake[i].x * gridSize + 2 * gridSize / 3 - eyeSize / 2;
                        eyeY2 = snake[i].y * gridSize + gridSize / 3 - eyeSize / 2;
                }
                
                ctx.fillRect(eyeX1, eyeY1, eyeSize, eyeSize);
                ctx.fillRect(eyeX2, eyeY2, eyeSize, eyeSize);
            }
        }
    }
    
    function drawFood() {
        // Draw food (apple)
        ctx.fillStyle = '#FF5252';
        ctx.beginPath();
        ctx.arc(foodX * gridSize + gridSize/2, foodY * gridSize + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Add stem
        ctx.fillStyle = '#795548';
        ctx.fillRect(foodX * gridSize + gridSize/2 - 1, foodY * gridSize, 2, gridSize/4);
    }
    
    function drawGrid() {
        // Draw grid lines (optional)
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i <= tileCount; i++) {
            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();
            
            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }
    }
    
    function updateSnake() {
        if (!gameRunning) return;
        
        // Create new head based on direction
        const newHead = {
            x: snake[0].x + velocityX,
            y: snake[0].y + velocityY
        };
        
        // Check for collisions with walls
        if (newHead.x < 0 || newHead.x >= tileCount || newHead.y < 0 || newHead.y >= tileCount) {
            gameOver();
            return;
        }
        
        // Check for collisions with self
        for (let i = 0; i < snake.length; i++) {
            if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
                gameOver();
                return;
            }
        }
        
        // Add new head to beginning of snake array
        snake.unshift(newHead);
        
        // Check if snake eats food
        if (newHead.x === foodX && newHead.y === foodY) {
            score++;
            currentScoreElement.textContent = score;
            placeFood();
            
            // Increase speed slightly when eating food
            if (score % 5 === 0) {
                clearInterval(gameInterval);
                fps += 1;
                gameInterval = setInterval(gameLoop, 1000 / fps);
            }
        } else {
            // Remove tail if no food was eaten
            snake.pop();
        }
    }
    
    // Input handling for keyboard
    document.addEventListener('keydown', function(e) {
        // Start game with any arrow key
        if (!gameRunning && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            startGame();
        }
        
        // Handle direction change
        changeDirection(e.key);
    });
    
    // Helper function to change direction
    function changeDirection(key) {
        switch(key) {
            case 'ArrowUp':
                if (lastDirection !== 'down') {
                    velocityX = 0;
                    velocityY = -1;
                    lastDirection = 'up';
                }
                break;
            case 'ArrowDown':
                if (lastDirection !== 'up') {
                    velocityX = 0;
                    velocityY = 1;
                    lastDirection = 'down';
                }
                break;
            case 'ArrowLeft':
                if (lastDirection !== 'right') {
                    velocityX = -1;
                    velocityY = 0;
                    lastDirection = 'left';
                }
                break;
            case 'ArrowRight':
                if (lastDirection !== 'left') {
                    velocityX = 1;
                    velocityY = 0;
                    lastDirection = 'right';
                }
                break;
        }
    }
    
    // Mobile touch controls
    upBtn.addEventListener('click', function() {
        if (!gameRunning) startGame();
        changeDirection('ArrowUp');
    });
    
    downBtn.addEventListener('click', function() {
        if (!gameRunning) startGame();
        changeDirection('ArrowDown');
    });
    
    leftBtn.addEventListener('click', function() {
        if (!gameRunning) startGame();
        changeDirection('ArrowLeft');
    });
    
    rightBtn.addEventListener('click', function() {
        if (!gameRunning) startGame();
        changeDirection('ArrowRight');
    });
    
    // Add swipe support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    canvas.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        e.preventDefault();
        
        // Start game if not running
        if (!gameRunning) startGame();
    }, { passive: false });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    canvas.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // Determine swipe direction based on which axis had larger movement
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (diffX > 0) {
                changeDirection('ArrowRight');
            } else {
                changeDirection('ArrowLeft');
            }
        } else {
            // Vertical swipe
            if (diffY > 0) {
                changeDirection('ArrowDown');
            } else {
                changeDirection('ArrowUp');
            }
        }
        
        e.preventDefault();
    }, { passive: false });
    
    // Update game message for mobile
    function updateGameMessage() {
        if (window.innerWidth <= 600) {
            if (!gameRunning) {
                gameMessage.innerHTML = 'Tap or use controls to start';
            } else {
                gameMessage.style.display = 'none';
            }
        } else {
            if (!gameRunning) {
                gameMessage.textContent = 'Press Arrow Keys to Start';
            } else {
                gameMessage.style.display = 'none';
            }
        }
    }
    
    // Call updateGameMessage on load and resize
    updateGameMessage();
    window.addEventListener('resize', updateGameMessage);
    
    // Game loop
    function gameLoop() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background grid (optional)
        drawGrid();
        
        // Update and draw game objects
        updateSnake();
        drawSnake();
        drawFood();
    }
}); 