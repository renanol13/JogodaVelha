const socket = io({
  autoConnect: true, // conecta automaticamente
  reconnection: true,
});

export { socket } ;
