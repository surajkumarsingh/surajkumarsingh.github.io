/**
 * Mobile Support JS for Game Collection
 * This script handles common mobile functionality and device detection
 */

// Prevent overscroll/bounce effects on mobile
document.addEventListener('touchmove', function(e) {
    if (e.target.closest('.game-container') && !e.target.closest('.scrollable')) {
        e.preventDefault();
    }
}, { passive: false });

// Handle orientation changes
window.addEventListener('orientationchange', function() {
    // Add slight delay to allow orientation to complete
    setTimeout(function() {
        // Force refresh of the page if we're in a game
        if (document.querySelector('.game-container')) {
            // Calculate new dimensions only if needed
            if (typeof updateGameDimensions === 'function') {
                updateGameDimensions();
            }
        }
    }, 200);
});

// Detect mobile device
function isMobileDevice() {
    return (window.innerWidth <= 768 || 
            navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
            navigator.userAgent.match(/Opera Mini/i) ||
            navigator.userAgent.match(/IEMobile/i));
}

// Add mobile class to body if on mobile device
if (isMobileDevice()) {
    document.body.classList.add('mobile-device');
}

// Disable context menu on game elements to improve mobile experience
document.addEventListener('contextmenu', function(e) {
    if (e.target.closest('.game-container')) {
        e.preventDefault();
    }
});

// Fullscreen API support for games
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        // Enter fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { // Firefox
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
            document.documentElement.msRequestFullscreen();
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// Create fullscreen button for mobile devices if supported
if (isMobileDevice() && document.documentElement.requestFullscreen) {
    document.addEventListener('DOMContentLoaded', function() {
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            const fsButton = document.createElement('button');
            fsButton.id = 'fullscreen-btn';
            fsButton.innerHTML = '⛶';
            fsButton.title = 'Toggle Fullscreen';
            fsButton.classList.add('fullscreen-button');
            fsButton.addEventListener('click', toggleFullScreen);
            
            gameContainer.appendChild(fsButton);
            
            // Add CSS for the button
            const style = document.createElement('style');
            style.textContent = `
                .fullscreen-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    z-index: 9999;
                    background: rgba(0,0,0,0.5);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    padding: 0;
                }
                .fullscreen-button:active {
                    background: rgba(0,0,0,0.7);
                }
            `;
            document.head.appendChild(style);
        }
    });
} 