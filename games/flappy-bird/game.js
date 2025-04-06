document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const gameMessage = document.querySelector('.game-message');
    const currentScoreElement = document.getElementById('current-score');
    const highScoreElement = document.getElementById('high-score');
    
    // Set canvas dimensions
    canvas.width = 320;
    canvas.height = 480;
    
    // Game variables
    let gameRunning = false;
    let score = 0;
    let highScore = localStorage.getItem('flappyHighScore') || 0;
    let frames = 0;
    
    // Bird properties
    const bird = {
        x: 50,
        y: canvas.height / 2,
        width: 34,
        height: 24,
        gravity: 0.5,
        velocity: 0,
        jump: -8,
        
        draw: function() {
            // Drawing a simple bird
            ctx.fillStyle = '#FFD700'; // Yellow
            ctx.beginPath();
            ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
            ctx.fill();
            
            // Eye
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.x + 8, this.y - 5, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Beak
            ctx.fillStyle = '#FF6600';
            ctx.beginPath();
            ctx.moveTo(this.x + 15, this.y);
            ctx.lineTo(this.x + 25, this.y);
            ctx.lineTo(this.x + 15, this.y + 5);
            ctx.closePath();
            ctx.fill();
            
            // Wing
            ctx.fillStyle = '#E6BE00';
            ctx.beginPath();
            ctx.ellipse(this.x - 5, this.y + 5, 10, 6, 0, 0, Math.PI * 2);
            ctx.fill();
        },
        
        update: function() {
            if (gameRunning) {
                this.velocity += this.gravity;
                this.y += this.velocity;
                
                // Ground collision
                if (this.y + this.height/2 >= canvas.height - foreground.height) {
                    this.y = canvas.height - foreground.height - this.height/2;
                    gameOver();
                }
                
                // Ceiling collision
                if (this.y - this.height/2 <= 0) {
                    this.y = this.height/2;
                    this.velocity = 0;
                }
            }
        },
        
        flap: function() {
            this.velocity = this.jump;
        }
    };
    
    // Pipes properties
    const pipes = {
        position: [],
        gap: 120,
        minHeight: 50,
        maxHeight: 300,
        width: 52,
        
        draw: function() {
            for (let i = 0; i < this.position.length; i++) {
                const p = this.position[i];
                
                // Top pipe
                ctx.fillStyle = '#75C147';
                ctx.fillRect(p.x, 0, this.width, p.topHeight);
                
                // Pipe cap (top)
                ctx.fillStyle = '#558B34';
                ctx.fillRect(p.x - 2, p.topHeight - 10, this.width + 4, 10);
                
                // Bottom pipe
                ctx.fillStyle = '#75C147';
                ctx.fillRect(p.x, p.topHeight + this.gap, this.width, canvas.height - p.topHeight - this.gap - foreground.height);
                
                // Pipe cap (bottom)
                ctx.fillStyle = '#558B34';
                ctx.fillRect(p.x - 2, p.topHeight + this.gap, this.width + 4, 10);
            }
        },
        
        update: function() {
            if (gameRunning) {
                if (frames % 100 === 0) {
                    const topHeight = Math.floor(Math.random() * (this.maxHeight - this.minHeight + 1)) + this.minHeight;
                    this.position.push({
                        x: canvas.width,
                        topHeight: topHeight,
                        passed: false
                    });
                }
                
                for (let i = 0; i < this.position.length; i++) {
                    const p = this.position[i];
                    p.x -= 2;
                    
                    // Check if bird passed the pipe
                    if (!p.passed && p.x + this.width < bird.x) {
                        p.passed = true;
                        score++;
                        currentScoreElement.textContent = score;
                    }
                    
                    // Check for collision
                    if (
                        bird.x + bird.width/2 > p.x && 
                        bird.x - bird.width/2 < p.x + this.width && 
                        (bird.y - bird.height/2 < p.topHeight || 
                         bird.y + bird.height/2 > p.topHeight + this.gap)
                    ) {
                        gameOver();
                    }
                }
                
                // Remove pipes that are off-screen
                if (this.position.length > 0 && this.position[0].x < -this.width) {
                    this.position.shift();
                }
            }
        }
    };
    
    // Foreground/Ground
    const foreground = {
        height: 80,
        
        draw: function() {
            ctx.fillStyle = '#DED895';
            ctx.fillRect(0, canvas.height - this.height, canvas.width, this.height);
            
            // Add some details to the ground
            ctx.fillStyle = '#C0B47C';
            for (let i = 0; i < canvas.width; i += 20) {
                ctx.fillRect(i, canvas.height - this.height, 10, 10);
            }
        }
    };
    
    // Background
    const background = {
        draw: function() {
            // Sky
            ctx.fillStyle = '#4EC0CA';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Clouds
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.beginPath();
            ctx.arc(80, 80, 25, 0, Math.PI * 2);
            ctx.arc(100, 70, 20, 0, Math.PI * 2);
            ctx.arc(60, 70, 20, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(220, 50, 20, 0, Math.PI * 2);
            ctx.arc(240, 45, 15, 0, Math.PI * 2);
            ctx.arc(200, 45, 15, 0, Math.PI * 2);
            ctx.fill();
        }
    };
    
    // Game functions
    function startGame() {
        if (!gameRunning) {
            gameRunning = true;
            bird.velocity = 0;
            bird.y = canvas.height / 2;
            pipes.position = [];
            score = 0;
            currentScoreElement.textContent = score;
            gameMessage.style.display = 'none';
            frames = 0;
        }
    }
    
    function gameOver() {
        gameRunning = false;
        gameMessage.textContent = 'Game Over! Press Space to Restart';
        gameMessage.style.display = 'block';
        
        // Update high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('flappyHighScore', highScore);
            highScoreElement.textContent = highScore;
        }
    }
    
    // Input handling
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            if (!gameRunning) {
                startGame();
            }
            bird.flap();
        }
    });
    
    canvas.addEventListener('click', function() {
        if (!gameRunning) {
            startGame();
        }
        bird.flap();
    });
    
    // Initialize high score display
    highScoreElement.textContent = highScore;
    
    // Game loop
    function gameLoop() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        background.draw();
        
        // Update and draw pipes
        pipes.update();
        pipes.draw();
        
        // Update and draw bird
        bird.update();
        bird.draw();
        
        // Draw foreground
        foreground.draw();
        
        // Increase frame count
        frames++;
        
        // Continue the game loop
        requestAnimationFrame(gameLoop);
    }
    
    // Start the game loop
    gameLoop();
}); 