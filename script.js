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
    this.counter = 0;
    this.cards = this.createCards();
    this.prevId;
  }
  //Création du jeu de carte
  createCards() {
    const cards = [];
    //RANDOMIZATION TO BE ADDED
    emojis.forEach((e, index) => cards.push(new Card(index, e)));
    return cards;
  }

  displayCards() {
    this.cards.forEach((c) => c.addToGame());
  }

  updateCardsDisplay() {
    this.cards.forEach((c) => c.updateCard());
  }

  updateGame(id) {
    this.counter++;
    if (this.counter % 2 === 1) {
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
      //Si les cartes correspondent
      if (this.cards[this.prevId].emoji === this.cards[id].emoji) {
        this.cards[this.prevId].isFound = true;
        this.cards[id].isFound = true;
      }
      //Si les cartes ne corrspondent pas
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
}

function onClick(event) {
  const id = event.target.parentNode.id;
  //An event is triggered only for non flipped and non found cards
  if (!game.cards[id].isFlipped) {
    game.updateGame(id);
    game.updateCardsDisplay();
  }
}

// Event: Display Cards
document.addEventListener("DOMContentLoaded", onload());

var domGame = document.querySelector("#game");
domGame.addEventListener("click", onClick);
