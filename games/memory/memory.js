document.addEventListener('DOMContentLoaded', () => {
    const memoryGame = document.querySelector('.memory-game');
    const startButton = document.getElementById('start-btn');
    const gameMessage = document.querySelector('.game-message');
    const movesCount = document.getElementById('moves-count');
    const timerElement = document.getElementById('timer');
    
    // Game variables
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let matchedPairs = 0;
    let totalPairs = 8;
    let timer;
    let seconds = 0;
    let minutes = 0;
    
    // Card emojis
    const emojis = [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'
    ];
    
    // Start a new game
    startButton.addEventListener('click', startGame);
    
    function startGame() {
        resetGame();
        createCards();
        shuffleCards();
        startTimer();
        gameMessage.style.display = 'none';
    }
    
    // Reset game state
    function resetGame() {
        memoryGame.innerHTML = '';
        cards = [];
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        moves = 0;
        matchedPairs = 0;
        movesCount.textContent = moves;
        clearInterval(timer);
        seconds = 0;
        minutes = 0;
        timerElement.textContent = '00:00';
    }
    
    // Create card elements
    function createCards() {
        for (let i = 0; i < emojis.length; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.emoji = emojis[i];
            
            // Create front of card (back facing)
            const front = document.createElement('div');
            front.classList.add('card-front');
            front.textContent = '?';
            
            // Create back of card (face)
            const back = document.createElement('div');
            back.classList.add('card-back');
            back.textContent = emojis[i];
            
            // Append front and back to card
            card.appendChild(front);
            card.appendChild(back);
            
            // Add event listener
            card.addEventListener('click', flipCard);
            
            // Add card to memory game
            memoryGame.appendChild(card);
            cards.push(card);
        }
    }
    
    // Shuffle cards using Fisher-Yates algorithm
    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i].style.order, cards[j].style.order] = [cards[j].style.order, cards[i].style.order];
        }
    }
    
    // Handle card flipping
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        
        this.classList.add('flipped');
        
        if (!hasFlippedCard) {
            // First card flipped
            hasFlippedCard = true;
            firstCard = this;
        } else {
            // Second card flipped
            secondCard = this;
            incrementMoves();
            checkForMatch();
        }
    }
    
    // Check if cards match
    function checkForMatch() {
        const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
        
        if (isMatch) {
            disableCards();
            matchedPairs++;
            checkForWin();
        } else {
            unflipCards();
        }
    }
    
    // Disable matched cards
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        resetBoard();
    }
    
    // Unflip unmatched cards
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }
    
    // Reset board for next selection
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    // Increment moves counter
    function incrementMoves() {
        moves++;
        movesCount.textContent = moves;
    }
    
    // Check if the game is won
    function checkForWin() {
        if (matchedPairs === totalPairs) {
            clearInterval(timer);
            setTimeout(() => {
                showWinMessage();
            }, 500);
        }
    }
    
    // Show win message
    function showWinMessage() {
        gameMessage.textContent = `Congratulations! You won in ${moves} moves and ${formatTime(minutes, seconds)}`;
        gameMessage.style.display = 'block';
    }
    
    // Start the game timer
    function startTimer() {
        clearInterval(timer);
        seconds = 0;
        minutes = 0;
        
        timer = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                minutes++;
                seconds = 0;
            }
            timerElement.textContent = formatTime(minutes, seconds);
        }, 1000);
    }
    
    // Format time for display
    function formatTime(minutes, seconds) {
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}); 