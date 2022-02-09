class BlackJackGame {
  constructor() {
    this.cards = []; // array that holds the objects that represent cards
    this.playerCards = []; // The players hand throughout the game
    this.dealerCards = []; // the delears hand after player stays or busts
    this.dealerTotal = 0;
    this.playerTotal = 0;

    // Used to test out a sequence of cards to find bugs.
    this.testIndex = 0;
    this.testDeck = [
      {
        type: '10',
        value: 10,
        suit: 'S',
        name: 'S10',
      },
    ];

    this.createDeck();
  }

  // Creates a array[52] of objects that represent cards
  createDeck() {
    this.cards = [];
    const suits = ['H', 'C', 'D', 'S'];
    const types = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    for (const suit of suits) {
      for (const type of types) {
        this.cards.push(this.createCard(suit, type));
      }
    }
  }

  // Helper function when creating the initial deck.
  createCard(suit, type) {
    let value = 0;
    if (type == 'J' || type == 'Q' || type == 'K') {
      value = 10;
    } else if (type == 'A') {
      value = 11;
    } else {
      value = parseInt(type);
    }

    return {
      type,
      value,
      suit,
      name: suit + type,
    };
  }

  // reinitialize the game state, change some html text and reveal the buttons needed to play
  startGame() {
    this.playerCards = [];
    this.dealerCards = [];
    this.dealerTotal = 0;
    this.playerTotal = 0;

    this.createDeck();

    document.getElementById('dealerCards').setAttribute('hidden', 'true');
    document.getElementById('dealerTotal').setAttribute('hidden', 'true');

    document.getElementById('comment').innerHTML = 'Good Luck!';

    document.getElementById('stayButton').removeAttribute('hidden');

    document.getElementById('dealButton').innerHTML = 'Hit!';
    document.getElementById('dealButton').setAttribute('onclick', 'game.dealCard()');

    this.dealCard();
  }

  // adds a card to the players hand and then checks whether or not they bust.
  dealCard() {
    this.addPlayerCard();

    let cards = '';
    let sum = 0;
    for (const card of this.playerCards) {
      cards += card.name;
      cards += ', ';
    }

    document.getElementById('playerCards').innerHTML = 'Cards: ' + cards;
    document.getElementById('playerTotal').innerHTML = 'Total: ' + this.playerTotal;

    this.checkWin();
  }

  // Add a card to the playersCards[] by removing a card from the main cards[] deck and pushing it into the playersCards[]. Adjust the playerTotal upon card add.
  addPlayerCard() {
    const randIndex = Math.floor(Math.random() * this.cards.length);
    const card = this.cards.splice(randIndex, 1)[0];

    // const card = this.testDeck[this.testIndex];
    // this.testIndex++;
    // console.log(card.name);

    this.playerCards.push(card);
    this.playerTotal += card.value;
  }

  // Determine whether the player busts or potentially wins. If they bust, the game will ask to restart. if they are at 21, the dealer will then deal to see if they both get 21 for a draw,
  // else if they are still in the game, it will ask if they want to Stay and deal to the dealer, or hit to add another card continue.
  checkWin() {
    if (this.playerTotal > 21) {
      // Check for aces
      for (const card of this.playerCards) {
        if (card.value == 11) {
          // recheck playerTotal. it might have been modified in a previous loop iteration
          if (this.playerTotal > 21) {
            card.value = 1;
            this.playerTotal -= 10;
          }
          document.getElementById('playerTotal').innerHTML = 'Total: ' + this.playerTotal;
        }
      }

      // Player still bust after adjusting the Aces
      if (this.playerTotal > 21) {
        document.getElementById('comment').innerHTML = 'Better Luck Next Time...';
        document.getElementById('stayButton').setAttribute('hidden', 'true');
        document.getElementById('dealButton').innerHTML = 'Try Again!';
        document.getElementById('dealButton').setAttribute('onclick', 'game.startGame()');
      } else {
        this.checkWin(); // restart the check. the total is not <= 21
      }
    } else if (this.playerTotal == 21) {
      this.dealDealer();
    } else {
      // do nothing...
    }
  }

  dealDealer() {
    document.getElementById('dealerCards').removeAttribute('hidden');
    document.getElementById('dealerTotal').removeAttribute('hidden');
    let cards = '';

    // initial deal to get a more interesting effect from the pause.
    document.getElementById('dealerCards').innerHTML = 'Dealer: ' + cards;
    document.getElementById('dealerTotal').innerHTML = 'Total: ' + this.dealerTotal;

    while (this.dealerTotal <= this.playerTotal && this.dealerTotal < 21) {
      cards = '';
      setTimeout(1000); // dramatic pause
      this.addDealerCard();

      if (this.dealerTotal > 21) {
        // loop through hand to Check for aces and turn into ones if necesarry
        for (const card of this.dealerCards) {
          if (card.value == 11) {
            if (this.dealerTotal > 21) {
              card.value = 1;
              this.dealerTotal -= 10;
              document.getElementById('dealerTotal').innerHTML = 'Total: ' + this.dealerTotal;
            }
          }
        }
      }

      for (const card of this.dealerCards) {
        cards += card.name;
        cards += ', ';
      }

      document.getElementById('dealerCards').innerHTML = 'Dealer: ' + cards;
      document.getElementById('dealerTotal').innerHTML = 'Total: ' + this.dealerTotal;
    }

    document.getElementById('stayButton').setAttribute('hidden', 'true');
    document.getElementById('dealButton').innerHTML = 'Try Again!';
    document.getElementById('dealButton').setAttribute('onclick', 'game.startGame()');

    if (this.dealerTotal == 21) {
      if (this.playerTotal == 21) {
        // split pot.
        document.getElementById('comment').innerHTML = 'Game Over! Its a tie!';
      } else {
        // deller won
        document.getElementById('comment').innerHTML = 'Better Luck Next Time...';
      }
    } else if (this.dealerTotal > this.playerTotal && this.dealerTotal < 21) {
      // dealer won
      document.getElementById('comment').innerHTML = 'Better Luck Next Time...';
    } else {
      // player won
      document.getElementById('comment').innerHTML = 'Congrats! You Won!';
    }
  }

  // Adds a card to the dealersCard[] by removing a card from the main cards[] deck and pushing it into the dealersCards[]
  addDealerCard() {
    const randIndex = Math.floor(Math.random() * this.cards.length);
    const card = this.cards.splice(randIndex, 1)[0];

    this.dealerCards.push(card);

    this.dealerTotal += card.value;
  }
}

const game = new BlackJackGame();
