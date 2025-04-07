/**
 * Google AdSense integration for Game Collection
 * This script handles ad placements across the site
 */
document.addEventListener('DOMContentLoaded', () => {
    // Only run this if we're not in local development
    if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
        // Insert Google AdSense script
        const adScript = document.createElement('script');
        adScript.async = true;
        adScript.crossOrigin = 'anonymous';
        adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX';
        document.head.appendChild(adScript);
        
        // Create and insert ad containers based on the current page
        insertAdContainers();
    }
    
    // Function to insert ad containers at appropriate locations
    function insertAdContainers() {
        const currentPath = window.location.pathname;
        
        // Special handling for the main page (index)
        if (currentPath.includes('index.html') || currentPath.endsWith('/') || currentPath.split('/').pop() === '') {
            insertFooterAd();
            return;
        }
        
        // For game pages
        if (currentPath.includes('/games/')) {
            insertSidebarAd();
            insertBetweenGameStatsAd();
            insertFooterAd();
        }
    }
    
    // Insert ad in the sidebar (for game pages)
    function insertSidebarAd() {
        const gameContainer = document.querySelector('.game-container');
        if (!gameContainer) return;
        
        // Create sidebar ad container
        const sidebarAd = document.createElement('div');
        sidebarAd.className = 'ad-container sidebar-ad';
        sidebarAd.innerHTML = `
            <div class="ad-label">Advertisement</div>
            <ins class="adsbygoogle"
                style="display:block; width:160px; height:600px"
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                data-ad-slot="XXXXXXXXXX"></ins>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        `;
        
        // Insert after game container
        gameContainer.parentNode.insertBefore(sidebarAd, gameContainer.nextSibling);
    }
    
    // Insert ad between game stats (for game pages)
    function insertBetweenGameStatsAd() {
        // Different elements depending on the game
        const targetElements = [
            document.querySelector('.score-display'),
            document.querySelector('.stats'),
            document.querySelector('.game-controls')
        ];
        
        // Find the first valid element
        const targetElement = targetElements.find(el => el !== null);
        if (!targetElement) return;
        
        // Create between-content ad container
        const betweenAd = document.createElement('div');
        betweenAd.className = 'ad-container between-content-ad';
        betweenAd.innerHTML = `
            <div class="ad-label">Advertisement</div>
            <ins class="adsbygoogle"
                style="display:block; width:728px; height:90px"
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                data-ad-slot="XXXXXXXXXX"></ins>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        `;
        
        // Insert after target element
        targetElement.parentNode.insertBefore(betweenAd, targetElement.nextSibling);
    }
    
    // Insert ad in the footer (for all pages)
    function insertFooterAd() {
        const body = document.body;
        
        // Create footer ad container
        const footerAd = document.createElement('div');
        footerAd.className = 'ad-container footer-ad';
        footerAd.innerHTML = `
            <div class="ad-label">Advertisement</div>
            <ins class="adsbygoogle"
                style="display:block; width:728px; height:90px"
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                data-ad-slot="XXXXXXXXXX"></ins>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        `;
        
        // Append to body
        body.appendChild(footerAd);
    }
}); 