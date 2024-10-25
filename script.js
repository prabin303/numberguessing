let players = JSON.parse(localStorage.getItem("players")) || [];
let randomNumber = Math.floor(Math.random() * 100) + 1;
let guessCount = 1;
const maxGuesses = 15;
const guesses = document.querySelector(".guesses");
const lastResult = document.querySelector(".lastResult");
const lowOrHi = document.querySelector(".lowOrHi");
const guessSubmit = document.querySelector(".guessSubmit");
const guessField = document.querySelector(".guessField");
const playerNameInput = document.getElementById("playerName");
const rankings = document.querySelector(".rankings");
const resetRankingsBtn = document.querySelector(".resetRankings");
let resetButton;

guessField.focus();

document.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    playerNameInput.style.visibility = "hidden";
    guessField.focus();
  }
});

function savePlayers() {
  localStorage.setItem("players", JSON.stringify(players));
}

function checkGuess() {
  const userGuess = Number(guessField.value);
  if (guessCount === 1) {
    guesses.textContent = "Previous guesses: ";
  }
  guesses.textContent += `${userGuess}  `;

  if (userGuess === randomNumber) {
    lastResult.textContent = `Congratulations, ${playerNameInput.value}! You got it right in ${guessCount} tries!`;
    lastResult.style.backgroundColor = "green";
    lowOrHi.textContent = "";
    setGameOver();
  } else if (guessCount === maxGuesses) {
    lastResult.textContent = `!!!GAME OVER!!! The number was ${randomNumber}.`;
    setGameOver();
  } else {
    lastResult.textContent = "Wrong!";
    lastResult.style.backgroundColor = "red";
    if (userGuess < randomNumber) {
      lowOrHi.textContent = "Last guess was too low!";
      lowOrHi.style.color = "yellow";
    } else if (userGuess > randomNumber) {
      lowOrHi.textContent = "Last guess was too high!";
      lowOrHi.style.color = "orange";
    }
  }

  guessCount++;
  guessField.value = "";
  guessField.focus();
}

guessSubmit.addEventListener("click", checkGuess);

function updateRanking(playerName, attempts) {
  const playerIndex = players.findIndex((player) => player.name === playerName);
  if (playerIndex !== -1) {
    if (attempts < players[playerIndex].attempts) {
      players[playerIndex].attempts = attempts;
    }
  } else {
    players.push({ name: playerName, attempts: attempts });
  }
  players.sort((a, b) => a.attempts - b.attempts);
  savePlayers();
}

function displayRanking() {
  let rankingHTML = "";
  for (let i = 0; i < players.length; i++) {
    rankingHTML += `<p>${i + 1}. ${players[i].name} - ${
      players[i].attempts
    }  attempts</p>`;
  }
  rankings.innerHTML = rankingHTML;
}

function setGameOver() {
  guessField.disabled = true;
  guessSubmit.disabled = true;

  if (resetButton) {
    resetButton.removeEventListener("click", resetGame);
    resetButton.parentNode.removeChild(resetButton);
  }

  resetButton = document.createElement("button");
  resetButton.textContent = "Start new Game";
  document.body.append(resetButton);
  resetButton.addEventListener("click", resetGame);
  updateRanking(playerNameInput.value, guessCount);

  playerNameInput.value = "";
}

function resetGame() {
  guessCount = 1;
  randomNumber = Math.floor(Math.random() * 100) + 1;
  guessField.disabled = false;
  guessSubmit.disabled = false;
  guesses.textContent = "";
  lastResult.textContent = "";
  lowOrHi.textContent = "";
  guessField.value = "";
  playerNameInput.style.visibility = "visible";
  guessField.focus();
  displayRanking();
}

function resetRankings() {
  players = [];
  savePlayers();
  displayRanking();
}

resetRankingsBtn.addEventListener("click", resetRankings);

function init() {
  displayRanking();
}

init();