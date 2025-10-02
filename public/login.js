import { showMessage } from "./MsgAlert.js";
import { socket } from "./Socket.js";
const codeRoom = document.querySelector("#codeRoom");
const nameUser = document.querySelector("#name");
const enterRoom = document.querySelector("#enterRoom");
const createRoom = document.querySelector("#createRoom");
const form = document.querySelector("form");
form.addEventListener("submit", (e) => e.preventDefault());

socket.on("errorRoom", (message) => showMessage({ contentMsg: message }));
console.log(socket);

socket.on("roomReady", (data) => {
  const playerTwo = data.players.find((user) => user !== nameUser.value);
  console.log(playerTwo);
  console.log(data);
  

  window.location.href = `Board.html?code=${data.code}&iam=${nameUser.value}&playertwo=${playerTwo}`;
});


//Entrar na sala
enterRoom.addEventListener("click", () => {
  if (!nameUser.value.trim() || !codeRoom.value.trim())
    return showMessage({ contentMsg: "Preencha os campos!" });

  socket.emit("enterRoom", {
    userName: nameUser.value,
    code: Number(codeRoom.value),
  });
  localStorage.setItem("@gameUserName", nameUser.value);
});

//Criar sala
createRoom.addEventListener("click", () => {
  if (!nameUser.value.trim())
    return showMessage({ contentMsg: "Informe seu nome!" });

  socket.emit("createRoom", nameUser.value);
  socket.on("getCodeRoom", (codeRoom) =>
    showMessage({
      contentMsg: `O código da sala é "${codeRoom}"`,
      contentLoading: "Aguardando próximo jogador...",
      handleClick: () => console.log("oi"),
    })
  );
});
