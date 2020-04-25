var emojis = [
  "🐶",
  "🐱",
  "🐱",
  "🐹",
  "🐰",
  "🐹",
  "🐰",
  "🐨",
  "🐨",
  "🐮",
  "🐮",
  "🐶",
];

class Timer {
  constructor(startingTimeInMinute, elementId) {
    this.time = 60 * startingTimeInMinute;
    this.id = elementId;
    this.updateTimer = this.updateTimer.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }

  updateTimer() {
    if (this.time > 0) {
      this.time--;
      console.log(this.time);
      this.displayTimer();
    } else {
      clearInterval(this.timerIntervalId);
      toggleModal(".lost");
    }
  }

  startTimer() {
    this.updateTimer();
    this.timerIntervalId = setInterval(this.updateTimer, 1000);
  }

  displayTimer() {
    const minutes = Math.floor(this.time / 60);
    let seconds = this.time % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    const countdown = document.getElementById(this.id);
    countdown.innerHTML = `${minutes}:${seconds}`;
  }
}

class Card {
  constructor(id, emoji) {
    this.id = id;
    this.emoji = emoji;
    this.isFlipped = false;
    this.isFound = false;
    this.isLost = false;
  }

  addToGame() {
    const game = document.querySelector("#game");

    const flipCard = document.createElement("div");
    flipCard.className = "flip-card";

    flipCard.innerHTML = `
      <div id=${this.id} class="flip-card-inner">
        <div class="flip-card-front">${this.emoji}</div>
        <div class="flip-card-back"></div>
      </div>
    `;
    game.appendChild(flipCard);
  }

  updateCard() {
    const card = document.getElementById(this.id);
    card.classList.toggle("is-flipped", this.isFlipped);
    setTimeout(
      () =>
        card
          .querySelector(".flip-card-front")
          .classList.toggle("is-found", this.isFound),
      600
    );
    setTimeout(
      () =>
        card
          .querySelector(".flip-card-front")
          .classList.toggle("is-lost", this.isLost),
      600
    );
  }
}

class Game {
  constructor() {
    this.gameSize = 12;
    this.counter = 0;
    this.foundCounter = 0;
    this.cards = this.createCards();
    //Id de la carte retounée au tour précédent
    this.prevId;
    this.timer = new Timer(1, "counter");
  }

  //Création du jeu de carte
  createCards() {
    const cards = [];
    shuffle(emojis).forEach((e, index) => cards.push(new Card(index, e)));
    return cards;
  }

  displayCards() {
    const game = document.querySelector("#game");
    game.innerHTML = "";
    this.cards.forEach((c) => c.addToGame());
  }

  updateCardsDisplay() {
    this.cards.forEach((c) => c.updateCard());
  }

  updateGame(id) {
    //Declenchement du timer au premier click sur une carte
    if (this.counter === 0) {
      this.timer.startTimer();
    }
    this.counter++;
    if (this.counter % 2 === 1) {
      //On cache les cartes rouges retounées au cours des deux tours précédents
      this.cards.forEach((c) => {
        if (c.isFlipped && c.isLost) {
          c.isFlipped = !c.isFlipped;
          c.isLost = !c.isLost;
        }
      });
      game.cards[id].isFlipped = true;
    } else {
      //On retourne la carte sur laquelle on a cliqué
      game.cards[id].isFlipped = true;
      //Si la carte retounée correspond à la carte retournée au tour précédent elles passent toutes les deux en vert
      if (this.cards[this.prevId].emoji === this.cards[id].emoji) {
        this.cards[this.prevId].isFound = true;
        this.cards[id].isFound = true;
        this.foundCounter++;
        console.log(this.foundCounter);
        //Gestion du cas ou toutes la partie est gagnée
        if (2 * this.foundCounter === this.gameSize) {
          clearInterval(this.timer.timerIntervalId);
          toggleModal(".win");
        }
      }
      //Si la carte retounée ne correspond à la carte retournée au tour précédent elles passent toutes les deux en rouge
      else {
        this.cards[this.prevId].isLost = true;
        this.cards[id].isLost = true;
      }
    }
    this.prevId = id;
  }
}
//Regarder comment fonctionne les scopes à cet endroit
//Est-ce que onload fonctionne bien comme un closure avec la variable board?
var game;
function onload() {
  game = new Game();
  game.displayCards();
  game.timer.displayTimer();
}

function onClick(event) {
  const id = event.target.parentNode.id;
  //An event is triggered only for non flipped and not found cards
  if (!game.cards[id].isFlipped) {
    game.updateGame(id);
    game.updateCardsDisplay();
  }
}

function toggleModal(name) {
  const modal = document.querySelector(name);
  modal.classList.toggle("none");
  modal.classList.toggle("flex");
}

function resetGame() {
  toggleModal(".flex");
  onload();
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

// Event: Display Cards
document.addEventListener("DOMContentLoaded", onload());

var domGame = document.querySelector("#game");
domGame.addEventListener("click", onClick);
