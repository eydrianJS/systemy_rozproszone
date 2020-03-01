export const postLogin = (value, socket) => {
  socket.emit("login", value)
};
