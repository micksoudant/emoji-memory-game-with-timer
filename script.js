'use strict';

const emojis = ['😀', '🥳', '🤩', '😎', '🐶', '🍕', '🎉', '🌟'];
const gameBoard = document.getElementById('game-board');
const timerDisplay = document.querySelector('#timer span');
const restartBtn = document.getElementById('restart-btn');
const victoryModal = document.getElementById('victory-modal');
const gameOverModal = document.getElementById('game-over-modal');
const victoryRestartBtn = document.getElementById('victory-restart-btn');
const gameOverRestartBtn = document.getElementById('gameover-restart-btn');
const statusAnnouncer = document.getElementById('status-announcer');

let cards = [];
let firstCard = null;
let secondCard = null;
let hasFlippedCard = false;
let lockBoard = false;
let matchedPairs = 0;
let timeLeft = 60; // Initial time in seconds
let timerInterval = null;
let gameStarted = false;

// Confetti function from Analyst's research
function triggerVictoryConfetti() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

// Shuffle array function (Fisher-Yates)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateCards() {
    gameBoard.innerHTML = ''; // Clear existing cards
    const gameEmojis = [...emojis, ...emojis]; // Duplicate emojis for pairs
    const shuffledEmojis = shuffle(gameEmojis);
    cards = []; // Clear cards array for a new game
    matchedPairs = 0; // Reset matched pairs
    gameStarted = false; // Reset game started flag

    shuffledEmojis.forEach((emoji, index) => {
        const card = document.createElement('button');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.dataset.index = index; // Store original index for accessibility label
        card.setAttribute('aria-label', `Card ${index + 1}, face down`);
        card.setAttribute('role', 'gridcell');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');
        cardFront.textContent = emoji;

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');
        // You can add a default back content if desired, e.g., a question mark or logo

        card.appendChild(cardFront);
        card.appendChild(cardBack);
        gameBoard.appendChild(card);
        cards.push(card); // Store card elements for later access
    });
    addCardEventListeners();
}

function addCardEventListeners() {
    cards.forEach(card => card.addEventListener('click', flipCard));
}

// Initial game setup
generateCards();
