document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const coin = document.getElementById('coin');
    const tossButton = document.getElementById('toss-btn');
    const headsButton = document.getElementById('heads-btn');
    const tailsButton = document.getElementById('tails-btn');
    const resetButton = document.getElementById('reset-btn');
    const resultMessage = document.getElementById('result-message');
    const correctCount = document.getElementById('correct-count');
    const totalCount = document.getElementById('total-count');
    const accuracyDisplay = document.getElementById('accuracy');
    const headsCount = document.getElementById('heads-count');
    const tailsCount = document.getElementById('tails-count');
    
    // Game state
    let stats = {
        correct: 0,
        total: 0,
        heads: 0,
        tails: 0
    };
    
    let currentGuess = null;
    let isAnimating = false;
    
    // Load stats from local storage if available
    loadStats();
    
    // Event listeners
    headsButton.addEventListener('click', () => {
        setGuess('heads');
    });
    
    tailsButton.addEventListener('click', () => {
        setGuess('tails');
    });
    
    tossButton.addEventListener('click', tossCoin);
    
    resetButton.addEventListener('click', resetStats);
    
    // Set user guess
    function setGuess(guess) {
        if (isAnimating) return;
        
        currentGuess = guess;
        
        // Update UI to show selected guess
        headsButton.style.opacity = guess === 'heads' ? 1 : 0.6;
        tailsButton.style.opacity = guess === 'tails' ? 1 : 0.6;
        
        resultMessage.textContent = `You guessed ${guess.toUpperCase()}. Now toss the coin!`;
    }
    
    // Toss the coin
    function tossCoin() {
        if (isAnimating) return;
        
        if (!currentGuess) {
            resultMessage.textContent = 'Please make a guess first!';
            return;
        }
        
        isAnimating = true;
        
        // Remove any existing animation classes
        coin.className = 'coin';
        
        // Force a reflow to reset the animation
        void coin.offsetWidth;
        
        // Randomly determine the result
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        
        // Add the appropriate animation class
        coin.classList.add(`animate-${result}`);
        
        // Update stats after animation ends
        setTimeout(() => {
            updateStats(result);
            isAnimating = false;
            currentGuess = null;
            
            // Reset button opacities
            headsButton.style.opacity = 1;
            tailsButton.style.opacity = 1;
        }, 3000);
    }
    
    // Update game stats
    function updateStats(result) {
        // Update counters
        stats.total++;
        
        if (result === 'heads') {
            stats.heads++;
        } else {
            stats.tails++;
        }
        
        // Check if guess was correct
        const isCorrect = currentGuess === result;
        
        if (isCorrect) {
            stats.correct++;
            resultMessage.textContent = `${result.toUpperCase()}! You guessed correctly!`;
            resultMessage.style.color = '#2ecc71';
        } else {
            resultMessage.textContent = `${result.toUpperCase()}! Better luck next time.`;
            resultMessage.style.color = '#e74c3c';
        }
        
        // Update displays
        updateDisplays();
        
        // Save stats to local storage
        saveStats();
    }
    
    // Update all stat displays
    function updateDisplays() {
        correctCount.textContent = stats.correct;
        totalCount.textContent = stats.total;
        headsCount.textContent = stats.heads;
        tailsCount.textContent = stats.tails;
        
        // Calculate and display accuracy
        const accuracy = stats.total === 0 ? 0 : Math.round((stats.correct / stats.total) * 100);
        accuracyDisplay.textContent = `${accuracy}%`;
    }
    
    // Reset all stats
    function resetStats() {
        stats = {
            correct: 0,
            total: 0,
            heads: 0,
            tails: 0
        };
        
        updateDisplays();
        saveStats();
        
        resultMessage.textContent = 'Stats reset. Make a new guess!';
        resultMessage.style.color = '#f1c40f';
    }
    
    // Save stats to local storage
    function saveStats() {
        localStorage.setItem('coinTossStats', JSON.stringify(stats));
    }
    
    // Load stats from local storage
    function loadStats() {
        const savedStats = localStorage.getItem('coinTossStats');
        
        if (savedStats) {
            stats = JSON.parse(savedStats);
            updateDisplays();
        }
    }
}); 