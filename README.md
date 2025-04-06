# Game Collection

A simple collection of classic games implemented using JavaScript, HTML5 Canvas, and CSS.

## Getting Started

1. Open `index.html` in a web browser to access the game selection screen.
2. Click on any game card to start playing that game.
3. Use the "Back to Menu" button in each game to return to the selection screen.

## Games Available

### Flappy Bird

A simple implementation of the classic Flappy Bird game.

#### How to Play

1. Navigate the bird through the gaps between the pipes.
2. Press the Space key or click on the game area to make the bird flap its wings and fly upward.
3. Each pipe you pass gives you 1 point.
4. The game ends if the bird hits the ground, ceiling, or any pipe.
5. Your high score will be saved in your browser's local storage.

#### Controls

- **Space key** or **Click**: Make the bird flap and fly upward
- **Space key** or **Click** after game over: Restart the game

### Snake

A classic Snake game where you control a snake to eat food and grow longer.

#### How to Play

1. Use the arrow keys to control the direction of the snake.
2. Eat the red food items to grow longer and earn points.
3. Avoid hitting the walls or colliding with your own body.
4. The game gets faster as your score increases.
5. Your high score will be saved in your browser's local storage.

#### Controls

- **Arrow keys**: Change the direction of the snake
- **Arrow keys** after game over: Restart the game

### Pong

The classic arcade game Pong where you control a paddle to hit a ball past your opponent.

#### How to Play

1. Use the W/S or Up/Down arrow keys to move your paddle up and down.
2. The ball will bounce off paddles and the top/bottom walls.
3. If the ball passes your paddle, the AI opponent scores a point.
4. If the ball passes the AI's paddle, you score a point.
5. The angle of the ball changes based on where it hits the paddle.

#### Controls

- **W/Up Arrow**: Move paddle up
- **S/Down Arrow**: Move paddle down
- **Space key**: Start the game

### Memory Cards

A memory matching game where you need to find all the matching pairs of cards.

#### How to Play

1. Click the "Start New Game" button to begin.
2. Click on cards to flip them over and reveal their emoji.
3. Try to find matching pairs of emoji cards.
4. When you click two cards that match, they will remain face up.
5. If they don't match, both cards will flip back over.
6. The game ends when you've matched all pairs.
7. Try to complete the game in the fewest moves and shortest time.

#### Controls

- **Click**: Flip a card
- **Start New Game button**: Reset and start a new game

### Coin Toss

A simple game of chance where you guess the outcome of a coin toss.

#### How to Play

1. Choose your guess by clicking either the "Heads" or "Tails" button.
2. Click the "Toss Coin" button to flip the coin.
3. If your guess matches the result, you win and your score increases.
4. The game keeps track of your accuracy, total tosses, and the number of heads and tails.
5. Your stats are saved in your browser's local storage.

#### Controls

- **Heads/Tails buttons**: Select your guess
- **Toss Coin button**: Flip the coin
- **Reset Score button**: Reset all statistics

### Tic Tac Toe

The classic game of X's and O's where you try to get three marks in a row.

#### How to Play

1. Click on a cell to place your X or O mark.
2. Players take turns placing their marks on the 3x3 grid.
3. The first player to get three of their marks in a row (horizontally, vertically, or diagonally) wins.
4. If all cells are filled and no one has won, the game is a draw.
5. You can play against another player or against the AI with different difficulty levels.
6. Your score is saved in your browser's local storage.

#### Controls

- **Click**: Place your mark on the grid
- **New Game button**: Start a new game with the current settings
- **Reset Score button**: Reset all statistics
- **Game Mode toggle**: Switch between playing against a friend or the AI
- **Difficulty selector**: Choose the AI difficulty (Easy, Medium, Hard)
- **First Move selector**: Choose who makes the first move (X, O, or Random)

## Features

- Simple and intuitive gameplay
- Score tracking
- High score saving using local storage
- Responsive design
- Game selection landing page

## Technologies Used

- HTML5
- CSS3
- JavaScript
- HTML5 Canvas API

## Project Structure

```
game/
│
├── index.html              # Main landing page
│
├── assets/                # Shared assets
│   ├── css/               # Shared CSS files
│   │   └── main.css       # Styles for main landing page
│   │   └── ads.css        # Styles for advertisements
│   │   └── responsive.css # Responsive design styles
│   │
│   ├── js/                # Shared JavaScript files
│   │   └── meta-tags.js   # SEO meta tag management
│   │   └── adsense.js     # AdSense integration
│   │   └── mobile-support.js # Mobile support functionality
│   │
│   └── images/            # Shared image assets
│
├── sitemap.xml            # Site map for search engines
├── robots.txt             # Search engine crawler instructions
├── privacy-policy.html    # Privacy policy required for AdSense
│
└── games/                 # Individual games
    ├── flappy-bird/       # Flappy Bird game files
    │   ├── index.html     # Game HTML file
    │   ├── style.css      # Game CSS file
    │   └── game.js        # Game JavaScript file
    │
    ├── snake/             # Snake game files
    │   ├── snake.html     # Game HTML file
    │   ├── snake.css      # Game CSS file
    │   └── snake.js       # Game JavaScript file
    │
    ├── pong/              # Pong game files
    │   ├── pong.html      # Game HTML file
    │   ├── pong.css       # Game CSS file
    │   └── pong.js        # Game JavaScript file
    │
    ├── memory/            # Memory Card game files
    │   ├── memory.html    # Game HTML file
    │   ├── memory.css     # Game CSS file
    │   └── memory.js      # Game JavaScript file
    │
    ├── coin-toss/         # Coin Toss game files
    │   ├── coin-toss.html # Game HTML file
    │   ├── coin-toss.css  # Game CSS file
    │   └── coin-toss.js   # Game JavaScript file
    │
    └── tic-tac-toe/       # Tic Tac Toe game files
        ├── tic-tac-toe.html  # Game HTML file
        ├── tic-tac-toe.css   # Game CSS file
        └── tic-tac-toe.js    # Game JavaScript file
``` 