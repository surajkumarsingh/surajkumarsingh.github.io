document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pong-canvas');
    const ctx = canvas.getContext('2d');
    const gameMessage = document.querySelector('.game-message');
    const playerScoreElement = document.getElementById('player-score');
    const aiScoreElement = document.getElementById('ai-score');
    
    // Set canvas dimensions
    canvas.width = 600;
    canvas.height = 400;
    
    // Game variables
    let gameRunning = false;
    let playerScore = 0;
    let aiScore = 0;
    let lastTime = 0;
    
    // Paddle properties
    const paddleWidth = 10;
    const paddleHeight = 80;
    const paddleSpeed = 8;
    
    // Player paddle
    const playerPaddle = {
        x: 20,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        dy: 0,
        
        draw: function() {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        },
        
        update: function() {
            // Update position
            this.y += this.dy;
            
            // Keep paddle within canvas
            if (this.y < 0) {
                this.y = 0;
            } else if (this.y + this.height > canvas.height) {
                this.y = canvas.height - this.height;
            }
        }
    };
    
    // AI paddle
    const aiPaddle = {
        x: canvas.width - paddleWidth - 20,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        speed: 4,  // AI paddle speed (slightly slower than player)
        
        draw: function() {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        },
        
        update: function() {
            // Simple AI - follow the ball
            const paddleCenter = this.y + this.height / 2;
            const ballCenter = ball.y + ball.size / 2;
            
            // Add some difficulty by making AI not perfect
            if (Math.abs(paddleCenter - ballCenter) > this.height / 4) {
                if (paddleCenter < ballCenter) {
                    this.y += this.speed;
                } else {
                    this.y -= this.speed;
                }
            }
            
            // Keep paddle within canvas
            if (this.y < 0) {
                this.y = 0;
            } else if (this.y + this.height > canvas.height) {
                this.y = canvas.height - this.height;
            }
        }
    };
    
    // Ball properties
    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 10,
        speed: 5,
        dx: 5,
        dy: 5,
        
        draw: function() {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        },
        
        update: function() {
            if (!gameRunning) return;
            
            // Update position
            this.x += this.dx;
            this.y += this.dy;
            
            // Ball collision with top and bottom walls
            if (this.y - this.size < 0 || this.y + this.size > canvas.height) {
                this.dy *= -1;
            }
            
            // Ball collision with paddles
            // Player paddle
            if (
                this.x - this.size < playerPaddle.x + playerPaddle.width &&
                this.y > playerPaddle.y &&
                this.y < playerPaddle.y + playerPaddle.height
            ) {
                this.dx *= -1;
                this.x = playerPaddle.x + playerPaddle.width + this.size;
                
                // Calculate new angle based on where the ball hits the paddle
                const hitPosition = (this.y - playerPaddle.y) / playerPaddle.height;
                this.dy = 10 * (hitPosition - 0.5);
            }
            
            // AI paddle
            if (
                this.x + this.size > aiPaddle.x &&
                this.y > aiPaddle.y &&
                this.y < aiPaddle.y + aiPaddle.height
            ) {
                this.dx *= -1;
                this.x = aiPaddle.x - this.size;
                
                // Calculate new angle based on where the ball hits the paddle
                const hitPosition = (this.y - aiPaddle.y) / aiPaddle.height;
                this.dy = 10 * (hitPosition - 0.5);
            }
            
            // Ball goes out of bounds
            if (this.x < 0) {
                // AI scores
                aiScore++;
                aiScoreElement.textContent = aiScore;
                resetBall();
            } else if (this.x > canvas.width) {
                // Player scores
                playerScore++;
                playerScoreElement.textContent = playerScore;
                resetBall();
            }
        }
    };
    
    // Draw the center line
    function drawCenterLine() {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.setLineDash([10, 15]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Reset ball position
    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        
        // Randomize direction
        ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
        ball.dy = (Math.random() * 2 - 1) * (ball.speed / 2);
    }
    
    // Game functions
    function startGame() {
        if (!gameRunning) {
            gameRunning = true;
            playerScore = 0;
            aiScore = 0;
            playerScoreElement.textContent = playerScore;
            aiScoreElement.textContent = aiScore;
            resetBall();
            gameMessage.style.display = 'none';
        }
    }
    
    // Input handling
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            if (!gameRunning) {
                startGame();
            }
        }
        
        // W, S, Up, Down keys for paddle movement
        if (e.code === 'KeyW' || e.code === 'ArrowUp') {
            playerPaddle.dy = -paddleSpeed;
        } else if (e.code === 'KeyS' || e.code === 'ArrowDown') {
            playerPaddle.dy = paddleSpeed;
        }
    });
    
    document.addEventListener('keyup', function(e) {
        // Stop paddle movement when keys are released
        if (
            (e.code === 'KeyW' || e.code === 'ArrowUp') && playerPaddle.dy < 0 ||
            (e.code === 'KeyS' || e.code === 'ArrowDown') && playerPaddle.dy > 0
        ) {
            playerPaddle.dy = 0;
        }
    });
    
    // Game loop with timestamp
    function gameLoop(timestamp) {
        // Calculate delta time
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw center line
        drawCenterLine();
        
        // Update and draw game objects
        playerPaddle.update();
        aiPaddle.update();
        ball.update();
        
        playerPaddle.draw();
        aiPaddle.draw();
        ball.draw();
        
        requestAnimationFrame(gameLoop);
    }
    
    // Start the game loop
    requestAnimationFrame(gameLoop);
}); 