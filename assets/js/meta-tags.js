/**
 * Meta Tags Manager for Game Collection
 * Automatically inserts appropriate meta tags based on the current page
 */
document.addEventListener('DOMContentLoaded', () => {
    // Get current page from URL
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop().split('.')[0];
    
    // Default meta information
    let metaInfo = {
        title: 'JavaScript Game Collection - Classic Games Online',
        description: 'Play classic games online for free including Flappy Bird, Snake, Pong, Memory Cards, Tic Tac Toe, and Coin Toss. No downloads required!',
        keywords: 'javascript games, online games, free games, classic games, web games, browser games, tic tac toe',
        author: 'Game Collection Developer',
        ogImage: '../../assets/images/game-collection.jpg'
    };
    
    // Update meta information based on current page
    switch(pageName) {
        case 'index':
        case 'main':
            // Main page uses defaults
            break;
        case 'snake':
            metaInfo.title = 'Snake Game - JavaScript Game Collection';
            metaInfo.description = 'Play the classic Snake game online. Control a snake to eat food and grow longer without hitting walls or yourself. Free browser game, no download needed.';
            metaInfo.keywords = 'snake game, browser snake, javascript snake, online snake game, free snake game';
            metaInfo.ogImage = '../../assets/images/snake-game.jpg';
            break;
        case 'flappy-bird':
        case 'index':
            metaInfo.title = 'Flappy Bird Game - JavaScript Game Collection';
            metaInfo.description = 'Play Flappy Bird online. Navigate a bird through obstacles by tapping space or clicking. Free browser game, no download needed.';
            metaInfo.keywords = 'flappy bird, browser flappy bird, javascript flappy bird, online flappy bird, free flappy bird game';
            metaInfo.ogImage = '../../assets/images/flappy-bird-game.jpg';
            break;
        case 'pong':
            metaInfo.title = 'Pong Game - JavaScript Game Collection';
            metaInfo.description = 'Play the classic Pong arcade game online. Control a paddle to hit a ball past your opponent. Free browser game, no download needed.';
            metaInfo.keywords = 'pong game, browser pong, javascript pong, online pong game, free pong game, arcade pong';
            metaInfo.ogImage = '../../assets/images/pong-game.jpg';
            break;
        case 'memory':
            metaInfo.title = 'Memory Card Game - JavaScript Game Collection';
            metaInfo.description = 'Play Memory Card game online. Match pairs of cards and test your memory. Free browser game, no download needed.';
            metaInfo.keywords = 'memory game, card matching game, browser memory game, javascript memory game, free memory game';
            metaInfo.ogImage = '../../assets/images/memory-game.jpg';
            break;
        case 'coin-toss':
            metaInfo.title = 'Coin Toss Game - JavaScript Game Collection';
            metaInfo.description = 'Play Coin Toss game online. Test your luck by guessing heads or tails and see if you can beat the odds. Free browser game, no download needed.';
            metaInfo.keywords = 'coin toss, heads or tails, browser coin toss, javascript coin toss, luck game, probability game';
            metaInfo.ogImage = '../../assets/images/coin-toss-game.jpg';
            break;
        case 'tic-tac-toe':
            metaInfo.title = 'Tic Tac Toe Game - JavaScript Game Collection';
            metaInfo.description = 'Play Tic Tac Toe online against AI or with a friend. Classic board game with simple controls and strategy. Free browser game, no download needed.';
            metaInfo.keywords = 'tic tac toe, noughts and crosses, browser tic tac toe, javascript tic tac toe, free tic tac toe game, two player tic tac toe';
            metaInfo.ogImage = '../../assets/images/tic-tac-toe-game.jpg';
            break;
    }
    
    // Create and insert meta tags
    setMetaTags(metaInfo);
    
    // Function to set meta tags
    function setMetaTags(info) {
        // Set page title
        document.title = info.title;
        
        // Helper function to create or update meta tags
        function createOrUpdateMeta(name, content) {
            let meta = document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = name;
                document.head.appendChild(meta);
            }
            meta.content = content;
        }
        
        // Create or update meta tags
        createOrUpdateMeta('description', info.description);
        createOrUpdateMeta('keywords', info.keywords);
        createOrUpdateMeta('author', info.author);
        
        // Open Graph meta tags for social sharing
        function createOrUpdateOgMeta(property, content) {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.head.appendChild(meta);
            }
            meta.content = content;
        }
        
        createOrUpdateOgMeta('og:title', info.title);
        createOrUpdateOgMeta('og:description', info.description);
        createOrUpdateOgMeta('og:type', 'website');
        createOrUpdateOgMeta('og:url', window.location.href);
        createOrUpdateOgMeta('og:image', info.ogImage);
        
        // Twitter card meta tags
        createOrUpdateMeta('twitter:card', 'summary_large_image');
        createOrUpdateMeta('twitter:title', info.title);
        createOrUpdateMeta('twitter:description', info.description);
        createOrUpdateMeta('twitter:image', info.ogImage);
    }
}); 