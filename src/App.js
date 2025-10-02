const express = require("express");
const path = require('path')
const app = express();
app.use(express.static(path.join(__dirname, '../public')))

const serverHttp = require("http").createServer(app);

const { Server } = require("socket.io");

const io = new Server(serverHttp, { cors: { origin: "*" } });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"))
})




module.exports = {serverHttp, io}
