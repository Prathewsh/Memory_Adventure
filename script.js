// Images for the memory cards
const allImages = [
  "./characters/mickey.png",
  "./characters/minnie.png",
  "./characters/donald.png",
  "./characters/goofy.png",
  "./characters/mickey.png",
  "./characters/simba.png",
  "./characters/snow.png",
  "./characters/beauty.png",
];

let firstCard = null;
let secondCard = null;
let lockBoard = true;
let matchedCount = 0;
let currentLevel = 1;

// Shuffle utility
function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

// Start the game level
function startGame() {
  const board = document.getElementById("game-board");
  board.innerHTML = "";
  firstCard = null;
  secondCard = null;
  matchedCount = 0;
  lockBoard = true;

  const levelPairs = currentLevel;
  if (levelPairs > allImages.length) {
    alert("🎉 You've completed all levels! Great job!");
    currentLevel = 1;
    return startGame();
  }

  const selectedImages = shuffle([...allImages]).slice(0, levelPairs);
  const cardsArray = shuffle([...selectedImages, ...selectedImages]);

  document.getElementById(
    "level-display"
  ).innerText = `Level ${currentLevel} - ${levelPairs} Pair${
    levelPairs > 1 ? "s" : ""
  }`;

  cardsArray.forEach((imgSrc) => {
    const col = document.createElement("div");
    col.className = "col-3 col-sm-2 card-container";

    const cardInner = document.createElement("div");
    cardInner.className = "card-inner";

    const cardFront = document.createElement("div");
    cardFront.className = "card-front";
    cardFront.textContent = "?";

    const cardBack = document.createElement("div");
    cardBack.className = "card-back";
    const image = document.createElement("img");
    image.src = imgSrc;
    cardBack.appendChild(image);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    col.appendChild(cardInner);

    // Store image source for matching
    col.dataset.img = imgSrc;

    col.addEventListener("click", () => handleCardClick(col));
    board.appendChild(col);

    // Initially flipped to show for 3 seconds
    col.classList.add("flipped");
  });

  // Show cards for 3 seconds, then flip them back
  setTimeout(() => {
    document.querySelectorAll(".card-container").forEach((card) => {
      card.classList.remove("flipped");
    });
    lockBoard = false;
  }, 3000);
}

function handleCardClick(card) {
  if (
    lockBoard ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  )
    return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  const isMatch = firstCard.dataset.img === secondCard.dataset.img;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedCount += 2;
    resetTurn();

    const totalCardsThisLevel = currentLevel * 2;
    if (matchedCount === totalCardsThisLevel) {
      setTimeout(() => {
        alert(`🌟 Well done! You finished Level ${currentLevel}`);
        currentLevel++;
        startGame();
      }, 500);
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function restartFromLevel1() {
  currentLevel = 1;
  startGame();
}

function openBook() {
  const cover = document.getElementById("book-cover");
  const storybook = document.getElementById("storybook-container");

  // Animate cover fading out
  cover.style.opacity = 0;
  setTimeout(() => {
    cover.classList.add("d-none");
    storybook.classList.remove("d-none");

    // Start with page rotated (90deg) and transparent
    storybook.style.transform = "rotateY(90deg)";
    storybook.style.opacity = "0";

    // Animate opening
    setTimeout(() => {
      storybook.classList.add("open");
      storybook.style.opacity = "1";
      storybook.style.transform = "rotateY(0deg)";
    }, 50);

    // Start the game
    startGame();
  }, 800);
}
