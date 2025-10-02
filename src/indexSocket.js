const { io } = require("./App");
const { checkVictory, isDraw } = require("./statusGame");

let rooms = [];

const connectSocket = () => {

//Reinicia e limpa o tempo
  const resetTimer = (room) => {
  clearInterval(room.interval);
  room.time = 20;
  room.interval = null;
  };
  
  //Controla o tempo e o qual usuario vai ser mostrado no front
  const setTimeMove = (room, user) => {
    room.time = 20;

    if (room.interval) {
      clearInterval(room.interval);
    }

    room.interval = setInterval(() => {
      room.time -= 1;

      if (room.time <= 0) {
        clearInterval(room.interval);
        room.time = 20;
        room.interval = null;
        room.turn = user.symbol === "X" ? "O" : "X";

        //Proocura o proximo jogador para mandar como parametro
        const nextUser = room.players.find((user) => user.symbol === room.turn);
        setTimeMove(room, nextUser);
      }

      io.to(room.code).emit("timeMove", {
        time: room.time,
        userTurn: user.player,
      });
    }, 1000);
  };

  io.on("connection", (socket) => {
    //Jogador é reconectado
    socket.on("reconnectUser", (data) => {
      const room = rooms.find((room) => room.code === data.code);
      if (!room) return;

      const user = room.players.find((user) => data.userName === user.player);

      if (user) {
        user.id = socket.id;
        socket.join(data.code);
      }
    });

    //Jogador Cria sala
    socket.on("createRoom", (userName) => {
      const code = Math.round(Math.random() * 10000);

      rooms.push({
        code: code,
        players: [
          {
            player: userName,
            id: socket.id,
            symbol: "X",
            scoreboard: 0,
          },
        ],
        board: Array(9).fill(null),
        turn: "X",
        interval: null,
        time: 11,
      });

      socket.join(code);

      socket.emit("getCodeRoom", code);
    });

    //Jogador entra na sala
    socket.on("enterRoom", (data) => {
      const isVerifyRoom = rooms.find((room) => data.code === room.code);

      if (!isVerifyRoom)
        return socket.emit("errorRoom", "Código de sala não existe!");

      if (isVerifyRoom.players.length >= 2)
        return socket.emit("errorRoom", "Sala está cheia");

      if (isVerifyRoom.players[0].player === data.userName) {
        return socket.emit("errorRoom", "Nome de usuário indisponível!");
      }
      isVerifyRoom.players.push({
        player: data.userName,
        id: socket.id,
        symbol: "O",
        scoreboard: 0,
      });

      socket.join(data.code);

      io.to(data.code).emit("roomReady", {
        code: data.code,
        players: [data.userName, isVerifyRoom.players[0].player],
      });

      setTimeMove(isVerifyRoom, isVerifyRoom.players[0]);
    });

    //Jogador seleciona celula
    socket.on("move", ({ codeRoom, indexCell }) => {
      const room = rooms.find((room) => room.code === codeRoom);

      if (!room) return;

      const user = room.players.find((user) => user.id === socket.id);
      if (!user) return;

      //Se simbolo(X/O) do jogador da vez não igual ao simbolo do jogador atual
      if (room.turn !== user.symbol) return;

      io.to(codeRoom).emit("setPositionCell", {
        index: indexCell,
        turn: room.turn,
      });
      room.board[indexCell] = user.symbol;

      //Checa se houve vitoria
      if (checkVictory(room.board, room.turn)) {
        user.scoreboard += 1;

        io.to(room.code).emit("statusGame", {
          winner: user.player,
          status: "victory",
          score: user.scoreboard,
        });
        // Reinicia o contador
        resetTimer(room)

        return;
        //Checa se houve empate
      } else if (isDraw(room.board)) {
        io.to(room.code).emit("statusGame", { winner: null, status: "draw" });
        // Reinicia o contador
        resetTimer(room)
        return;
      }
      //Procura o proximo usuario
      const playerTwo = room.players.find((user) => user.id !== socket.id);

      setTimeMove(room, playerTwo);

      //Troca o simbola da vez
      room.turn = user.symbol === "X" ? "O" : "X";
    });

    //Jogador reinicia jogo
    socket.on("restartGame", (codeRoom) => {
      const room = rooms.find((room) => room.code === codeRoom);
      if (!room) return;

      if (!room.clickStart) room.clickStart = 0;
      room.clickStart += 1;

      if (room.clickStart === 2) {
        room.board = Array(9).fill(null);
        room.turn = room.turn === "X" ? "O" : "X";
        room.clickStart = 0;

        // Reinicia o contador
        resetTimer(room)

        // Encontra o jogador do turno atual
        const currentUser = room.players.find(
          (player) => player.symbol === room.turn
        );

        // Reinicia o tempo com o jogador certo
        setTimeMove(room, currentUser);
      }
    });
  });
};

module.exports = connectSocket;
