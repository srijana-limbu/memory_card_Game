const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");

let cards;
let interval;
let firstCard = false;
let secondCard = false;

//items array
const items = [
    { name: "bee", image: "./images/bee.png" },
    { name: "lion", image: "./images/lion.png" },
    { name: "flower", image: "./images/flower.png" },
    { name: "dog", image: "./images/dog.png" },
    { name: "horse", image: "./images/horse.png" },
    { name: "koala", image: "./images/koala.png" },
    { name: "wolf", image: "./images/wolf.png" },
    { name: "monkey", image: "./images/monkey.png" },
    { name: "peacock", image: "./images/peacock.png" },
    { name: "pearl-shell", image: "./images/pearl-shell.png" },
    { name: "pigeon", image: "./images/pigeon.png" },
    { name: "tree", image: "./images/tree.png" }
];

//Initial Time
let seconds = 0,
    minutes = 0;

//Initial moves and win count
let movesCount = 0;
winCount = 0;

//for timer
const timeGenerator = () => {
    seconds += 1;

    //minutes logic
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }

    //format time before displaying
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time: </span>${minutesValue}:${secondsValue}`;
};

//for calculating moves
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves: </span>${movesCount}`;
};

//pick random objects from the items array
const generateRandom = (size = 4) => {
    let tempArray = [...items];

    let cardValues = [];
    size = (size * size) / 2;
    //random object selection
    for (let i = 0; i < size; i++) {
        //Math.floor converts random number into integer index.
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);//adds the randomly selected item 
        tempArray.splice(randomIndex, 1); //remove once selected object to prevent duplicate
    }
    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
    // Clear the game counter's HTML content
    gameContainer.innerHTML = "";
    // Duplicate the cardValues array to create pairs of each card
    cardValues = [...cardValues, ...cardValues];
    //simple shuffle
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {
        //stores names of the cards to match later
        gameContainer.innerHTML += `
            <div class = "card-container" data-card-value = "${cardValues[i].name}">
                <div class = "card-before">?</div>
                <div class = "card-after"> 
                    <img src = "${cardValues[i].image}" class = "image"/>
                </div>
            </div>   
        `;
    }
    //grid
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;

    //cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {

            if (!card.classList.contains("matched")) {
                card.classList.add("flipped");

                if (!firstCard) {
                    firstCard = card;
                    //retrieves card's value from the card element.
                    firstCardValue = card.getAttribute("data-card-value");
                }
                else {
                    movesCounter();//increment moves count
                    //second card value
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    if (firstCardValue == secondCardValue) {
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        firstCard = false;  //reset 
                        winCount += 1;
                        //check if winCount  == half of cardValues
                        if (winCount == Math.floor(cardValues.length / 2)) {
                            result.innerHTML = `<h2> 🤷‍♀️You Won!✌️</>
                            <h4>Moves: ${movesCount}</h4>`;
                            stopGame();
                        }
                    }
                    else {
                        //if the cards don't match
                        //flip the cards back to normal
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 900);
                    }
                }
            }

        });
    });
};

//Start game
startButton.addEventListener("click", () => {
    movesCount = 0;
    time = 0;
    //controls and buttons visibility
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    //start timer
    interval = setInterval(timeGenerator, 1000);
    //initial moves
    moves.innerHTML = `<span>Moves: </span>${movesCount}`;
    initializer();
});

//stop game
stopButton.addEventListener("click", (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
 })
);

//initialize values and func calls
const initializer = () => {
    result.innerText = "";
    winCount = 0;
    // Generate a new set of card values
    let cardValues = generateRandom();
    console.log(cardValues);
    // Generate the game matrix with the new card values
    matrixGenerator(cardValues);
};

