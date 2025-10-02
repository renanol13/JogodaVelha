const { serverHttp } = require("./App");
const connectSocket = require("./indexSocket");

const PORT = process.env.PORT || 3000;

serverHttp.listen(PORT, () => {
  connectSocket()
  console.log("Servidor rodando!");
});
