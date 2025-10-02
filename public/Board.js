import { socket } from "./Socket.js";
import { showMessage } from "./MsgAlert.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const playerOne = document.querySelector("#playerOne");
const playerTwo = document.querySelector("#playerTwo");
const scorePlayerOne = document.querySelector("#scorePlayerOne");
const scorePlayerTwo = document.querySelector("#scorePlayerTwo");
const cell = [...document.querySelectorAll(".cell")];
const setTime = document.querySelector("#setTime");

const iAm = urlParams.get("iam");

playerOne.textContent = iAm;
playerTwo.textContent = urlParams.get("playertwo");
const codeRoom = Number(urlParams.get("code"));

const setPositionCell = (data) => {
  const target = cell[data.index];
  if (target.innerText !== "") return;
  target.classList.add("cellActive");

  target.innerText = data.turn;
};

const restartGame = () => {
  cell.map((cell) => {
    cell.classList.remove("cellActive")
    cell.innerText = ""
  })

  socket.emit("restartGame", codeRoom);

};

//sockets

socket.on("timeMove", ({ time, userTurn }) => {
  
  
  setTime.innerText = String(time).padStart(2, "0")
  if (userTurn === iAm) {
    
    playerOne.classList.add('ActiveUserTurn')
    playerTwo.classList.remove('ActiveUserTurn')
  } 
  else if (userTurn === playerTwo.innerText) {
    
    playerTwo.classList.add('ActiveUserTurn')
    playerOne.classList.remove('ActiveUserTurn')
  }
});

socket.emit("reconnectUser", { code: codeRoom, userName: iAm });

socket.on("setPositionCell", (data) => setPositionCell(data));

//Verifica se o Jogador venceu ou deu empate
socket.on("statusGame", (data) => {
  let message = "";

  if (data.status === "victory") {
    if (data.winner === iAm) {
      scorePlayerOne.innerText = data.score;
      message = "Parabéns, você venceu!!";

      confetti({
        particleCount: 400,
        spread: 100,
        ticks: 400,
        colors: ["#1ABC9C", "#3498DB", "#ECF0F1"],
        origin: { x: 0.5, y: 0.5 },
      });
    } else {
      message = `O jogador "${data.winner}" venceu!`;
      scorePlayerTwo.innerText = data.score;
    }
  } else if (data.status === "draw") message = "Deu empate!";
  showMessage({
    contentMsg: message,
    handleClick: restartGame,
    contentButton: "Reiniciar jogo",
  });
});

//Jogador seleciona celula
const handleClick = (e) => {
  const index = cell.indexOf(e.target);
  e.target.classList.add("cellActive");

  socket.emit("move", { codeRoom: codeRoom, indexCell: index });
};

cell.map((cell) => {
  cell.addEventListener("click", handleClick);
});
