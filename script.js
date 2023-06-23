const colors = [
  'red', 'red',
  'blue', 'blue',
  'green', 'green',
  'yellow', 'yellow',
  'purple', 'purple',
  'pink', 'pink',
  'orange', 'orange',
  'brown', 'brown',
  'black', 'black',
  'cyan', 'cyan'
];

let cards = [];
let openedCards = [];
let matchedCards = [];
let score = 0;
let gameStarted = false;

function startGame() {
  gameStarted = true;
  cards = createCards();
  renderGameBoard(cards);
  addCardClickEvent();
  resetScore();
}

function resetGame() {
  gameStarted = false;
  cards = [];
  openedCards = [];
  matchedCards = [];
  score = 0;
  clearGameBoard();
  resetScore();
}

function createCards() {
  const shuffledColors = shuffleArray(colors);
  const cards = [];

  for (let i = 0; i < shuffledColors.length; i++) {
    const card = {
      id: i,
      color: shuffledColors[i],
      isMatched: false,
      isFlipped: false
    };
    cards.push(card);
  }

  return cards;
}

function shuffleArray(array) {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function renderGameBoard(cards) {
  const gameBoard = document.getElementById('game-board');
  clearGameBoard();

  for (let i = 0; i < cards.length; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-id', cards[i].id);

    const front = document.createElement('div');
    front.className = 'side front';

    const back = document.createElement('div');
    back.className = 'side back';
    back.style.backgroundColor = cards[i].color;

    card.appendChild(front);
    card.appendChild(back);
    gameBoard.appendChild(card);
  }
}

function clearGameBoard() {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';
}

function addCardClickEvent() {
  const cards = document.getElementsByClassName('card');
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', handleCardClick);
  }
}

function handleCardClick() {
  if (!gameStarted) return;

  const cardId = this.getAttribute('data-id');
  const card = cards.find(c => c.id == cardId);

  if (card.isMatched || card.isFlipped || openedCards.length === 2) return;

  flipCard(card);

  openedCards.push(card);

  if (openedCards.length === 2) {
    setTimeout(checkMatch, 1000);
  }
}

function flipCard(card) {
  const cardElement = document.querySelector(`[data-id="${card.id}"]`);
  cardElement.classList.add('flipped');
  card.isFlipped = true;

  const frontSide = cardElement.querySelector('.front');
  frontSide.style.backgroundColor = card.color;
}

function unflipCards() {
  for (let i = 0; i < openedCards.length; i++) {
    const cardElement = document.querySelector(`[data-id="${openedCards[i].id}"]`);
    cardElement.classList.remove('flipped');
    openedCards[i].isFlipped = false;

    const frontSide = cardElement.querySelector('.front');
    frontSide.style.backgroundColor = '';
  }
  openedCards = [];
}

function checkMatch() {
  if (openedCards[0].color === openedCards[1].color) {
    matchCards();
  } else {
    unflipCards();
  }
}

function matchCards() {
  for (let i = 0; i < openedCards.length; i++) {
    const cardElement = document.querySelector(`[data-id="${openedCards[i].id}"]`);
    cardElement.classList.add('matched');
    openedCards[i].isMatched = true;
    matchedCards.push(openedCards[i]);
  }
  openedCards = [];
  increaseScore();
  if (matchedCards.length === cards.length) {
    endGame();
  }
}

function increaseScore() {
  score += 1;
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = `Score: ${score}`;
}

function resetScore() {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = 'Score: 0';
}

function endGame() {
  gameStarted = false;
  setTimeout(resetGame, 3000);
}

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('reset-btn').addEventListener('click', resetGame);
